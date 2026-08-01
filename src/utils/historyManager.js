// LocalStorage keys for ChefAI User Data
const KEYS = {
  SAVED: 'chefai_saved_recipes',
  FAVORITES: 'chefai_favorite_recipes',
  GENERATED: 'chefai_generated_recipes',
  GROCERY: 'chefai_grocery_items',
};

function getItems(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return [];
  }
}

function notifyDataChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('chefai_data_changed'));
  }
}

function setItems(key, items) {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    notifyDataChanged();
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

/**
 * Transforms recipe ingredient strings into shopping-friendly "Ingredient Name — Quantity" format
 * @param {string} raw
 * @returns {string}
 */
export function normalizeIngredientForGrocery(raw) {
  if (!raw || typeof raw !== 'string') return raw || '';
  const str = raw.trim();
  if (!str) return '';

  // 1. Remove parenthetical descriptions like "(rinsed & drained)", "(165°F)"
  let basePart = str.replace(/\s*\([^)]*\)/g, '').trim();

  // 2. Separate prep instructions after a comma (e.g. ", diced", ", minced", ", sliced", ", finely chopped")
  const commaIndex = basePart.indexOf(',');
  if (commaIndex !== -1) {
    const main = basePart.slice(0, commaIndex).trim();
    const after = basePart.slice(commaIndex + 1).trim().toLowerCase();
    const prepWords = ['diced', 'chopped', 'minced', 'sliced', 'crushed', 'grated', 'peeled', 'halved', 'halving', 'rinsed', 'drained', 'trimmed', 'prepared', 'julienned', 'cubed', 'shredded', 'chopped fine'];
    if (prepWords.some(p => after.includes(p))) {
      basePart = main;
    }
  }

  // 3. Match quantity and unit at start of string
  // Units: cup, cups, tbsp, tsp, clove, cloves, g, kg, oz, lb, lbs, gram, grams, ml, l, large, medium, small
  const qtyRegex = /^((?:\d+(?:\.\d+)?|\d+\/\d+|\d+-\d+))\s*(cups?|tbsp|tsp|cloves?|g|kg|oz|lbs?|grams?|ml|l|large|medium|small)?\b/i;

  const match = basePart.match(qtyRegex);

  if (!match) {
    // No numeric quantity at start -> Clean prep words and capitalize
    const cleaned = cleanPrepWords(basePart);
    return capitalizeFirst(cleaned);
  }

  const fullQtyMatch = match[0].trim();
  let namePart = basePart.slice(match[0].length).trim();

  // Strip leading "of " (e.g. "1/2 cup of olive oil")
  if (/^of\s+/i.test(namePart)) {
    namePart = namePart.replace(/^of\s+/i, '');
  }

  // Clean mid-string prep descriptors
  namePart = cleanPrepWords(namePart);

  if (!namePart || namePart.length < 2) {
    return capitalizeFirst(str);
  }

  const formattedName = capitalizeFirst(namePart);
  return `${formattedName} — ${fullQtyMatch}`;
}

