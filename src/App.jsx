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
import RecipeIdeasModal from './components/RecipeIdeasModal';
import PersonalizedModal from './components/PersonalizedModal';
import ScanIngredientsModal from './components/ScanIngredientsModal';
import MealPlannerModal from './components/MealPlannerModal';
import { findOrGenerateRecipe } from './data/recipes';
import { historyManager } from './utils/historyManager';
import { sendMessageToGemini } from './services/geminiService';

export default function App() {
  // Strict Theme Initialization: Always start in Light Mode if no saved preference exists
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('chefai_theme');
    if (!savedTheme) {
      localStorage.setItem('chefai_theme', 'light');
      return false;
    }
    return savedTheme === 'dark';
  });

  const [activeView, setActiveView] = useState('home'); // 'home' | 'favorites' | 'grocery'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRecipeIdeasOpen, setIsRecipeIdeasOpen] = useState(false);
  const [isPersonalizedOpen, setIsPersonalizedOpen] = useState(false);
  const [isScanIngredientsOpen, setIsScanIngredientsOpen] = useState(false);
  const [isMealPlannerOpen, setIsMealPlannerOpen] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [messages, setMessages] = useState([]);

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
    setMessages([]);
    setIsChatActive(false);
    setInputVal('');
    setActiveView('home');
    handleClosePanels();
  };

  const handleOpenGrocery = (recipe) => {
    historyManager.addRecipeToGrocery(recipe);
    setActiveView('grocery');
  };

  const handleSelectSimilar = async (recipeName) => {
    if (!recipeName || !recipeName.trim()) return;

    setActiveView('home');
    setIsChatActive(true);
    setInputVal('');

    const rawText = `Give me the complete recipe for ${recipeName.trim()}`;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: rawText,
    };

    const typingMsg = {
      id: Date.now() + 1,
      type: 'typing',
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: rawText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      console.log('Similar recipe response:', data);

      setMessages((prev) =>
        prev.filter((m) => m.type !== 'typing')
      );

      if (data.type === 'recipe' && data.recipe) {
        historyManager.addGeneratedRecipe(data.recipe);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            type: 'recipe',
            recipe: data.recipe,
          },
        ]);

        return;
      }

      throw new Error('ChefAI did not return a recipe.');

    } catch (error) {
      console.error('Similar recipe error:', error);

      setMessages((prev) =>
        prev
          .filter((m) => m.type !== 'typing')
          .concat({
            id: Date.now() + 3,
            type: 'bot',
            text: `Sorry, I couldn't generate the ${recipeName} recipe right now. Please try again.`,
          })
      );
    }
  };

  const handleQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setActiveView('home');
    setIsChatActive(true);
    setInputVal('');

    const rawText = queryText.trim();

    // Show user's message immediately
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: rawText,
    };

    const typingMsg = {
      id: Date.now() + 1,
      type: 'typing',
    };

    setMessages((prev) => [...prev, userMsg, typingMsg]);

    try {
      // Send message to ChefAI backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: rawText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      console.log('ChefAI API response:', data);

      // Remove typing indicator
      setMessages((prev) =>
        prev.filter((m) => m.type !== 'typing')
      );

      // --------------------------------
      // RECIPE RESPONSE
      // --------------------------------
      if (data.type === 'recipe' && data.recipe) {
        const recipe = data.recipe;

        // Save generated recipe to history
        historyManager.addGeneratedRecipe(recipe);

        // Display using existing beautiful RecipeCard
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            type: 'recipe',
            recipe: recipe,
          },
        ]);

        return;
      }

      // --------------------------------
      // NORMAL BOT RESPONSE
      // --------------------------------
      if (data.type === 'bot' && data.text) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            type: 'bot',
            text: data.text,
          },
        ]);

        return;
      }

      // --------------------------------
      // BACKWARD COMPATIBILITY
      // --------------------------------
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            type: 'bot',
            text: data.reply,
          },
        ]);

        return;
      }

      // Unexpected response
      throw new Error(
        'Invalid response received from ChefAI server.'
      );

    } catch (error) {
      console.error('ChefAI request error:', error);

      setMessages((prev) =>
        prev
          .filter((m) => m.type !== 'typing')
          .concat({
            id: Date.now() + 3,
            type: 'bot',
            text:
              'Sorry, I could not connect to ChefAI right now. Please make sure the ChefAI server is running.',
          })
      );
    }
  };

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
                onStartCooking={() => {
                  setActiveView('home');
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
