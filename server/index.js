const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({ path: "../.env" });

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.json({ status: "ChefAI Server Running", port: PORT });
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, preferences } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message is required.",
      });
    }

    let preferencesContext = "";
    if (preferences) {
      const dietaryString = Array.isArray(preferences.dietary)
        ? preferences.dietary.join(", ")
        : preferences.dietary || "No Preference";

      preferencesContext = `
USER SAVED PREFERENCES (CRITICAL: MUST RESPECT AND ADHERE TO THESE IN ALL RECOMMENDATIONS & RECIPES):
- Cuisine Style: ${preferences.cuisine || "Any Cuisine"}
- Dietary Preferences: ${dietaryString}
- Spice Level: ${preferences.spice || "No Preference"}
- Cooking Skill Level: ${preferences.skill || "Any Level"}
- Budget: ${preferences.budget || "No Preference"}

CRITICAL REQUIREMENT:
Whenever generating a recipe, meal idea, ingredient advice, or response, you MUST consider and strictly follow these user preferences as much as reasonably possible:
1. DIETARY: Strictly respect dietary preferences (e.g. Vegetarian, Vegan, Halal, Low Carb, High Protein, Gluten-Free, Keto, Dairy-Free). If Vegetarian or Vegan, NEVER include meat, poultry, or fish. If Halal, ensure all ingredients are Halal-compliant.
2. CUISINE: Adapt the recipe style, seasonings, and dish type to match the user's preferred Cuisine (e.g., Pakistani, Indian, Italian, Chinese, Mediterranean, Mexican).
3. SPICE LEVEL: Match the spice level (Mild, Medium, Spicy, Extra Spicy).
4. COOKING SKILL: Keep cooking instructions appropriate for the user's skill level (Beginner, Intermediate, Advanced).
5. BUDGET: Respect budget considerations for ingredient selection.
`;
    }

    const prompt = `
You are ChefAI, a friendly and professional AI cooking assistant.
${preferencesContext}

User message:
"${message}"

Your job is to understand what the user wants and return ONLY valid JSON.

RULE 1: RECIPE REQUESTS

If the user is asking for:
- a recipe
- a recipe using ingredients
- what they can cook
- a meal idea
- cooking instructions
- a dish to make
- a recipe for a specific dish

return this exact JSON structure:

{
  "type": "recipe",
  "recipe": {
    "name": "Recipe name",
    "img": "🍳",
    "desc": "Short appetizing description",
    "time": "25 min",
    "servings": "2",
    "difficulty": "Easy",
    "calories": "380 cal",
    "protein": "42g",
    "carbs": "12g",
    "fat": "18g",
    "ingredients": [
      "2 chicken breasts",
      "3 tomatoes",
      "2 cloves garlic"
    ],
    "steps": [
      "Season the chicken with salt and pepper.",
      "Heat oil in a pan and cook the chicken until golden.",
      "Add the tomatoes and garlic and simmer until cooked."
    ],
    "tip": "Add fresh herbs before serving for extra flavor.",
    "tags": [
      "#Quick&Easy",
      "#HighProtein"
    ],
    "dietary": [
      "🥜 Nut-Free",
      "🌾 Gluten-Free"
    ],
    "similar": [
      {
        "name": "Similar Recipe",
        "time": "20 min",
        "calories": "300 cal",
        "img": "🍲"
      }
    ]
  }
}

RECIPE RULES:
- Return ONLY valid JSON.
- Do NOT use Markdown.
- Do NOT use triple backticks.
- Do NOT add explanations outside the JSON.
- ingredients MUST be an array of strings.
- steps MUST be an array of strings.
- tags MUST be an array.
- dietary MUST be an array.
- similar MUST be an array.
- Make the recipe practical and realistic.
- Use the ingredients provided by the user whenever possible.
- You may include common pantry ingredients when necessary.
- Keep cooking times realistic.
- Give clear step-by-step instructions.
- Nutrition values should be reasonable estimates.
- The recipe should be suitable for the ingredients the user mentioned.

RULE 2: NORMAL COOKING QUESTIONS OR CONVERSATION

If the user is NOT asking for a recipe and instead asks a cooking question, asks for advice, says hello, asks about an ingredient, or has a normal cooking-related conversation, return ONLY this JSON structure:

{
  "type": "bot",
  "text": "Your helpful ChefAI response here."
}

NORMAL RESPONSE RULES:
- Return ONLY valid JSON.
- Do NOT use Markdown outside the JSON string.
- Keep the response friendly and useful.
- Answer the user's actual question.
- Do not generate a recipe unless the user asks for one.

IMPORTANT:
Always return valid JSON.
Never return plain text.
Never return JSON inside triple backticks.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    // Remove accidental Markdown code fences
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(text);
    } catch (parseError) {
      console.error("Gemini JSON parse error:", parseError);
      console.error("Gemini returned:", text);

      // Safe fallback
      parsedResponse = {
        type: "bot",
        text: text,
      };
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error("Gemini API error:", error);
    console.error("Error message:", error?.message);
    console.error("Error status:", error?.status);
    console.error("Error details:", error?.details);

    res.status(500).json({
      error: "Failed to get a response from Gemini.",
    });
  }
});
// ==================== GEMINI MEAL PLANNER ====================

app.post("/api/meal-plan", async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return res.status(400).json({
        error: "Meal planner preferences are required.",
      });
    }

    const duration = parseInt(preferences.duration || "7", 10);

    const mealsPerDay = preferences.mealsPerDay || "Breakfast + Lunch + Dinner";

    let selectedMeals;

    if (mealsPerDay === "Breakfast + Lunch + Dinner") {
      selectedMeals = ["Breakfast", "Lunch", "Dinner"];
    } else if (mealsPerDay === "Lunch + Dinner") {
      selectedMeals = ["Lunch", "Dinner"];
    } else if (mealsPerDay === "Breakfast + Dinner") {
      selectedMeals = ["Breakfast", "Dinner"];
    } else {
      selectedMeals = ["Breakfast", "Lunch", "Dinner"];
    }

    const prompt = `