function cleanPrepWords(str) {
  return str
    .replace(/\b(freshly\s+grated|finely\s+minced|finely\s+chopped|crushed|cooked|ripe|diced|chopped|minced|sliced|peeled|prepared|rinsed|drained|halved)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const historyManager = {
  // --- Saved & Favorites ---
  getSavedRecipes() {
    return getItems(KEYS.SAVED);
  },
  getFavorites() {
    return getItems(KEYS.FAVORITES);
  },
  isFavorite(recipeName) {
    if (!recipeName) return false;
    return this.getFavorites().some((r) => r.name === recipeName);
  },
  saveFavorite(recipe) {
    if (!recipe || !recipe.name) return false;
    const list = this.getFavorites();
    const exists = list.some((r) => r.name === recipe.name);
    if (exists) {
      return false;
    }
    const updated = [{ ...recipe, timestamp: Date.now() }, ...list];
    setItems(KEYS.FAVORITES, updated);
    setItems(KEYS.SAVED, updated);
    return true;
  },
  toggleFavorite(recipe) {
    if (!recipe || !recipe.name) return false;
    const exists = this.isFavorite(recipe.name);
    if (exists) {
      this.removeFavorite(recipe.name);
      return false;
    } else {
      this.saveFavorite(recipe);
      return true;
    }
  },
  removeFavorite(recipeName) {
    const list = this.getFavorites().filter((r) => r.name !== recipeName);
    setItems(KEYS.FAVORITES, list);
    setItems(KEYS.SAVED, list);
  },
  getFavoritesCount() {
    return this.getFavorites().length;
  },

  // --- Recently Generated ---
  getGeneratedRecipes() {
    return getItems(KEYS.GENERATED);
  },
  addGeneratedRecipe(recipe) {
    if (!recipe || !recipe.name) return;
    const list = this.getGeneratedRecipes();
    const nameClean = recipe.name.trim().toLowerCase();
    const existingIndex = list.findIndex(
      (r) => r && r.name && r.name.trim().toLowerCase() === nameClean
    );

    let updatedRecipe = { ...recipe, timestamp: Date.now() };

    let newList;
    if (existingIndex !== -1) {
      const existingItem = list[existingIndex];
      updatedRecipe = {
        ...existingItem,
        ...recipe,
        timestamp: Date.now(),
      };
      newList = [updatedRecipe, ...list.filter((_, idx) => idx !== existingIndex)];
    } else {
      newList = [updatedRecipe, ...list];
    }

    setItems(KEYS.GENERATED, newList.slice(0, 30));
  },

  // --- Search History ---
  searchHistory(query) {
    if (!query.trim()) {
      return {
        generated: this.getGeneratedRecipes(),
        saved: this.getSavedRecipes(),
        favorites: this.getFavorites(),
      };
    }
    const q = query.toLowerCase();
    const filterFn = (item) =>
      item.name.toLowerCase().includes(q) ||
      (item.ingredients && item.ingredients.some((i) => i.toLowerCase().includes(q)));

    return {
      generated: this.getGeneratedRecipes().filter(filterFn),
      saved: this.getSavedRecipes().filter(filterFn),
      favorites: this.getFavorites().filter(filterFn),
    };
  },

  // --- Clear History ---
  clearAllHistory() {
    localStorage.removeItem(KEYS.SAVED);
    localStorage.removeItem(KEYS.FAVORITES);
    localStorage.removeItem(KEYS.GENERATED);
    localStorage.removeItem('chefai_viewed_recipes');
    notifyDataChanged();
  },

  // ==========================================
  // GROCERY LIST MANAGEMENT
  // ==========================================
  getGroceryItems() {
    return getItems(KEYS.GROCERY);
  },
  addRecipeToGrocery(recipe) {
    try {
      if (!recipe) return 0;
      let recipeObj = recipe;
      if (typeof recipe === 'string') {
        recipeObj = { name: recipe, ingredients: [recipe] };
      }

      const list = this.getGroceryItems();
      let ingredients = recipeObj.ingredients;
      if (!ingredients || !Array.isArray(ingredients)) {
        if (typeof ingredients === 'string') {
          ingredients = [ingredients];
        } else if (recipeObj.name) {
          ingredients = [recipeObj.name];
        } else {
          ingredients = [];
        }
      }

      const newItems = [];

      ingredients.forEach((ing) => {
        if (!ing) return;
        const rawStr = typeof ing === 'string' ? ing : String(ing);
        const ingStr = normalizeIngredientForGrocery(rawStr);
        const exists = list.some((item) => {
          if (!item) return false;
          const existingText = typeof item === 'string' ? item : item.ingredient;
          return existingText && existingText.trim().toLowerCase() === ingStr.trim().toLowerCase();
        });

        if (!exists) {
          newItems.push({
            id: `ing_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            recipeName: recipeObj.name || 'Recipe',
            recipeImg: recipeObj.img || '🍲',
            ingredient: ingStr,
            checked: false,
            addedAt: Date.now(),
          });
        }
      });

      const updated = [...newItems, ...list];
      setItems(KEYS.GROCERY, updated);
      return newItems.length;
    } catch (err) {
      console.error('Error adding recipe to grocery list:', err);
      return 0;
    }
  },
  toggleGroceryItem(id) {
    const list = this.getGroceryItems().map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(KEYS.GROCERY, list);
    return list;
  },
  removeGroceryItem(id) {
    const list = this.getGroceryItems().filter((item) => item.id !== id);
    setItems(KEYS.GROCERY, list);
    return list;
  },
  removeRecipeFromGrocery(recipeName) {
    const list = this.getGroceryItems().filter((item) => item.recipeName !== recipeName);
    setItems(KEYS.GROCERY, list);
    return list;
  },
  clearGroceryList() {
    localStorage.removeItem(KEYS.GROCERY);
    return [];
  },
  getGroceryCount() {
    return this.getGroceryItems().length;
  },
};
