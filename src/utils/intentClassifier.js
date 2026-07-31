// Conversational Greetings, Acknowledgements & Common Words dictionary
const GREETINGS_MAP = {
  hi: "Hello! 👋 I'm ChefAI, your personal cooking assistant. Tell me what ingredients you have in your kitchen or what recipe you'd like to cook today!",
  hello: "Hello there! 🧑‍🍳 I'm ChefAI. What ingredients do you have in your pantry today?",
  hey: "Hey! 👋 Ready to cook something delicious? Tell me what ingredients you have!",
  heyy: "Hey there! 🍳 What can I help you cook today?",
  greetings: "Greetings! 👨‍🍳 How can I assist you with your cooking today?",
  "how are you": "I'm doing great and ready to help you cook! 🥗 What ingredients do you have in your kitchen?",
  "how are you?": "I'm doing great and ready to help you cook! 🥗 What ingredients do you have in your kitchen?",
  "what's up": "Not much, just ready to find some great recipes for you! 🍳 What's in your fridge?",
  "whats up": "Ready to whip up something tasty! 🍲 What ingredients do you have?",
  "how's it going": "It's going great! 👨‍🍳 Let's find a delicious recipe for you today.",
  thanks: "You're very welcome! 😊 Let me know whenever you need more recipe ideas or cooking tips!",
  "thank you": "You're very welcome! 😊 Happy cooking, and let me know if you need anything else!",
  thx: "You're welcome! 🍳 Let me know if you need more recipes!",
  ty: "You're welcome! 😊 Happy cooking!",
  ok: "Awesome! Let me know whenever you're ready to explore new recipes or plan your meals! 🥗",
  okay: "Sounds good! Tell me what ingredients you have whenever you're ready to cook! 🍲",
  sure: "Great! Feel free to list your ingredients or ask for recipe suggestions anytime! 🥑",
  cool: "Awesome! Let me know what you'd like to cook today! 🍳",
  "got it": "Perfect! I'm here whenever you need meal ideas or recipes! 👨‍🍳",
  bye: "Goodbye! 🍲 Have a wonderful meal and happy cooking!",
  goodbye: "Goodbye! 🍳 Come back anytime you need recipe inspiration!",
  "good morning": "Good morning! 🌅 Ready for a delicious breakfast or meal plan today?",
  "good evening": "Good evening! 🌙 What would you like to cook for dinner tonight?",
  "good night": "Good night! 😴 Have a great rest!",
  "who are you": "I'm ChefAI, your intelligent cooking assistant! 🧑‍🍳 I can suggest recipes based on ingredients you have, plan weekly meals, or recommend dish ideas.",
  "what can you do": "I can help you create delicious recipes from ingredients in your fridge, generate weekly meal plans, scan ingredient photos, and recommend tailored recipes! 🥘"
};

const CONVERSATIONAL_WORDS = new Set([
  "hi", "hello", "hey", "heyy", "hola", "greetings", "howdy",
  "thanks", "thank", "thx", "ty", "cheers", "welcome",
  "ok", "okay", "sure", "cool", "alright", "nice", "great", "awesome",
  "bye", "goodbye", "yes", "yep", "yeah", "no", "nope",
  "what", "why", "how", "who", "where", "when", "is", "are", "am", "was", "were",
  "the", "a", "an", "this", "that", "it", "its", "it's", "tell", "show", "say", "please"
]);

const CONVERSATIONAL_PHRASES = [
  "hi", "hello", "hey", "heyy", "hola", "greetings",
  "how are you", "how are you?", "how is it going", "how's it going",
  "what's up", "whats up", "what's up?", "whats up?",
  "thanks", "thank you", "thx", "ty", "thanks!", "thank you!",
  "ok", "okay", "sure", "cool", "got it", "alright",
  "bye", "goodbye", "good morning", "good evening", "good night",
  "who are you", "what can you do", "tell me something"
];

const RECIPE_KEYWORDS = [
  "recipe", "recipes", "cook", "cooking", "make", "dish", "dishes", "meal", "meals",
  "food", "eat", "eating", "ingredient", "ingredients", "breakfast", "lunch", "dinner",
  "snack", "dessert", "spicy", "healthy", "protein", "carb", "low carb", "vegetarian",
  "vegan", "soup", "salad", "pasta", "pizza", "curry", "sauce", "bake", "roast", "fry",
  "grill", "ideas", "suggest", "recommend", "calories", "nutrition", "prep"
];

const KNOWN_INGREDIENTS = [
  "tomato", "tomatoes", "chicken", "egg", "eggs", "cheese", "rice", "garlic", "onion",
  "onions", "beef", "fish", "salmon", "potato", "potatoes", "pasta", "spinach", "milk",
  "butter", "bread", "mushroom", "mushrooms", "avocado", "zucchini", "bell pepper",
  "lemon", "cucumber", "tofu", "beans", "carrot", "carrots", "shrimp", "paneer", "meat"
];

/**
 * Classifies user intent safely:
 * @param {string} rawQuery
 * @returns {{ type: 'conversational' | 'recipe' | 'cooking_qa', text?: string }}
 */