You are ChefAI, an expert AI meal-planning assistant.

Create a completely fresh personalized meal plan.

USER PREFERENCES:
- Duration: ${duration} days
- Meals per day: ${mealsPerDay}
- Dietary preference: ${preferences.dietary || "No Preference"}
- Cuisine: ${preferences.cuisine || "Any Cuisine"}
- Spice level: ${preferences.spice || "No Preference"}
- Budget: ${preferences.budget || "No Preference"}
- Cooking skill: ${preferences.skill || "Any Level"}

MEAL TYPES:
${selectedMeals.join(", ")}

IMPORTANT:
- Generate fresh recipes yourself using Gemini.
- DO NOT use a fixed recipe database.
- DO NOT use predefined recipes.
- Avoid repeating recipes across the plan.
- Respect all user preferences.
- Make recipes realistic and practical.
- Return exactly ${duration} days.
- Each day must contain exactly these meal types: ${selectedMeals.join(", ")}.
- Every meal must contain a complete recipe.
- similar must be an array.
- For every recipe, generate exactly 2 genuinely similar recipe suggestions.
- Similar recipes must be different from the main recipe.
- Similar recipe names should be relevant to the main recipe's ingredients, cuisine, meal type, or cooking style.
- Do not use fixed recipe names.
- Generate the similar recipe suggestions yourself.

Return ONLY valid JSON.

Use this exact structure:

{
  "duration": ${duration},
  "mealsPerDay": ${JSON.stringify(selectedMeals)},
  "preferencesSummary": "${duration} Days • ${selectedMeals.length} Meals/Day",
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Day 1",
      "meals": [
        {
          "type": "Breakfast",
          "recipe": {
            "name": "Recipe Name",
            "img": "🍳",
            "desc": "Short description",
            "time": "20 min",
            "servings": "2 Servings",
            "difficulty": "Easy",
            "calories": "350 cal",
            "protein": "20g",
            "carbs": "30g",
            "fat": "15g",
            "ingredients": [
              "ingredient 1",
              "ingredient 2"
            ],
            "steps": [
              "Step 1",
              "Step 2"
            ],
            "tip": "Helpful chef tip",
            "tags": [
              "#Quick&Easy"
            ],
            "dietary": [
              "🥜 Nut-Free"
            ],
            "similar": [
  {
    "name": "Similar Recipe Name",
    "time": "25 min",
    "calories": "350 cal",
    "img": "🍲"
  },
  {
    "name": "Another Similar Recipe",
    "time": "30 min",
    "calories": "400 cal",
    "img": "🥗"
  }
]
          }
        }
      ]
    }
  ]
}

RULES:
- ONLY JSON.
- No Markdown.
- No triple backticks.
- ingredients = array.
- steps = array.
- tags = array.
- dietary = array.
- similar = array.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let mealPlan;

    try {
      mealPlan = JSON.parse(text);
    } catch (error) {
      console.error("Meal plan JSON parse error:", error);
      console.error("Gemini returned:", text);

      return res.status(500).json({
        error: "Gemini returned invalid meal plan JSON.",
      });
    }

    res.json(mealPlan);

  } catch (error) {
    console.error("Gemini meal plan error:", error);

    res.status(500).json({
      error: "Failed to generate meal plan.",
    });
  }
});


