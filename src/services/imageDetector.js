/**
 * API-Ready Image Ingredient Detection Service
 * Currently uses local mock detection logic.
 * Later, replace this function with an AI Vision API (e.g. Gemini Vision API).
 */
export async function detectIngredientsFromImage(imageFile) {
  // Simulate processing network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!imageFile) return [];

  const nameLower = (imageFile.name || '').toLowerCase();

  // Smart fallback mock detection based on file keywords
  if (nameLower.includes('chicken')) {
    return ['Chicken Breast', 'Garlic', 'Rosemary', 'Olive Oil', 'Lemon'];
  }
  if (nameLower.includes('tomato') || nameLower.includes('shakshuka')) {
    return ['Tomatoes', 'Eggs', 'Onion', 'Garlic', 'Olive Oil'];
  }
  if (nameLower.includes('potato')) {
    return ['Potatoes', 'Garlic', 'Rosemary', 'Olive Oil', 'Paprika'];
  }
  if (nameLower.includes('salad') || nameLower.includes('veg')) {
    return ['Spinach', 'Avocado', 'Cucumber', 'Cherry Tomatoes', 'Feta Cheese'];
  }
  if (nameLower.includes('pasta') || nameLower.includes('cheese')) {
    return ['Pasta', 'Heavy Cream', 'Garlic', 'Parmesan Cheese', 'Basil'];
  }

  // Standard pantry fallback demo set
  return ['Tomatoes', 'Eggs', 'Cheese', 'Bell Pepper', 'Garlic'];
}
