/**
 * Gemini-powered Meal Planner
 *
 * This service sends the user's meal preferences to our backend.
 * Gemini generates fresh recipes instead of using the local recipe pool.
 */

const API_URL = '/api';

// Generate a completely fresh meal plan using Gemini
export async function generateMealPlan(preferences) {
  const response = await fetch(`${API_URL}/meal-plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      preferences,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Meal plan API error:', errorText);
    throw new Error(`Meal plan generation failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.days)) {
    console.error('Invalid meal plan response:', data);
    throw new Error('Invalid meal plan received from ChefAI.');
  }

  return data;
}


// Generate a fresh replacement meal using Gemini
export async function getSwapMealCandidate(
  mealType,
  currentRecipeName,
  preferences = {}
) {
  const response = await fetch(`${API_URL}/swap-meal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mealType,
      currentRecipeName,
      preferences,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Swap meal API error:', errorText);
    throw new Error(`Meal swap failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data || !data.recipe) {
    console.error('Invalid swap response:', data);
    throw new Error('Invalid replacement recipe received.');
  }

  return data.recipe;
}