// ==================== GEMINI MEAL SWAP ====================

app.post("/api/swap-meal", async (req, res) => {
  try {
    const {
      mealType,
      currentRecipeName,
      preferences
    } = req.body;

    const prompt = `
You are ChefAI, an expert cooking assistant.

Generate ONE completely new recipe.

Meal type:
${mealType}

Current recipe:
${currentRecipeName}

USER PREFERENCES:
- Dietary: ${preferences?.dietary || "No Preference"}
- Cuisine: ${preferences?.cuisine || "Any Cuisine"}
- Spice: ${preferences?.spice || "No Preference"}
- Budget: ${preferences?.budget || "No Preference"}
- Skill: ${preferences?.skill || "Any Level"}

IMPORTANT:
- Generate a completely NEW recipe.
- The new recipe MUST be different from "${currentRecipeName}".
- Do not use a fixed recipe database.
- Respect the user's preferences.
- Generate exactly 2 genuinely similar recipe suggestions.
- Similar recipes must be different from the main recipe.
- Do not use fixed recipe names.
- Similar recipe names should be relevant to the main recipe's ingredients, cuisines,meal type,or cooking style.
- Return ONLY valid JSON.

Use exactly this structure:

{
  "recipe": {
    "name": "New Recipe Name",
    "img": "🍲",
    "desc": "Short description",
    "time": "30 min",
    "servings": "2 Servings",
    "difficulty": "Easy",
    "calories": "400 cal",
    "protein": "25g",
    "carbs": "35g",
    "fat": "15g",
    "ingredients": [
      "ingredient 1",
      "ingredient 2"
    ],
    "steps": [
      "Step 1",
      "Step 2"
    ],
    "tip": "Helpful chef tip",
    "tags": [
      "#Quick&Easy"
    ],
    "dietary": [
      "🥜 Nut-Free"
    ],
    "similar": [
  {
    "name": "Similar Recipe Name",
    "time": "25 min",
    "calories": "350 cal",
    "img": "🍲"
  },
  {
    "name": "Another Similar Recipe",
    "time": "30 min",
    "calories": "400 cal",
    "img": "🥗"
  }
]
  }
}

Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    let text = response.text.trim();

    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      console.error("Swap meal JSON parse error:", error);
      console.error("Gemini returned:", text);

      return res.status(500).json({
        error: "Gemini returned invalid recipe JSON.",
      });
    }

    res.json(result);

  } catch (error) {
    console.error("Gemini swap meal error:", error);

    res.status(500).json({
      error: "Failed to generate replacement meal.",
    });
  }
});
// ==================== GEMINI INGREDIENT IMAGE DETECTION ====================

app.post("/api/detect-ingredients", async (req, res) => {
  try {
    const { image, mimeType } = req.body;

    if (!image || !mimeType) {
      return res.status(400).json({
        error: "Ingredient image is required.",
      });
    }

    const prompt = `
You are ChefAI's ingredient detection system.

Analyze the provided food image carefully.

Identify ONLY the actual food ingredients that are visibly present in the image.

IMPORTANT RULES:
- Do NOT use a fixed/default ingredient list.
- Do NOT guess ingredients that are not visible.
- Do NOT infer a recipe.
- Identify individual visible ingredients.
- Ignore plates, bowls, tables, packaging, utensils and other non-food objects.
- If an ingredient is uncertain, do not include it.
- Return common, simple ingredient names.
- Avoid duplicate ingredients.
- Return ONLY valid JSON.

Use exactly this structure:

{
  "ingredients": [
    "Tomatoes",
    "Chicken",
    "Onion"
  ]
}

If no recognizable ingredients are visible, return:

{
  "ingredients": []
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: image,
              },
            },
          ],
        },
      ],
    });

    let text = response.text.trim();

    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      console.error("Ingredient detection JSON parse error:", error);
      console.error("Gemini returned:", text);

      return res.status(500).json({
        error: "Gemini returned invalid ingredient detection JSON.",
      });
    }

    if (!result || !Array.isArray(result.ingredients)) {
      return res.status(500).json({
        error: "Invalid ingredient detection response.",
      });
    }

    res.json({
      ingredients: result.ingredients,
    });

  } catch (error) {
    console.error("Gemini ingredient detection error:", error);

    res.status(500).json({
      error: "Failed to detect ingredients from image.",
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ChefAI server running on http://localhost:${PORT}`);
  });
}

module.exports = app;