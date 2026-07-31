# ChefAI - React + Tailwind CSS Web Application

Production-ready, clean React conversion of the Canva-generated ChefAI web application prototype.

## 🚀 Features

- **Exact Design Match**: 100% fidelity to the original Canva layout, typography (`Poppins`), color palette, glassmorphic styling, and animations.
- **React + Tailwind Architecture**: Fully modular components (`Navbar`, `Sidebar`, `SettingsPanel`, `HeroSection`, `FeaturesSection`, `PopularRecipes`, `EmptyState`, `QuickChips`, `ChatInput`, `ChatMessage`, `RecipeCard`, `GroceryModal`).
- **Interactive AI Recipe Generator**: Generates rich recipe cards complete with macros (Calories, Protein, Carbs, Fat), ingredients lists, step-by-step instructions, chef tips, and interactive save/copy/share/grocery checklist modal.
- **Dark Mode Support**: Seamless toggle between light & sleek dark mode (`#0f172a` slate background).
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.
- **Standalone Preview**: Includes `standalone.html` for direct browser viewing without Node requirements.

## 📂 Project Structure

```
chef-ai/
├── public/
│   └── hero.jpg              # High resolution AI Chef visual
├── src/
│   ├── components/
│   │   ├── ChatInput.jsx       # Floating bottom glassmorphic input bar
│   │   ├── ChatMessage.jsx     # User bubble & typing indicator renderer
│   │   ├── EmptyState.jsx      # Suggested prompt pills
│   │   ├── FeaturesSection.jsx # Grid of 12 feature cards
│   │   ├── FloatingIcons.jsx   # Background animated food emojis
│   │   ├── GroceryModal.jsx    # Interactive checklist modal for ingredients
│   │   ├── HeroSection.jsx     # Glowing banner & primary CTAs
│   │   ├── Navbar.jsx          # Header with navigation & toggles
│   │   ├── PopularRecipes.jsx  # Horizontally scrollable recipe cards
│   │   ├── RecipeCard.jsx      # AI recipe output with macros & actions
│   │   ├── SettingsPanel.jsx   # Slide-over right drawer for settings
│   │   └── Sidebar.jsx         # Slide-over left drawer for chat history
│   ├── data/
│   │   └── recipes.js          # Recipes database & fallback generator
│   ├── App.jsx                 # App state & view manager
│   ├── index.css               # Tailwind directives & glassmorphism
│   └── main.jsx                # React root mount
├── index.html                  # Vite HTML entry
├── standalone.html             # Direct browser double-click preview
├── package.json                # Project dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS theme & animation extensions
└── postcss.config.js           # PostCSS configuration
```

## 🛠️ How to Run in VS Code

### Option 1: Standard Vite Development Server
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

### Option 2: Direct Browser / Live Server
Simply open `standalone.html` in your browser or right-click `standalone.html` in VS Code and select **Open with Live Server**.

## 🌐 Deploy to Vercel / Netlify / GitHub Pages

1. Push this folder to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Set build command to `npm run build` and output directory to `dist`.
4. Deploy!
