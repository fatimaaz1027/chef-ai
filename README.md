# 🍳 ChefAI

## AI-Powered Personalized Meal Planning Assistant

ChefAI is an AI-powered meal planning and nutrition assistant designed to help users streamline cooking, recipe discovery, and dietary management. Powered by Google Gemini AI, ChefAI acts as an interactive culinary assistant that enables users to:

- Interact conversationally with an AI chef for culinary advice and recipes
- Generate detailed recipes with complete ingredients, step-by-step instructions, and nutritional macros
- Personalize multi-day meal plans based on taste, dietary restrictions, and goals
- Select dietary preferences, with support for choosing **two** preferences simultaneously
- Select preferred global cuisines
- Scan ingredient images to identify kitchen items and generate matching meals
- Discover creative, low-waste recipes based on available kitchen ingredients
- Maintain chat history and saved recipe collections

---

## 🔗 Live Demo

[Live Demo](https://chef-ai-self.vercel.app/)

---

## ✨ Features

### 🤖 AI Chef Chat
Engage in conversational AI interactions with ChefAI to ask for meal ideas, recipe modifications, cooking advice, and ingredient substitutions in real-time.

### 🍽️ AI Recipe Generator
Generates comprehensive recipe cards containing:
- Prep time, cook time, and difficulty level
- Detailed ingredients lists with precise measurements
- Step-by-step cooking instructions
- Nutritional macros (Calories, Protein, Carbs, Fat)
- Professional chef tips and suggestions

### 🥗 Personalized Meal Planner
Tailor recipe recommendations and multi-day meal plans to specific lifestyle requirements.
- **Dietary Preferences**: Supports selecting **two dietary preferences simultaneously** (e.g., High Protein + Low Carb, Vegetarian + Gluten-Free, Vegan + Dairy-Free).
- **Cuisine Preferences**: Select from global culinary styles including Pakistani, Indian, Italian, Chinese, Mediterranean, Mexican, and more.

### 📸 Scan Ingredients
User provides/scans an ingredient image (via device camera or file upload) → ChefAI processes the image → ingredients are identified and extracted → ChefAI uses those identified ingredients to generate relevant recipe recommendations.

### 🥕 Ingredient-Based Suggestions
Enter ingredients currently available in your fridge or pantry to generate delicious, low-waste recipes tailored to what you already have.

### 💬 Chat History
Automatically records past chat sessions, user queries, and AI responses. History is stored locally and synchronized with Cloud Firestore for authenticated users, allowing seamless retrieval of previous recipe conversations.

### 🔐 Firebase Authentication
Provides secure user authentication supporting Email/Password sign-up and login alongside single-tap **🔵 Google Sign-In**.

### 🛒 Grocery List
Convert recipe ingredients directly into an interactive checklist. Users can manage items, add custom grocery entries, check off purchased items, and export lists.

### 📄 PDF Export
Client-side PDF document generation for recipes using `jsPDF` and `html2canvas`, allowing users to download styled recipe documents.

### 🌙 Dark Mode
Seamless toggle between light mode and dark slate aesthetic for comfortable viewing day or night.

### 📱 Responsive Design
Fully responsive layout engineered for smartphones, tablets, and desktop displays.

---

## ⚡ Recipe Actions

ChefAI provides a rich set of actions on generated recipe cards:

- **❤️ Save**: Bookmark recipes to your personal favorites collection.
- **📤 Share**: Share formatted recipe summaries and links.
- **📋 Copy**: One-click clipboard copy of recipe details and instructions.
- **🖨️ Print**: Open a clean, printer-friendly browser view.
- **📄 PDF Export**: Export styled PDF documents via `jsPDF`.
- **🛒 Add to Grocery List**: Add recipe ingredients directly to your grocery checklist.

---

## 🛠️ Tech Stack

### Frontend
- **React** (v18) - UI component library
- **Vite** - Build tool and development server
- **JavaScript (ES6+)** - Client-side application logic
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - UI icon library
- **react-markdown** - Markdown formatting renderer

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Server framework for REST API endpoints

### AI Integration
- **Google Gemini API** (`@google/genai`) - Multimodal AI models for text generation and ingredient image processing

### Authentication & Data Storage
- **Firebase Authentication** - User authentication (Email/Password & Google Sign-In)
- **Firebase Cloud Firestore** - Cloud NoSQL database for persisting user preferences, favorites, and history

### Utilities
- **CORS** - Cross-Origin Resource Sharing middleware
- **dotenv** - Environment variable management
- **jsPDF & html2canvas** - Client-side PDF generation

### Deployment & Hosting
- **Vercel** - Frontend hosting & serverless function execution

---

## 🏗️ Architecture

ChefAI uses a decoupled architecture for local development and serverless production execution.

### Production Flow

```
React + Vite Frontend
        ↓
POST /api/chat
        ↓
Vercel Serverless Function
        ↓
Express Backend
        ↓
Google Gemini API
        ↓
AI Response
        ↓
Frontend
```

### Firebase Data Flow

```
Firebase
├── Authentication (Email/Password & Google Sign-In)
└── Cloud Firestore (User favorites, preferences, & chat history)
```

### Local Development Flow

```
React / Vite (http://localhost:5173)
        ↓
Vite proxy (/api)
        ↓
Local Express server (http://localhost:5000)
        ↓
Google Gemini API
```

Local development routes API calls through Vite's proxy to a running local Express server, while Vercel production wraps the Express backend in serverless endpoints.

---

## 🔌 /api/chat

The core API endpoint `POST /api/chat` handles message requests between the frontend and the Gemini model.

- **Serverless Entrypoint**: `api/index.js` exposes the Express application as a Vercel serverless function.
- **Express Server Route**: `server/index.js` processes requests, manages prompt formatting, invokes Google Gemini API via `@google/genai`, and returns structured recipe/chat JSON responses.

---

## 🚀 Vercel Deployment

ChefAI is deployed live on Vercel:

👉 **[Live Application](https://chef-ai-self.vercel.app/)**

### Deployment Setup
- **Frontend Hosting**: React build static files served via Vercel Edge Network.
- **Serverless API**: API endpoints under `/api/chat` and `/api/detect-ingredients` execute inside Vercel's serverless environment via `api/index.js`.
- **Environment Variables**: Production keys (`GEMINI_API_KEY`, `VITE_FIREBASE_*`) are configured securely in Vercel Project Settings.

---

## 🔑 Environment Variables

The project uses a `.env` file for local development.

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

GEMINI_API_KEY=your_gemini_api_key
```

### Configuration Notes
- `.env` is used strictly for local development.
- `VITE_FIREBASE_*` variables are injected into the client bundle at build time by Vite.
- `GEMINI_API_KEY` is utilized by the backend server / serverless functions only.
- Production environment variables must be configured directly within the Vercel dashboard.
- Never commit actual API keys or credentials to public repositories.

---

## 📂 Project Structure

```
chef-ai/
├── api/
│   └── index.js                   # Vercel serverless function entrypoint
├── public/
│   ├── chef-avatar.png            # Application logo & avatar
│   └── hero.jpg                   # Hero section banner visual
├── server/
│   ├── index.js                   # Express server & Gemini endpoint logic
│   └── package.json               # Server package configuration
├── src/
│   ├── components/
│   │   ├── AuthScreen.jsx         # Login, Sign-Up & Google Auth modal
│   │   ├── ChatInput.jsx          # User prompt input bar & actions
│   │   ├── ChatMessage.jsx        # Chat message & markdown renderer
│   │   ├── EmptyState.jsx         # Quick prompt suggestions view
│   │   ├── FavoritesPage.jsx      # Saved recipes page
│   │   ├── FeaturesSection.jsx    # Features grid section
│   │   ├── FloatingIcons.jsx      # Animated background elements
│   │   ├── GroceryModal.jsx       # Ingredient checklist modal
│   │   ├── GroceryPage.jsx        # Full grocery manager page
│   │   ├── HeroSection.jsx        # Hero banner & action buttons
│   │   ├── MealPlannerModal.jsx   # Multi-day meal planner generator
│   │   ├── Navbar.jsx             # Navigation header & theme controls
│   │   ├── PersonalizedModal.jsx  # Meal preference selection modal
│   │   ├── PopularRecipes.jsx     # Recommended recipes scroll view
│   │   ├── PreferencesPage.jsx    # Profile dietary & cuisine settings
│   │   ├── QuickChips.jsx         # Quick prompt suggestion pills
│   │   ├── RecipeCard.jsx         # Interactive recipe card with actions
│   │   ├── RecipeIdeasModal.jsx   # Ingredient-based recipe generator modal
│   │   ├── ScanIngredientsModal.jsx # Image upload & camera scan modal
│   │   ├── SettingsPanel.jsx      # Settings slide-over drawer
│   │   ├── Sidebar.jsx            # Chat history drawer
│   │   └── SkeletonLoader.jsx     # Loading shimmer animation
│   ├── context/                   # AuthContext & ThemeContext providers
│   ├── data/                      # Static recipe data presets
│   ├── services/                  # Client API services (gemini.js, imageDetector.js)
│   ├── utils/                     # Utilities (pdfService.js, historyManager.js, chatHistoryManager.js)
│   ├── firebase.js                # Firebase SDK initialization
│   ├── index.css                  # Tailwind styles & utility directives
│   ├── App.jsx                    # Root application component
│   └── main.jsx                   # React entrypoint
├── index.html                     # Main HTML template
├── package.json                   # Root package dependencies & scripts
├── package-lock.json              # Dependency lockfile
├── postcss.config.js              # PostCSS configuration
├── tailwind.config.js             # Tailwind CSS theme configuration
├── vercel.json                    # Vercel rewrite configuration
├── vite.config.js                 # Vite bundler & proxy configuration
└── README.md                      # Project documentation
```

---

## 💻 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/fatimaaz1027/chef-ai.git
   cd chef-ai
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your credentials as described in the Environment Variables section.

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   Open `http://localhost:5173` in your web browser.

---

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
```

Vite compiles and bundles frontend assets into the `dist/` directory, ready for production deployment.

---

## 🛠️ Technical Challenges & Solutions

- **Firebase + Vite Environment Variables**: Vite requires client-accessible environment variables to be prefixed with `VITE_` and injected at compile time. In Vercel deployments, all `VITE_FIREBASE_*` keys must be configured in Vercel project settings prior to build execution.
- **Firebase Authentication Authorized Domains**: For Google Sign-In OAuth redirects to work properly in production, the Vercel domain (`chef-ai-self.vercel.app`) must be added to Authorized Domains in the Firebase Auth Console.
- **Vercel Serverless `/api/chat` Route**: Local Express servers run continuously on port 5000, whereas Vercel uses stateless serverless functions. `api/index.js` wraps the Express app so Vercel can execute API endpoints dynamically.
- **Express + Serverless Integration**: Wrapping the Express server instance in `api/index.js` allowed the application to keep modular Express route logic without needing to re-architect endpoints into individual standalone serverless scripts.
- **Gemini API Key Security**: The `GEMINI_API_KEY` is maintained strictly on the server/serverless layer. Frontend components call `/api/chat` via HTTP POST, keeping sensitive API keys hidden from client-side JavaScript bundles.

---

## 🔮 Future Improvements

- 🛒 **AI-Generated Grocery Lists**: Automatically generate categorized shopping lists grouped by supermarket aisle.
- 📊 **Calorie & Macronutrient Tracking**: Comprehensive daily nutrition dashboard and target logging.
- 💰 **Budget-Based Meal Planning**: Recipe recommendations tailored to specific financial constraints.
- 🔄 **Smart Meal Replacement**: Real-time ingredient substitutions based on pantry availability or food allergies.
- 🎙️ **Voice Interaction**: Hands-free voice commands and step-by-step audio cooking instructions.
- 🇵🇰 **Enhanced Regional Cuisine Support**: Expanded catalog and deeper support for authentic Pakistani and South Asian recipes.
- ⚙️ **Advanced AI Personalization**: Personalization algorithms powered by user rating history and favorite recipes.

---

## 👩‍💻 Developer

**Fatima Tu Zohra**
