import { recipesDatabase } from '../data/recipes';

// Default pool of recipes structured per meal type
const POOL = {
  Breakfast: [
    {
      name: "Avocado & Egg Breakfast Toast",
      img: "🥑",
      difficulty: "Beginner",
      servings: "1 Serving",
      time: "15 min",
      calories: "340 cal",
      protein: "16g",
      carbs: "28g",
      fat: "18g",
      ingredients: ["2 slices whole grain bread", "2 large poached eggs", "1 ripe avocado", "Chili flakes & sea salt"],
      steps: ["Toast bread.", "Mash avocado with salt.", "Poach eggs.", "Assemble toast with egg and chili flakes."],
      tip: "Drizzle extra virgin olive oil over the toast for rich flavor.",
      tags: ["#Quick&Easy", "#HighProtein", "#Vegetarian"]
    },
    {
      name: "Shakshuka (Poached Eggs in Tomato Sauce)",
      img: "🍳",
      difficulty: "Beginner",
      servings: "2 Servings",
      time: "25 min",
      calories: "320 cal",
      protein: "18g",
      carbs: "12g",
      fat: "22g",
      ingredients: ["4 large organic eggs", "3 ripe tomatoes", "1 onion", "2 cloves garlic", "Olive oil & paprika"],
      steps: ["Sauté onions and garlic.", "Add tomatoes and simmer.", "Make wells and crack eggs.", "Cover and cook on low heat."],
      tip: "Top with crumbled feta cheese.",
      tags: ["#Quick&Easy", "#Vegetarian", "#LowCarb"]
    },
    {
      name: "Fluffy Banana & Berry Oatmeal Bowl",
      img: "🥣",
      difficulty: "Beginner",
      servings: "1 Serving",
      time: "10 min",
      calories: "290 cal",
      protein: "12g",
      carbs: "52g",
      fat: "5g",
      ingredients: ["1 cup rolled oats", "1 sliced banana", "1/2 cup fresh berries", "1 tbsp honey", "Almond milk"],
      steps: ["Cook oats in almond milk.", "Top with sliced banana and berries.", "Drizzle honey."],
      tip: "Add chia seeds for extra fiber.",
      tags: ["#Vegetarian", "#Gluten-Free", "#Quick&Easy"]
    },
    {
      name: "High-Protein Omelette with Spinach & Cheese",
      img: "🥚",
      difficulty: "Beginner",
      servings: "1 Serving",
      time: "12 min",
      calories: "360 cal",
      protein: "24g",
      carbs: "4g",
      fat: "26g",
      ingredients: ["3 large eggs", "1 cup fresh spinach", "1/4 cup shredded cheddar cheese", "1 tbsp butter"],
      steps: ["Whisk eggs with salt and pepper.", "Melt butter in pan and cook spinach.", "Pour eggs over spinach and sprinkle cheese.", "Fold in half when set."],
      tip: "Cook on low heat to keep eggs tender.",
      tags: ["#HighProtein", "#LowCarb", "#Vegetarian"]
    }
  ],
  Lunch: [
    {
      name: "Lemon Herb Chicken & Quinoa Rice Bowl",
      img: "🍗",
      difficulty: "Intermediate",
      servings: "2 Servings",
      time: "35 min",
      calories: "550 cal",
      protein: "42g",
      carbs: "48g",
      fat: "16g",
      ingredients: ["2 chicken breasts", "1 cup quinoa or jasmine rice", "Lemon juice", "Garlic & herbs", "Broccoli"],
      steps: ["Marinate chicken with lemon & garlic.", "Sear chicken until golden.", "Cook quinoa.", "Serve in a bowl with broccoli."],
      tip: "Rest chicken 5 mins before slicing.",
      tags: ["#HighProtein", "#Gluten-Free"]
    },
    {
      name: "Mediterranean Chickpea & Salad Bowl",
      img: "🥗",
      difficulty: "Beginner",
      servings: "2 Servings",
      time: "20 min",
      calories: "380 cal",
      protein: "16g",
      carbs: "46g",
      fat: "14g",
      ingredients: ["1 can chickpeas", "Cucumber", "Cherry tomatoes", "Olive oil & lemon", "Feta cheese"],
      steps: ["Rinse chickpeas.", "Chop cucumber and tomatoes.", "Toss with olive oil dressing and top with feta."],
      tip: "Add Kalamata olives for extra zest.",
      tags: ["#Vegetarian", "#Gluten-Free", "#LowCarb"]
    },
    {
      name: "Creamy Tomato & Basil Pasta",
      img: "🍝",
      difficulty: "Intermediate",
      servings: "3 Servings",
      time: "25 min",
      calories: "490 cal",
      protein: "14g",
      carbs: "68g",
      fat: "18g",
      ingredients: ["250g penne pasta", "Ripe tomatoes", "Fresh basil", "Garlic & cream", "Parmesan"],
      steps: ["Boil pasta.", "Sauté garlic and tomatoes.", "Stir in cream & basil.", "Toss with pasta."],
      tip: "Use pasta water to smooth out sauce.",
      tags: ["#Vegetarian", "#Quick&Easy"]
    },
    {
      name: "Grilled Chicken Caesar Wrap",
      img: "🌯",
      difficulty: "Beginner",
      servings: "1 Serving",
      time: "15 min",
      calories: "480 cal",
      protein: "36g",
      carbs: "34g",
      fat: "20g",
      ingredients: ["1 grilled chicken breast, sliced", "1 whole wheat wrap", "Romaine lettuce", "Caesar dressing", "Parmesan"],
      steps: ["Toss lettuce with Caesar dressing.", "Place on wrap with chicken & parmesan.", "Roll tightly and slice diagonally."],
      tip: "Warm wrap before rolling for easy folding.",
      tags: ["#HighProtein", "#Quick&Easy"]
    }
  ],
  Dinner: [
    {
      name: "Grilled Salmon & Roasted Asparagus",
      img: "🐟",
      difficulty: "Intermediate",
      servings: "2 Servings",
      time: "30 min",
      calories: "480 cal",
      protein: "38g",
      carbs: "10g",
      fat: "32g",
      ingredients: ["2 salmon fillets", "1 bunch asparagus", "Olive oil & lemon", "Garlic & dill"],
      steps: ["Season salmon & asparagus with olive oil and dill.", "Roast at 400°F for 15 mins.", "Serve with fresh lemon squeeze."],
      tip: "Pat salmon dry before seasoning for crisp skin.",
      tags: ["#HighProtein", "#LowCarb", "#Gluten-Free"]
    },
    {
      name: "Vegetable Stir-Fry & Brown Rice",
      img: "🍚",
      difficulty: "Beginner",
      servings: "2 Servings",
      time: "20 min",
      calories: "410 cal",
      protein: "18g",
      carbs: "54g",
      fat: "12g",
      ingredients: ["Mixed vegetables (peppers, broccoli, carrots)", "Cooked brown rice", "Low-sodium soy sauce", "Sesame oil"],
      steps: ["Stir fry vegetables on high heat.", "Add soy sauce and sesame oil.", "Serve over hot brown rice."],
      tip: "Do not overcook vegetables so they stay crisp.",
      tags: ["#Vegetarian", "#Quick&Easy", "#LowCarb"]
    },
    {
      name: "Classic Italian Chicken Parmesan",
      img: "🍕",
      difficulty: "Advanced",
      servings: "3 Servings",
      time: "40 min",
      calories: "620 cal",
      protein: "46g",
      carbs: "38g",
      fat: "28g",
      ingredients: ["Chicken cutlets", "Marinara sauce", "Mozzarella & Parmesan", "Breadcrumbs", "Fresh basil"],
      steps: ["Bread chicken and fry until golden.", "Top with marinara and cheese.", "Bake until cheese melts."],
      tip: "Use fresh mozzarella for superior melt.",
      tags: ["#HighProtein"]
    },
    {
      name: "Pakistani Chicken Karahi & Naan",
      img: "🍲",
      difficulty: "Intermediate",
      servings: "3 Servings",
      time: "35 min",
      calories: "580 cal",
      protein: "44g",
      carbs: "32g",
      fat: "26g",
      ingredients: ["500g bone-in chicken", "4 tomatoes, chopped", "Ginger & garlic paste", "Green chilies", "Garam masala & cumin"],
      steps: ["Fry chicken in oil until white.", "Add tomatoes, ginger, garlic & spices.", "Cook on high heat until tomatoes form gravy.", "Garnish with julienned ginger & cilantro."],
      tip: "Cook in a cast iron wok for authentic karahi aroma.",
      tags: ["#HighProtein"]
    }
  ]
};