export function classifyUserIntent(rawQuery) {
  try {
    if (!rawQuery || !rawQuery.trim()) {
      return {
        type: 'conversational',
        text: "Hello! What would you like to cook today?"
      };
    }

    const raw = rawQuery.trim();
    const lower = raw.toLowerCase();
    const cleaned = lower.replace(/[^\w\s\?]/g, '');
    const words = cleaned.split(/\s+/).filter(Boolean);

    // 1. COOKING & CULINARY QUESTION INTENT (e.g. "how long to boil eggs", "how to store tomatoes...")
    if (
      lower.includes('how long') ||
      lower.includes('how to store') ||
      lower.includes('how to thaw') ||
      lower.includes('how to freeze') ||
      lower.includes('what temperature') ||
      lower.includes('how do i know when') ||
      (lower.startsWith('how to') && !lower.includes('make') && !lower.includes('cook'))
    ) {
      if (lower.includes('boil') && lower.includes('egg')) {
        return {
          type: 'cooking_qa',
          text: "🥚 **How to Boil Eggs:**\n- **Soft-boiled (runny yolk)**: 6–7 minutes in boiling water.\n- **Medium-boiled (jammy yolk)**: 7–8 minutes.\n- **Hard-boiled (firm yolk)**: 9–10 minutes.\n\n*Tip: Transfer eggs to an ice water bath right after boiling for easy peeling!*"
        };
      }
      if (lower.includes('store') && lower.includes('tomato')) {
        return {
          type: 'cooking_qa',
          text: "🍅 **How to Store Tomatoes:**\nStore ripe tomatoes at room temperature away from direct sunlight, stem-side down. Only refrigerate if they are fully ripe and you need to extend their shelf life by 1-2 days!"
        };
      }
      return {
        type: 'cooking_qa',
        text: `👨‍🍳 **Chef Tip:** For cooking techniques like "${raw}", always maintain medium heat, monitor doneness with a food thermometer, and season towards the end of cooking for optimal flavor!`
      };
    }

    // 2. GENERAL NUTRITION / DEFINITION QUESTIONS (e.g. "what is protein?", "tell me something")
    if (lower.includes('what is protein') || lower.includes('what are carbs') || lower.includes('tell me something') || lower.includes('what is chefai')) {
      if (lower.includes('protein')) {
        return {
          type: 'conversational',
          text: "🥩 **Protein** is an essential macronutrient made of amino acids that builds and repairs body tissues, muscles, and organs! High-protein foods include chicken, eggs, fish, lentils, tofu, and Greek yogurt."
        };
      }
      if (lower.includes('tell me something')) {
        return {
          type: 'conversational',
          text: "💡 **Fun Cooking Fact:** Squeezing fresh lemon juice over cooked greens or roasted vegetables right before serving enhances their natural flavors without adding extra salt!"
        };
      }
    }

    // 3. EXACT CONVERSATIONAL GREETINGS & ACKNOWLEDGEMENTS
    if (CONVERSATIONAL_PHRASES.includes(cleaned) || GREETINGS_MAP[cleaned]) {
      return {
        type: 'conversational',
        text: GREETINGS_MAP[cleaned] || "Hello! I'm ChefAI. What ingredients do you have in your kitchen today?"
      };
    }

    // 4. SHORT CONVERSATIONAL SENTENCES & WORDS (e.g. "hi", "hello", "thanks", "ok", "cool", "hi there")
    if (words.length <= 3) {
      const firstWord = words[0];
      if (CONVERSATIONAL_WORDS.has(firstWord)) {
        const hasFoodWord = words.some((w) => RECIPE_KEYWORDS.includes(w) || KNOWN_INGREDIENTS.includes(w));
        if (!hasFoodWord) {
          return {
            type: 'conversational',
            text: GREETINGS_MAP[firstWord] || "Hello! Tell me what ingredients you have in your kitchen today!"
          };
        }
      }
    }

    // 5. EXPLICIT RECIPE / INGREDIENT SIGNALS -> RECIPE INTENT
    const recipeSignals = [
      'i have', 'what can i make', 'what can i cook', 'recipe', 'recipes',
      'give me', 'show me', 'suggest', 'recommend', 'cook', 'make',
      'breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'spicy',
      'healthy', 'high protein', 'quick', 'easy'
    ];

    const hasRecipeSignal = recipeSignals.some((s) => lower.includes(s));
    const hasKnownIngredient = words.some((w) => KNOWN_INGREDIENTS.includes(w));

    // If query has explicit recipe signals OR known ingredients OR food combinations ("chicken and rice"), return 'recipe'
    if (hasRecipeSignal || hasKnownIngredient || lower.includes(' and ') || lower.includes(',')) {
      return { type: 'recipe' };
    }

    // 6. SINGLE WORD NOUNS / UNKNOWN FOOD INGREDIENTS (e.g. "zucchini", "avocado", "mushrooms", "tofu")
    if (words.length === 1 && !CONVERSATIONAL_WORDS.has(words[0])) {
      return { type: 'recipe' };
    }

    // 7. DEFAULT TO CONVERSATIONAL CHAT FOR OTHER NON-FOOD SENTENCES
    return {
      type: 'conversational',
      text: "I'm ChefAI, your personal cooking assistant! 🧑‍🍳 Ask me for recipe ideas by listing your ingredients (e.g., 'tomatoes, chicken, rice') or ask me how to cook your favorite dish!"
    };
  } catch (err) {
    console.error("Error in classifyUserIntent:", err);
    return { type: 'recipe' };
  }
}
