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

  const handleSelectSimilar = (recipeName) => {
    if (!recipeName || !recipeName.trim()) return;

    setActiveView('home');
    setIsChatActive(true);
    setInputVal('');

    const formattedQuery = `Show recipe for ${recipeName}`;

    // 1. Add user message
    const userMsg = { id: Date.now(), type: 'user', text: formattedQuery };
    const typingMsg = { id: Date.now() + 1, type: 'typing' };

    setMessages((prev) => [...prev, userMsg, typingMsg]);

    // 2. Simulate AI response delay
    setTimeout(() => {
      const matchedRecipe = findOrGenerateRecipe(recipeName);

      // Save generated recipe to user history
      historyManager.addGeneratedRecipe(matchedRecipe);

      setMessages((prev) =>
        prev
          .filter((m) => m.type !== 'typing')
          .concat({ id: Date.now() + 2, type: 'recipe', recipe: matchedRecipe })
      );
    }, 1200);
  };

  const handleQuery = (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setActiveView('home');
    setIsChatActive(true);
    setInputVal('');

    const rawText = queryText.trim();

    // 1. ALWAYS ADD AND DISPLAY THE EXACT USER MESSAGE IMMEDIATELY
    const userMsg = { id: Date.now(), type: 'user', text: rawText };
    const typingMsg = { id: Date.now() + 1, type: 'typing' };

    setMessages((prev) => [...prev, userMsg, typingMsg]);

    // 2. PROCESS INTENT & GENERATE BOT RESPONSE SAFELY AFTER USER MESSAGE IS ACCEPTED
    setTimeout(() => {
      let intent = { type: 'recipe' };
      try {
        intent = classifyUserIntent(rawText);
      } catch (e) {
        console.error("Intent classification fallback:", e);
      }

      if (intent.type === 'conversational' || intent.type === 'cooking_qa') {
        setMessages((prev) =>
          prev
            .filter((m) => m.type !== 'typing')
            .concat({ id: Date.now() + 2, type: 'bot', text: intent.text })
        );
      } else {
        try {
          const matchedRecipe = findOrGenerateRecipe(rawText);

          if (matchedRecipe) {
            historyManager.addGeneratedRecipe(matchedRecipe);
            setMessages((prev) =>
              prev
                .filter((m) => m.type !== 'typing')
                .concat({ id: Date.now() + 2, type: 'recipe', recipe: matchedRecipe })
            );
          } else {
            setMessages((prev) =>
              prev
                .filter((m) => m.type !== 'typing')
                .concat({
                  id: Date.now() + 2,
                  type: 'bot',
                  text: "I'm ChefAI, your personal cooking assistant! 🧑‍🍳 Ask me for recipe ideas by listing your ingredients (e.g., 'tomatoes, chicken, rice') or ask me how to cook your favorite dish!"
                })
            );
          }
        } catch (e) {
          console.error("Recipe generation fallback:", e);
          setMessages((prev) =>
            prev
              .filter((m) => m.type !== 'typing')
              .concat({ id: Date.now() + 2, type: 'bot', text: "I'm ChefAI, your personal cooking assistant! 🧑‍🍳 Tell me what ingredients you have in your kitchen today!" })
          );
        }
      }
    }, 600);
  };

  return (
    <div className="relative z-10 w-full min-h-screen overflow-x-hidden transition-colors duration-300">
      {/* Background Floating Food Icons */}
      <FloatingIcons />

      {/* Global Backdrop Overlay */}
      <div
        id="overlay"
        className={`fixed inset-0 bg-black/30 z-30 overlay ${
          isSidebarOpen || isSettingsOpen ? 'active' : ''
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
