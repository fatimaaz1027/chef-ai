import React, { useState, useEffect, useRef } from 'react';
import FloatingIcons from './components/FloatingIcons';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SettingsPanel from './components/SettingsPanel';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PopularRecipes from './components/PopularRecipes';
import EmptyState from './components/EmptyState';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import GroceryModal from './components/GroceryModal';
import FavoritesPage from './components/FavoritesPage';
import GroceryPage from './components/GroceryPage';
import PreferencesPage from './components/PreferencesPage';
import RecipeIdeasModal from './components/RecipeIdeasModal';
import PersonalizedModal from './components/PersonalizedModal';
import ScanIngredientsModal from './components/ScanIngredientsModal';
import MealPlannerModal from './components/MealPlannerModal';
import { findOrGenerateRecipe } from './data/recipes';
import { historyManager } from './utils/historyManager';
import { chatHistoryManager } from './utils/chatHistoryManager';
import { sendMessageToGemini } from './services/geminiService';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';

function ChefAIAppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Strict Theme Initialization: Always start in Light Mode if no saved preference exists
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('chefai_theme');
    if (!savedTheme) {
      localStorage.setItem('chefai_theme', 'light');
      return false;
    }
    return savedTheme === 'dark';
  });

  const [activeView, setActiveView] = useState('home'); // 'home' | 'favorites' | 'grocery' | 'preferences'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecipeIdeasOpen, setIsRecipeIdeasOpen] = useState(false);
  const [isPersonalizedOpen, setIsPersonalizedOpen] = useState(false);
  const [isScanIngredientsOpen, setIsScanIngredientsOpen] = useState(false);
  const [isMealPlannerOpen, setIsMealPlannerOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const currentConvIdRef = useRef(currentConversationId);
  useEffect(() => {
    currentConvIdRef.current = currentConversationId;
  }, [currentConversationId]);

  const handleMealRecipeSubmit = (recipe) => {
    if (recipe) {
      historyManager.addGeneratedRecipe(recipe);
    }
    setActiveView('home');
    setIsChatActive(true);
    const botMsg = {
      id: Date.now(),
      sender: 'bot',
      type: 'recipe',
      recipe: recipe
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const handleOpenSavedRecipe = (recipe) => {
    if (!recipe) return;
    setActiveView('home');
    setIsChatActive(true);
    const botMsg = {
      id: Date.now(),
      sender: 'bot',
      type: 'recipe',
      recipe: recipe
    };
    setMessages((prev) => [...prev, botMsg]);
  };

  const [inputVal, setInputVal] = useState('');
  const [groceryRecipe, setGroceryRecipe] = useState(null);

  const chatEndRef = useRef(null);

  // Sync Dark mode state with HTML class & localStorage preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('chefai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('chefai_theme', 'light');
    }
  }, [darkMode]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isChatActive && activeView === 'home') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatActive, activeView]);

  const handleToggleDark = () => setDarkMode((prev) => !prev);
  const handleClosePanels = () => {
    setIsSidebarOpen(false);
    setIsSettingsOpen(false);
  };

  const handleClearChat = () => {
    setCurrentConversationId(null);
    currentConvIdRef.current = null;
    setMessages([]);
    messagesRef.current = [];
    setIsChatActive(false);
    setInputVal('');
    setActiveView('home');
    handleClosePanels();
  };

  const handleSelectConversation = (conv) => {
    if (!conv) return;
    setCurrentConversationId(conv.id);
    currentConvIdRef.current = conv.id;
    const convMsgs = conv.messages || [];
    setMessages(convMsgs);
    messagesRef.current = convMsgs;
    setIsChatActive(true);
    setActiveView('home');
  };

  const handleOpenGrocery = (recipe) => {
    historyManager.addRecipeToGrocery(recipe);
    setActiveView('grocery');
  };

  const processChatMessage = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setActiveView('home');
    setIsChatActive(true);
    setInputVal('');

    const rawText = queryText.trim();
    const userPrefs = historyManager.getPreferences();

    let activeConvId = currentConvIdRef.current;
    let isNewConv = false;
    if (!activeConvId) {
      activeConvId = `conv_${user?.uid || 'anon'}_${Date.now()}`;
      setCurrentConversationId(activeConvId);
      currentConvIdRef.current = activeConvId;
      isNewConv = true;
    }

    const userMsg = {
      id: `msg_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sender: 'user',
      type: 'user',
      text: rawText,
      timestamp: Date.now(),
    };

    const typingMsg = {
      id: `msg_typing_${Date.now()}`,
      sender: 'bot',
      type: 'typing',
    };

    const currentList = messagesRef.current.filter((m) => m.type !== 'typing');
    const updatedMessagesWithUser = [...currentList, userMsg];

    setMessages([...updatedMessagesWithUser, typingMsg]);
    messagesRef.current = [...updatedMessagesWithUser, typingMsg];

    const firstText = updatedMessagesWithUser[0]?.text || rawText;
    const convTitle = firstText.length > 35 ? `${firstText.slice(0, 35)}...` : firstText;

    const currentConvObj = {
      id: activeConvId,
      title: convTitle,
      messages: updatedMessagesWithUser,
      createdAt: isNewConv ? Date.now() : undefined,
      updatedAt: Date.now(),
    };

    // Immediately save user message to Firebase & LocalStorage
    if (user && user.uid) {
      chatHistoryManager.saveConversation(user.uid, currentConvObj);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: rawText,
          preferences: userPrefs,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('ChefAI API response:', data);

      const baseList = messagesRef.current.filter((m) => m.type !== 'typing');

      let botMsg;
      if (data.type === 'recipe' && data.recipe) {
        historyManager.addGeneratedRecipe(data.recipe);
        botMsg = {
          id: `msg_bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sender: 'bot',
          type: 'recipe',
          recipe: data.recipe,
          timestamp: Date.now(),
        };
      } else if (data.type === 'bot' && data.text) {
        botMsg = {
          id: `msg_bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sender: 'bot',
          type: 'bot',
          text: data.text,
          timestamp: Date.now(),
        };
      } else if (data.reply) {
        botMsg = {
          id: `msg_bot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          sender: 'bot',
          type: 'bot',
          text: data.reply,
          timestamp: Date.now(),
        };
      } else {
        throw new Error('Invalid response received from ChefAI server.');
      }

      const finalMessages = [...baseList, botMsg];
      setMessages(finalMessages);
      messagesRef.current = finalMessages;

      if (user && user.uid) {
        chatHistoryManager.saveConversation(user.uid, {
          id: activeConvId,
          title: convTitle,
          messages: finalMessages,
          createdAt: currentConvObj.createdAt,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error('ChefAI request error:', error);

      const baseList = messagesRef.current.filter((m) => m.type !== 'typing');
      const errDisplayMsg = {
        id: `msg_err_${Date.now()}`,
        sender: 'bot',
        type: 'bot',
        text: 'Sorry, I could not connect to ChefAI right now. Please make sure the ChefAI server is running.',
      };
      setMessages([...baseList, errDisplayMsg]);
      messagesRef.current = [...baseList, errDisplayMsg];
    }
  };

  const handleQuery = (queryText) => processChatMessage(queryText);

  const handleSelectSimilar = (recipeName) => {
    if (!recipeName || !recipeName.trim()) return;
    const rawText = `Give me the complete recipe for ${recipeName.trim()}`;
    processChatMessage(rawText);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="relative z-10 w-full min-h-screen overflow-x-hidden transition-colors duration-300">
      {/* Background Floating Food Icons */}
      <FloatingIcons />

      {/* Global Backdrop Overlay */}
      <div
        id="overlay"
        className={`fixed inset-0 bg-black/30 z-30 overlay ${isSidebarOpen || isSettingsOpen ? 'active' : ''
          }`}
        onClick={handleClosePanels}
      ></div>

      {/* Left Menu & Navigation Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        onNewChat={handleClearChat}
        onOpenRecipeIdeas={() => setIsRecipeIdeasOpen(true)}
        onOpenPersonalized={() => setIsPersonalizedOpen(true)}
        onOpenScanIngredients={() => setIsScanIngredientsOpen(true)}
        onOpenMealPlanner={() => setIsMealPlannerOpen(true)}
        onSelectRecipe={(recipe) => {
          handleClosePanels();
          handleOpenSavedRecipe(recipe);
        }}
        onSelectChat={(title) => {
          handleClosePanels();
          handleQuery(title);
        }}
        onSelectFeature={(query) => {
          handleClosePanels();
          handleQuery(query);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        user={user}
        onSelectConversation={(conv) => {
          handleClosePanels();
          handleSelectConversation(conv);
        }}
        onClearChat={handleClearChat}
      />

      {/* Recipe Ideas Modal */}
      <RecipeIdeasModal
        isOpen={isRecipeIdeasOpen}
        onClose={() => setIsRecipeIdeasOpen(false)}
        onSubmitQuery={handleQuery}
      />

      {/* Personalized Recommendations Modal */}
      <PersonalizedModal
        isOpen={isPersonalizedOpen}
        onClose={() => setIsPersonalizedOpen(false)}
        onSubmitQuery={handleQuery}
      />

      {/* Scan Ingredients Modal */}
      <ScanIngredientsModal
        isOpen={isScanIngredientsOpen}
        onClose={() => setIsScanIngredientsOpen(false)}
        onSubmitQuery={handleQuery}
      />

      {/* Meal Planner Modal */}
      <MealPlannerModal
        isOpen={isMealPlannerOpen}
        onClose={() => setIsMealPlannerOpen(false)}
        onSubmitRecipe={handleMealRecipeSubmit}
      />

      {/* Right Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        darkMode={darkMode}
        onToggleDark={handleToggleDark}
        onClearHistory={handleClearChat}
        onLogout={logout}
      />

      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(true)}
        onToggleSettings={() => setIsSettingsOpen(true)}
        onToggleDark={handleToggleDark}
        onClearChat={handleClearChat}
        onGoHome={handleClearChat}
        darkMode={darkMode}
      />

      {/* Main Content Container with top and bottom padding */}
      <main id="main-content" className="max-w-4xl mx-auto px-3 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-48 sm:pb-44">
        {/* Home View */}
        {activeView === 'home' && (
          !isChatActive ? (
            <>
              {/* Landing Hero View */}
              <HeroSection
                onSelectQuery={handleQuery}
                onSelectChip={(chipVal) => {
                  setInputVal((prev) => (prev ? `${prev}, ${chipVal}` : chipVal));
                  const el = document.getElementById('chat-input');
                  el?.focus();
                }}
                onFocusInput={() => {
                  const el = document.getElementById('chat-input');
                  el?.focus();
                  setTimeout(() => {
                    document.getElementById('chat-input')?.focus();
                  }, 50);
                }}
              />
            </>
          ) : (
            /* Active Chat View */
            <div id="chat-container" className="chat-container space-y-4 pt-4 sm:pt-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onOpenGrocery={handleOpenGrocery}
                  onSelectSimilar={handleSelectSimilar}
                />
              ))}
              <div ref={chatEndRef} />
            </div>
          )
        )}

        {/* Favorites View */}
        {activeView === 'favorites' && (
          <FavoritesPage
            onGoHome={() => setActiveView('home')}
            onOpenGrocery={handleOpenGrocery}
            onSelectSimilar={handleSelectSimilar}
          />
        )}

        {/* Grocery List View */}
        {activeView === 'grocery' && (
          <GroceryPage onGoHome={() => setActiveView('home')} />
        )}

        {/* Preferences View */}
        {activeView === 'preferences' && (
          <PreferencesPage onGoHome={() => setActiveView('home')} />
        )}
      </main>

      {/* Bottom Floating Input Bar */}
      <ChatInput
        inputVal={inputVal}
        setInputVal={setInputVal}
        onSubmit={handleQuery}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChefAIAppContent />
    </AuthProvider>
  );
}