// Filter pool recipes by preferences
function filterRecipes(list, prefs) {
  let filtered = [...list];

  if (prefs.dietary === 'Vegetarian') {
    filtered = filtered.filter((r) => {
      const ingStr = (r.ingredients || []).join(' ').toLowerCase();
      const isMeat = /chicken|beef|mutton|lamb|fish|salmon|pork|turkey|seafood|shrimp/.test(ingStr);
      return !isMeat;
    });
  } else if (prefs.dietary === 'High Protein') {
    filtered = filtered.filter((r) => parseInt(r.protein || '0') >= 20 || (r.tags || []).includes('#HighProtein'));
  } else if (prefs.dietary === 'Low Carb') {
    filtered = filtered.filter((r) => parseInt(r.carbs || '100') <= 30 || (r.tags || []).includes('#LowCarb'));
  }

  return filtered.length > 0 ? filtered : list;
}

/**
 * Modular API-Ready Meal Plan Generator
 * Currently filters local pool/database.
 * Can be replaced by an external AI API (e.g. Gemini API).
 */
export async function generateMealPlan(preferences) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const durationDays = parseInt(preferences.duration || '7', 10);
  const mealsConfig = preferences.mealsPerDay || 'Breakfast + Lunch + Dinner';

  let selectedMealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  if (mealsConfig === 'Lunch + Dinner') {
    selectedMealTypes = ['Lunch', 'Dinner'];
  } else if (mealsConfig === 'Breakfast + Dinner') {
    selectedMealTypes = ['Breakfast', 'Dinner'];
  }

  // Random offset for regeneration variety
  const offset = Math.floor(Math.random() * 10);

  const days = [];
  for (let i = 1; i <= durationDays; i++) {
    const dayMeals = [];
    selectedMealTypes.forEach((type) => {
      const candidateList = filterRecipes(POOL[type] || POOL.Lunch, preferences);
      // Pick recipe cyclically with random offset for fresh variety
      const recipeIndex = (i - 1 + offset) % candidateList.length;
      const recipe = candidateList[recipeIndex];

      dayMeals.push({
        type,
        recipe
      });
    });

    days.push({
      dayNumber: i,
      dayName: `Day ${i}`,
      meals: dayMeals
    });
  }

  const summaryParts = [
    `${durationDays} Days`,
    `${selectedMealTypes.length} Meals/Day`
  ];
  if (preferences.dietary && preferences.dietary !== 'No Preference') {
    summaryParts.push(preferences.dietary);
  }
  if (preferences.cuisine && preferences.cuisine !== 'Any Cuisine') {
    summaryParts.push(preferences.cuisine);
  }

  return {
    duration: durationDays,
    mealsPerDay: selectedMealTypes,
    preferencesSummary: summaryParts.join(' • '),
    days
  };
}

/**
 * Single Meal Swap Utility
 */
export function getSwapMealCandidate(mealType, currentRecipeName, preferences = {}) {
  const candidateList = filterRecipes(POOL[mealType] || POOL.Lunch, preferences);
  const alternates = candidateList.filter((r) => r.name !== currentRecipeName);
  if (alternates.length > 0) {
    const randomIndex = Math.floor(Math.random() * alternates.length);
    return alternates[randomIndex];
  }
  return candidateList[0];
}
