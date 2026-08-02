import { db, isFirebaseConfigured } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc
} from 'firebase/firestore';

const LOCAL_STORAGE_CONVERSATIONS_KEY = 'chefai_chat_conversations';

function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('chefai_data_changed'));
  }
}

export const chatHistoryManager = {
  // Read conversations from LocalStorage
  getLocalConversations(userId) {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CONVERSATIONS_KEY);
      if (!raw) return [];
      const all = JSON.parse(raw);
      if (!userId) return all;
      return all.filter((c) => c && (c.userId === userId || !c.userId));
    } catch (e) {
      console.error('Error reading local chat conversations', e);
      return [];
    }
  },

  // Save conversations to LocalStorage
  saveLocalConversations(conversations) {
    try {
      localStorage.setItem(LOCAL_STORAGE_CONVERSATIONS_KEY, JSON.stringify(conversations));
      notifyDataChanged();
    } catch (e) {
      console.error('Error saving local chat conversations', e);
    }
  },

  // Save or update a conversation synchronously locally and asynchronously in Firebase Firestore
  async saveConversation(userId, conversation) {
    if (!userId || !conversation || !conversation.id) return;

    const convData = {
      id: conversation.id,
      userId: userId,
      title: conversation.title || 'Chat Conversation',
      messages: conversation.messages || [],
      createdAt: conversation.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    // 1. Synchronously update LocalStorage
    try {
      const local = this.getLocalConversations();
      const idx = local.findIndex((c) => c && c.id === conversation.id);
      let updatedLocal;
      if (idx !== -1) {
        updatedLocal = [...local];
        updatedLocal[idx] = convData;
      } else {
        updatedLocal = [convData, ...local];
      }
      this.saveLocalConversations(updatedLocal);
    } catch (e) {
      console.error('Error saving conversation to local storage:', e);
    }

    // 2. Persist to Firebase Firestore for current authenticated user
    if (isFirebaseConfigured && db) {
      try {
        const convRef = doc(db, `users/${userId}/conversations`, conversation.id);
        await setDoc(convRef, convData, { merge: true });
      } catch (err) {
        console.warn('Firestore save conversation notice (local backup active):', err);
      }
    }
  },

  // Fetch all conversations for current authenticated user
  async fetchUserConversations(userId) {
    if (!userId) return [];

    let conversations = [];

    // 1. Fetch from Firebase Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        const convsRef = collection(db, `users/${userId}/conversations`);
        const q = query(convsRef, orderBy('updatedAt', 'desc'));
        const snapshot = await getDocs(q);

        snapshot.forEach((docSnap) => {
          if (docSnap.exists()) {
            conversations.push(docSnap.data());
          }
        });
      } catch (err) {
        console.warn('Firestore fetch conversations notice (using local fallback):', err);
      }
    }

    // 2. Fetch from LocalStorage and merge
    const local = this.getLocalConversations(userId);

    const map = new Map();
    conversations.forEach((c) => map.set(c.id, c));
    local.forEach((c) => {
      if (!map.has(c.id) || (c.updatedAt && c.updatedAt > (map.get(c.id)?.updatedAt || 0))) {
        map.set(c.id, c);
      }
    });

    const merged = Array.from(map.values()).sort(
      (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
    );

    return merged;
  },

  // Clear all conversations for authenticated user
  async clearUserHistory(userId) {
    if (!userId) return;

    // 1. Clear LocalStorage for user
    try {
      const local = this.getLocalConversations();
      const remaining = local.filter((c) => c && c.userId !== userId && c.userId);
      this.saveLocalConversations(remaining);
    } catch (e) {
      console.error('Error clearing local user history:', e);
    }

    // 2. Clear Firebase Firestore documents for user
    if (isFirebaseConfigured && db) {
      try {
        const convsRef = collection(db, `users/${userId}/conversations`);
        const snapshot = await getDocs(convsRef);
        const deletePromises = [];
        snapshot.forEach((docSnap) => {
          deletePromises.push(deleteDoc(docSnap.ref));
        });
        await Promise.all(deletePromises);
      } catch (err) {
        console.warn('Firestore clear user history notice:', err);
      }
    }

    notifyDataChanged();
  }
};
