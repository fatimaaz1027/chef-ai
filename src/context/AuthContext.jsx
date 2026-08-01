import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext(null);

function formatAuthError(error) {
  if (!error) return 'An unexpected error occurred.';
  const code = error.code || '';
  switch (code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in popup was closed before completing.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google Sign-In in Firebase Console.';
    case 'auth/operation-not-allowed':
      return 'Google Sign-In is not enabled in your Firebase Console.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.':
      return 'Invalid Firebase configuration. Please check your .env file.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    default:
      if (error.message && !error.message.includes('Firebase:')) {
        return error.message;
      }
      return 'Authentication failed. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const formattedUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Chef User',
          photoURL: firebaseUser.photoURL || null,
          loggedInAt: Date.now()
        };
        setUser(formattedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter your email and password.');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;
      const formattedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Chef User',
        photoURL: firebaseUser.photoURL || null,
        loggedInAt: Date.now()
      };
      setUser(formattedUser);
      return formattedUser;
    } catch (err) {
      console.error('Login error:', err);
      throw new Error(formatAuthError(err));
    }
  };

  const signup = async (email, password) => {
    if (!email || !password) {
      throw new Error('Please enter your email and password.');
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const firebaseUser = userCredential.user;
      const formattedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Chef User',
        photoURL: firebaseUser.photoURL || null,
        createdAt: Date.now()
      };
      setUser(formattedUser);
      return formattedUser;
    } catch (err) {
      console.error('Signup error:', err);
      throw new Error(formatAuthError(err));
    }
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase configuration missing. Please set your Firebase credentials in .env file.');
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const formattedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Chef User',
        photoURL: firebaseUser.photoURL || null,
        loggedInAt: Date.now()
      };
      setUser(formattedUser);
      return formattedUser;
    } catch (err) {
      console.error('Google Auth Error:', err);
      throw new Error(formatAuthError(err));
    }
  };

  const resetPassword = async (email) => {
    if (!email) {
      throw new Error('Please enter your email address.');
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err) {
      console.error('Password reset error:', err);
      throw new Error(formatAuthError(err));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        resetPassword,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
