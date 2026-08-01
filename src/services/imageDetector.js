/**
 * Gemini-powered ingredient image detection
 */

const API_URL = '/api';

export async function detectIngredientsFromImage(imageFile) {
  if (!imageFile) return [];

  // Convert image file to Base64
  const base64 = await fileToBase64(imageFile);

  const response = await fetch(`${API_URL}/detect-ingredients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image: base64,
      mimeType: imageFile.type || 'image/jpeg',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Ingredient detection API error:', errorText);
    throw new Error('Ingredient detection failed.');
  }

  const data = await response.json();

  if (!data || !Array.isArray(data.ingredients)) {
    throw new Error('Invalid ingredient detection response.');
  }

  return data.ingredients;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      // Remove "data:image/...;base64," prefix
      const base64 = result.split(',')[1];

      resolve(base64);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}