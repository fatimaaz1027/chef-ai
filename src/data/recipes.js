export const recipesDatabase = {
  "eggs and tomatoes": {
    name: "Shakshuka (Poached Eggs in Tomato Sauce)",
    img: "🍳",
    difficulty: "Beginner",
    servings: "2 Servings",
    time: "25 min",
    calories: "320 cal",
    protein: "18g",
    carbs: "12g",
    fat: "22g",
    ingredients: [
      "4 large organic eggs",
      "3 ripe tomatoes, diced",
      "1 medium yellow onion, chopped",
      "2 cloves garlic, minced",
      "1 tsp ground cumin & 1 tsp paprika",
      "2 tbsp extra virgin olive oil",
      "Fresh cilantro for garnish"
    ],
    steps: [
      "Sauté diced onion and minced garlic in olive oil over medium heat until translucent (5 mins).",
      "Add chopped tomatoes, cumin, paprika, salt, and pepper. Simmer for 10 minutes until thickened.",
      "Use a spoon to make 4 small wells in the tomato sauce and crack an egg into each well.",
      "Cover the pan with a lid and cook on low heat for 5-8 minutes until egg whites are set.",
      "Garnish with chopped fresh cilantro and serve hot with crusty sourdough bread."
    ],
    tip: "Sprinkle crumbled feta cheese on top right after turning off the heat for extra rich flavor!"
  },
  "chicken and rice": {
    name: "Lemon Herb Chicken & Quinoa Rice Bowl",
    img: "🍗",
    difficulty: "Intermediate",
    servings: "3 Servings",
    time: "35 min",
    calories: "550 cal",
    protein: "42g",
    carbs: "48g",
    fat: "16g",
    ingredients: [
      "2 skinless chicken breasts",
      "1.5 cups jasmine rice or quinoa",
      "2 tbsp fresh lemon juice & zest",
      "3 cloves garlic, crushed",
      "1 tbsp chopped fresh rosemary and oregano",
      "2 tbsp olive oil",
      "Steamed broccoli & sliced carrots for side"
    ],
    steps: [
      "Marinate chicken breasts with lemon juice, zest, garlic, herbs, olive oil, salt, and pepper for 15 mins.",
      "Pan-sear chicken in a hot skillet for 6-7 minutes per side until golden brown and cooked through (165°F).",
      "Rinse rice and cook in chicken broth with a bay leaf for extra aromatic flavor.",
      "Rest chicken for 5 minutes before slicing diagonally into clean strips.",
      "Assemble bowl: bed of fluffy rice, sliced lemon chicken, steamed vegetables, and lemon juice drizzle."
    ],
    tip: "Letting the chicken rest for 5 minutes seals in the juices so it stays ultra tender!"
  },
  "potato snacks": {
    name: "Crispy Garlic Rosemary Spiced Potato Bites",
    img: "🥔",
    difficulty: "Beginner",
    servings: "4 Servings",
    time: "40 min",
    calories: "280 cal",
    protein: "4g",
    carbs: "38g",
    fat: "12g",
    ingredients: [
      "4 medium russet or Yukon gold potatoes",
      "2.5 tbsp extra virgin olive oil",
      "1 tsp smoked paprika & garlic powder",
      "1 tbsp fresh rosemary, finely chopped",
      "Sea salt & cracked black pepper"
    ],
    steps: [
      "Preheat oven to 220°C (425°F) and line a baking sheet with parchment paper.",
      "Cut potatoes into uniform 1-inch cubes and soak in cold water for 10 minutes to remove excess starch.",
      "Drain and pat potatoes thoroughly dry with a clean kitchen towel.",
      "Toss potato cubes with olive oil, paprika, garlic powder, salt, and pepper until well coated.",
      "Spread single-layer on baking sheet and roast for 30 minutes, flipping halfway, until golden and crispy."
    ],
    tip: "Soaking potatoes in cold water and drying completely guarantees an extra crispy outer skin!"
  },
  "healthy salad": {
    name: "Mediterranean Avocado & Quinoa Power Salad",
    img: "🥗",
    difficulty: "Easy",
    servings: "2 Servings",
    time: "10 min",
    calories: "180 cal",
    protein: "8g",
    carbs: "14g",
    fat: "11g",
    ingredients: [
      "3 cups mixed garden greens (spinach, arugula)",
      "1 ripe avocado, diced",
      "1/2 cucumber & 1 cup cherry tomatoes",
      "1/4 cup crumbled feta cheese",
      "2 tbsp Kalamata olives, pitted",
      "Lemon-herb vinaigrette dressing"
    ],
    steps: [
      "Wash and dry garden greens; place in a large salad bowl.",
      "Slice cucumber, halve cherry tomatoes, and chop avocado into bite-sized cubes.",
      "Combine greens, cucumber, tomatoes, avocado, and Kalamata olives.",
      "Whisk extra virgin olive oil, fresh lemon juice, dried oregano, salt, and pepper for dressing.",
      "Drizzle vinaigrette over salad, toss gently, and finish with crumbled feta cheese."
    ],
    tip: "Add a pinch of toasted pine nuts or chickpeas for an extra plant-based protein boost!"
  },
  "creamy pasta": {
    name: "Creamy Garlic Parmesan & Basil Pasta",
    img: "🍝",
    difficulty: "Beginner",
    servings: "3 Servings",
    time: "25 min",
    calories: "420 cal",
    protein: "14g",
    carbs: "52g",
    fat: "18g",
    ingredients: [
      "300g fettuccine or penne pasta",
      "3/4 cup heavy cream or whole milk",
      "4 cloves garlic, minced",
      "1/2 cup freshly grated Parmesan cheese",
      "2 tbsp unsalted butter",
      "Fresh basil leaves for garnish"
    ],
    steps: [
      "Bring a large pot of salted water to boil. Cook pasta al dente according to package instructions.",
      "Melt butter in a skillet over medium heat and sauté minced garlic for 1 minute until fragrant.",
      "Pour in heavy cream and bring to a gentle simmer for 3 minutes until slightly thickened.",
      "Stir in freshly grated Parmesan until smooth and melted.",
      "Toss pasta into cream sauce, adding 2 tbsp reserved pasta water to coat smoothly. Garnish with fresh basil."
    ],
    tip: "Always save 1/2 cup of starchy pasta cooking water to achieve a restaurant-quality glossy sauce!"
  }
};

export function findOrGenerateRecipe(query) {
  const lower = query.toLowerCase();

  // 0. Personalized Recommendations Handler
  if (lower.includes('personalized') || lower.includes('recommendations')) {
    const isVeg = lower.includes('vegetarian') || lower.includes('vegan');
    const isItalian = lower.includes('italian');
    const isAsian = lower.includes('asian');
    const isMexican = lower.includes('mexican');
    const isIndian = lower.includes('indian');
    const isSpicy = lower.includes('spicy');
    const isHighProtein = lower.includes('high protein');

    if (isVeg && isHighProtein) {
      return {
        name: "High-Protein Chickpea & Avocado Power Bowl",
        img: "🥗",
        difficulty: "Easy",
        servings: "2 Servings",
        time: "15 min",
        calories: "440 cal",
        protein: "26g",
        carbs: "38g",
        fat: "18g",
        ingredients: [
          "1.5 cups organic chickpeas (rinsed & drained)",
          "1 ripe avocado, diced",
          "1.5 cups cooked quinoa",
          "1 cup cherry tomatoes, halved",
          "1/4 cup crumbled feta cheese or hemp seeds",
          "2 tbsp extra virgin olive oil & 1 tbsp lemon juice",
          "Sea salt, garlic powder & black pepper"
        ],
        steps: [
          "In a large bowl, combine rinsed chickpeas, cooked quinoa, and halved cherry tomatoes.",
          "Drizzle with extra virgin olive oil, fresh lemon juice, garlic powder, salt, and pepper.",
          "Toss gently until ingredients are evenly coated.",
          "Top with diced ripe avocado and crumbled feta cheese or hemp seeds.",
          "Serve immediately or chill for a refreshing high-protein lunch!"
        ],
        tip: "Chickpeas paired with quinoa form a complete plant-based protein profile!",
        tags: ['#Vegetarian', '#HighProtein', '#Healthy', '#Quick&Easy']
      };
    }

    if (isVeg && isItalian) {
      return {
        name: "Tuscan Garlic Spinach & Sundried Tomato Pasta",
        img: "🍝",
        difficulty: "Easy",
        servings: "3 Servings",
        time: "20 min",
        calories: "390 cal",
        protein: "14g",
        carbs: "54g",
        fat: "14g",
        ingredients: [
          "250g penne or fettuccine pasta",
          "2 cups fresh baby spinach leaves",
          "1/3 cup sundried tomatoes, sliced",
          "3 cloves garlic, finely minced",
          "1/2 cup heavy cream or coconut cream",
          "1/4 cup grated Parmesan cheese",
          "2 tbsp olive oil & fresh basil"
        ],
        steps: [
          "Boil pasta in salted water until al dente; reserve 1/4 cup pasta cooking water.",
          "Heat olive oil in a skillet and sauté minced garlic for 1 minute until fragrant.",
          "Add sundried tomatoes and baby spinach, cooking until spinach wilts (2 mins).",
          "Stir in heavy cream and Parmesan, bringing to a simmer.",
          "Toss cooked pasta into sauce with reserved pasta water and garnish with basil."
        ],
        tip: "Sundried tomato oil adds intense savory depth to the sauce!",
        tags: ['#Vegetarian', '#Quick&Easy', '#Dinner']
      };
    }

    if (isVeg && isSpicy) {
      return {
        name: "Spicy Chickpea & Cauliflower Tikka Bowl",
        img: "🌶️",
        difficulty: "Intermediate",
        servings: "2 Servings",
        time: "25 min",
        calories: "380 cal",
        protein: "16g",
        carbs: "46g",
        fat: "14g",
        ingredients: [
          "1.5 cups cooked chickpeas",
          "2 cups cauliflower florets, chopped",
          "1/2 cup tomato purée & 1/3 cup coconut milk",
          "1 tsp red chili powder & 1/2 tsp cayenne",
          "1 tsp cumin, garam masala & turmeric",
          "2 cloves garlic & 1 tsp ginger, minced",
          "1.5 cups cooked basmati rice"
        ],
        steps: [
          "Sauté garlic and ginger in olive oil for 1 minute until fragrant.",
          "Add chili powder, cumin, garam masala, and turmeric, stirring for 30 seconds.",
          "Pour in tomato purée and coconut milk, simmer for 5 minutes.",
          "Stir in chickpeas and cauliflower florets; cover and simmer for 12 minutes until tender.",
          "Serve spicy tikka over warm basmati rice with fresh cilantro."
        ],
        tip: "Coconut milk cools down the spice while creating a velvety cream texture!",
        tags: ['#Vegetarian', '#Spicy', '#Healthy', '#Dinner']
      };
    }

    if (isVeg) {
      return {
        name: "Mediterranean Avocado & Quinoa Power Salad",
        img: "🥗",
        difficulty: "Easy",
        servings: "2 Servings",
        time: "10 min",
        calories: "320 cal",
        protein: "12g",
        carbs: "28g",
        fat: "18g",
        ingredients: [
          "3 cups mixed garden greens (spinach, arugula)",
          "1 ripe avocado, diced",
          "1/2 cucumber & 1 cup cherry tomatoes",
          "1/4 cup crumbled feta cheese",
          "2 tbsp Kalamata olives, pitted",
          "Lemon-herb vinaigrette dressing"
        ],
        steps: [
          "Wash and dry garden greens; place in a large salad bowl.",
          "Slice cucumber, halve cherry tomatoes, and chop avocado into bite-sized cubes.",
          "Combine greens, cucumber, tomatoes, avocado, and Kalamata olives.",
          "Drizzle vinaigrette over salad, toss gently, and finish with crumbled feta cheese."
        ],
        tip: "Add toasted pine nuts or pumpkin seeds for extra crunch!",
        tags: ['#Vegetarian', '#Healthy', '#Quick&Easy']
      };
    }

    if (isItalian) {
      return {
        name: "Creamy Garlic Parmesan & Basil Pasta",
        img: "🍝",
        difficulty: "Beginner",
        servings: "3 Servings",
        time: "25 min",
        calories: "420 cal",
        protein: "14g",
        carbs: "52g",
        fat: "18g",
        ingredients: [
          "300g fettuccine or penne pasta",
          "3/4 cup heavy cream or whole milk",
          "4 cloves garlic, minced",
          "1/2 cup freshly grated Parmesan cheese",
          "2 tbsp unsalted butter",
          "Fresh basil leaves for garnish"
        ],
        steps: [
          "Cook pasta al dente according to package instructions.",
          "Melt butter in a skillet over medium heat and sauté minced garlic for 1 minute.",
          "Pour in heavy cream and simmer for 3 minutes until slightly thickened.",
          "Stir in freshly grated Parmesan until smooth and melted.",
          "Toss pasta into cream sauce and garnish with fresh basil."
        ],
        tip: "Always save 1/2 cup starchy pasta cooking water for glossy cream sauce!",
        tags: ['#Quick&Easy', '#Dinner']
      };
    }

    if (isAsian) {
      return {
        name: "Teriyaki Chicken & Veggie Stir-Fry Bowl",
        img: "🍱",
        difficulty: "Intermediate",
        servings: "2 Servings",
        time: "20 min",
        calories: "480 cal",
        protein: "38g",
        carbs: "46g",
        fat: "14g",
        ingredients: [
          "2 chicken breasts, diced",
          "2 cups broccoli florets & sliced bell peppers",
          "3 tbsp low-sodium teriyaki sauce",
          "1 tbsp sesame oil & 1 tsp sesame seeds",
          "2 cloves garlic & 1 tsp ginger, minced",
          "1.5 cups cooked jasmine rice"
        ],
        steps: [
          "Heat sesame oil in a wok or skillet over high heat.",
          "Add diced chicken, garlic, and ginger; stir-fry for 5 minutes until browned.",
          "Add broccoli and bell peppers, tossing for 3 minutes until crisp-tender.",
          "Pour in teriyaki sauce, stirring for 2 minutes until glossy and hot.",
          "Serve stir-fry over jasmine rice and sprinkle with sesame seeds."
        ],
        tip: "High heat in a heavy wok gives veggies a authentic smoky crunch!",
        tags: ['#HighProtein', '#Quick&Easy', '#Dinner']
      };
    }

    if (isMexican) {
      return {
        name: "Spicy Mexican Chicken Burrito Bowl",
        img: "🌮",
        difficulty: "Easy",
        servings: "2 Servings",
        time: "20 min",
        calories: "520 cal",
        protein: "42g",
        carbs: "48g",
        fat: "16g",
        ingredients: [
          "2 chicken breasts, seasoned & grilled",
          "1.5 cups cooked brown rice or quinoa",
          "1/2 cup black beans & 1/2 cup corn kernels",
          "1 ripe avocado, sliced",
          "1/4 cup salsa & 2 tbsp sour cream",
          "Fresh cilantro & lime wedges"
        ],
        steps: [
          "Season chicken with taco seasoning, cumin, salt, and pepper; grill for 6 minutes per side.",
          "Slice chicken breasts into strips.",
          "Assemble bowl: bed of brown rice, black beans, corn, and sliced avocado.",
          "Top with grilled chicken strips, spoon salsa, add sour cream, and squeeze fresh lime."
        ],
        tip: "Add pickled jalapeños for an extra spicy kick!",
        tags: ['#HighProtein', '#Spicy', '#Healthy', '#Dinner']
      };
    }

    return {
      name: "Chef AI Personalized Gourmet Bowl",
      img: "✨",
      difficulty: "Easy",
      servings: "2 Servings",
      time: "20 min",
      calories: "450 cal",
      protein: "34g",
      carbs: "38g",
      fat: "15g",
      ingredients: [
        "2 cups selected fresh produce & protein",
        "1.5 cups cooked quinoa or whole grain rice",
        "2 tbsp extra virgin olive oil",
        "2 cloves fresh garlic, minced",
        "Herbal seasoning & fresh lemon juice"
      ],
      steps: [
        "Sauté garlic and aromatics in olive oil over medium heat.",
        "Add main ingredients, season thoughtfully, and cook until golden.",
        "Serve warm over grain bowl base with lemon juice finish."
      ],
      tip: "Customized to your exact dietary goals and taste preferences!",
      tags: ['#Healthy', '#Quick&Easy']
    };
  }

  // 1. Recipe Ideas Predefined Category Interceptors
  if (lower.includes('high protein') || lower.includes('high-protein')) {
    return {
      name: "High-Protein Chicken & Quinoa Power Bowl",
      img: "💪",
      difficulty: "Intermediate",
      servings: "2 Servings",
      time: "25 min",
      calories: "520 cal",
      protein: "48g",
      carbs: "42g",
      fat: "14g",
      ingredients: [
        "2 boneless skinless chicken breasts (cooked & shredded)",
        "1.5 cups cooked organic quinoa",
        "1/2 cup black beans, rinsed & drained",
        "1/4 cup plain Greek yogurt",
        "1 tbsp extra virgin olive oil",
        "1 tsp ground cumin, paprika & lime juice",
        "Fresh cilantro for garnish"
      ],
      steps: [
        "Heat olive oil in a skillet and toss shredded chicken with cumin, paprika, salt, and pepper.",
        "Warm black beans and cooked quinoa together in a pan for 3 minutes.",
        "Divide warm quinoa and black bean mixture evenly into serving bowls.",
        "Top generously with seasoned chicken breast.",
        "Add a dollop of Greek yogurt, squeeze fresh lime juice, garnish with cilantro, and enjoy!"
      ],
      tip: "Greek yogurt provides a creamy, high-protein alternative to sour cream!"
    };
  }

  if (lower.includes('quick') || lower.includes('easy')) {
    return {
      name: "Garlic Butter Chicken & Veggie Wrap",
      img: "🍝",
      difficulty: "Beginner",
      servings: "2 Servings",
      time: "12 min",
      calories: "390 cal",
      protein: "32g",
      carbs: "36g",
      fat: "15g",
      ingredients: [
        "2 whole wheat tortilla wraps",
        "200g cooked chicken breast, sliced",
        "1 tbsp garlic butter",
        "1 cup fresh baby spinach",
        "1/2 bell pepper, thinly sliced",
        "2 tbsp Greek yogurt or mayonnaise",
        "Pinch of sea salt & black pepper"
      ],
      steps: [
        "Melt garlic butter in a skillet over medium heat.",
        "Add sliced cooked chicken and bell peppers, tossing for 3 minutes until hot and coated.",
        "Lay tortilla wraps flat and spread a layer of Greek yogurt or mayo.",
        "Layer fresh spinach, warm garlic chicken, and bell peppers in the center.",
        "Fold sides tightly, roll into a wrap, slice diagonally, and serve!"
      ],
      tip: "Toast the wrapped tortilla in a hot skillet for 1 minute per side for a crisp outer crunch!"
    };
  }

  if (lower.includes('spicy')) {
    return {
      name: "Spicy Chicken Tikka & Rice Bowl",
      img: "🌶️",
      difficulty: "Intermediate",
      servings: "2 Servings",
      time: "25 min",
      calories: "480 cal",
      protein: "40g",
      carbs: "45g",
      fat: "16g",
      ingredients: [
        "2 chicken breasts, cut into bite-sized cubes",
        "1/2 cup plain Greek yogurt",
        "1 tsp red chili powder & 1/2 tsp cayenne pepper",
        "1 tsp ground cumin, garam masala & turmeric",
        "2 cloves garlic & 1 tsp ginger, finely minced",
        "1.5 cups cooked basmati rice",
        "1 tbsp olive oil & fresh cilantro"
      ],
      steps: [
        "In a bowl, mix Greek yogurt, minced garlic, ginger, chili powder, cumin, garam masala, turmeric, and salt.",
        "Add diced chicken cubes to marinade and let sit for 10 minutes.",
        "Heat olive oil in a skillet over medium-high heat. Sauté marinated chicken for 8-10 minutes until deeply browned.",
        "Serve hot spicy chicken over fluffy basmati rice.",
        "Garnish with chopped fresh cilantro and optional fresh chili slices!"
      ],
      tip: "Adjust cayenne pepper to your heat tolerance, or add cucumber raita on the side to cool it down!"
    };
  }

  if (lower.includes('sweet')) {
    return {
      name: "Greek Yogurt & Berry Honey Parfait",
      img: "🍰",
      difficulty: "Easy",
      servings: "2 Servings",
      time: "8 min",
      calories: "290 cal",
      protein: "18g",
      carbs: "40g",
      fat: "6g",
      ingredients: [
        "1.5 cups plain Greek yogurt",
        "1/2 cup fresh strawberries, sliced",
        "1/2 cup fresh blueberries or raspberries",
        "1/2 cup crunchy oat granola",
        "2 tbsp raw organic honey or maple syrup",
        "1 tbsp sliced almonds or chia seeds"
      ],
      steps: [
        "Spoon 2 tablespoons of Greek yogurt into the bottom of two glass parfait cups.",
        "Add a layer of mixed fresh berries and a sprinkle of crunchy granola.",
        "Repeat layers with remaining Greek yogurt, berries, and granola.",
        "Drizzle generously with raw honey or maple syrup on top.",
        "Garnish with sliced almonds or chia seeds and serve immediately!"
      ],
      tip: "Layer right before serving to keep the granola extra crunchy!"
    };
  }

  if (lower.includes('breakfast')) {
    return {
      name: "Fluffy Veggie & Cheese Omelette",
      img: "🍳",
      difficulty: "Easy",
      servings: "2 Servings",
      time: "15 min",
      calories: "310 cal",
      protein: "22g",
      carbs: "8g",
      fat: "20g",
      ingredients: [
        "3 large organic eggs",
        "1/2 bell pepper, finely diced",
        "1 small tomato, chopped",
        "2 tbsp red onion, chopped",
        "1/4 cup shredded cheddar or feta cheese",
        "1 tbsp butter or olive oil",
        "Salt & cracked black pepper to taste"
      ],
      steps: [
        "Whisk eggs in a bowl with a pinch of salt and pepper until smooth.",
        "Melt butter in a non-stick skillet over medium heat.",
        "Sauté diced bell peppers, tomatoes, and onions for 2-3 minutes until soft.",
        "Pour whisked eggs into the skillet, tilt pan to spread evenly, and cook for 3-4 minutes until eggs begin to set.",
        "Sprinkle cheese on one half, fold omelette over, and cook for 1 more minute until cheese melts. Serve hot!"
      ],
      tip: "Whisking a splash of milk into the eggs makes the omelette extra fluffy and light!"
    };
  }

  if (lower.includes('healthy')) {
    return {
      name: "Grilled Chicken & Avocado Power Bowl",
      img: "🥗",
      difficulty: "Easy",
      servings: "2 Servings",
      time: "20 min",
      calories: "420 cal",
      protein: "38g",
      carbs: "32g",
      fat: "16g",
      ingredients: [
        "2 skinless chicken breasts",
        "1 ripe avocado, sliced",
        "1.5 cups cooked quinoa or brown rice",
        "1 cup cherry tomatoes, halved",
        "1 cup mixed baby spinach",
        "2 tbsp extra virgin olive oil & 1 tbsp lemon juice",
        "Sea salt, garlic powder & black pepper"
      ],
      steps: [
        "Season chicken breasts with olive oil, garlic powder, salt, and pepper.",
        "Grill or pan-sear chicken over medium-high heat for 6-7 minutes per side until fully cooked.",
        "Rest chicken for 5 minutes, then slice into thin strips.",
        "Arrange cooked quinoa, spinach, halved cherry tomatoes, and sliced avocado in a serving bowl.",
        "Top with sliced grilled chicken, drizzle with olive oil and fresh lemon juice, and serve!"
      ],
      tip: "Prepare quinoa in chicken broth beforehand for rich nutrient flavor!"
    };
  }

  if (lower.includes('dinner')) {
    return {
      name: "Lemon Herb Garlic Chicken & Roasted Rice",
      img: "🥘",
      difficulty: "Intermediate",
      servings: "3 Servings",
      time: "30 min",
      calories: "510 cal",
      protein: "44g",
      carbs: "46g",
      fat: "15g",
      ingredients: [
        "2 skinless chicken breasts or thighs",
        "1.5 cups jasmine rice",
        "2 tbsp fresh lemon juice & zest",
        "3 cloves garlic, minced",
        "1 tbsp fresh rosemary & oregano",
        "2 tbsp extra virgin olive oil",
        "Steamed green beans or broccoli"
      ],
      steps: [
        "Marinate chicken with lemon juice, zest, garlic, herbs, olive oil, salt, and pepper for 10 minutes.",
        "Sear chicken in a skillet over medium heat for 6-7 minutes per side until golden brown (165°F).",
        "Cook jasmine rice in chicken broth with a pinch of salt until fluffy.",
        "Slice roasted chicken breasts into strips.",
        "Plate fluffy rice, arrange sliced lemon chicken on top, add steamed green beans, and drizzle pan juices!"
      ],
      tip: "Cooking rice in broth instead of plain water adds deep savory richness to the dinner!"
    };
  }

  // 2. Match existing recipes database by key or ingredient
  const keys = Object.keys(recipesDatabase);
  for (const k of keys) {
    const parts = k.split(' ');
    if (parts.some(p => p.length > 2 && lower.includes(p))) {
      return recipesDatabase[k];
    }
  }

  // 3. Verify Food / Recipe / Ingredient Intent before dynamic generation
  const foodKeywords = [
    'recipe', 'recipes', 'cook', 'cooking', 'make', 'dish', 'dishes', 'meal', 'meals',
    'food', 'eat', 'eating', 'ingredient', 'ingredients', 'breakfast', 'lunch', 'dinner',
    'snack', 'dessert', 'spicy', 'healthy', 'protein', 'carb', 'low carb', 'vegetarian',
    'vegan', 'soup', 'salad', 'pasta', 'pizza', 'curry', 'sauce', 'bake', 'roast', 'fry',
    'grill', 'ideas', 'suggest', 'recommend', 'i have', 'what can i make', 'what should i cook'
  ];

  const commonIngredients = [
    'tomato', 'tomatoes', 'chicken', 'egg', 'eggs', 'cheese', 'rice', 'garlic', 'onion',
    'onions', 'beef', 'fish', 'salmon', 'potato', 'potatoes', 'pasta', 'spinach', 'milk',
    'butter', 'bread', 'mushroom', 'mushrooms', 'avocado', 'zucchini', 'bell pepper',
    'lemon', 'cucumber', 'tofu', 'beans', 'carrot', 'carrots', 'shrimp', 'broccoli',
    'coconut', 'paneer', 'meat', 'pork', 'turkey', 'lamb', 'mutton', 'sauce', 'noodle'
  ];

  const nonFoodExclusions = new Set([
    'hi', 'hello', 'hey', 'heyy', 'greetings', 'thanks', 'thank', 'thx', 'ty',
    'ok', 'okay', 'sure', 'cool', 'got it', 'alright', 'bye', 'goodbye',
    'what is protein', 'what is carbs', 'tell me something', 'how are you', 'how are you?',
    'what', 'why', 'how', 'who', 'where', 'when', 'is', 'are', 'am', 'was', 'were',
    'anything', 'something', 'nothing', 'someone', 'anyone', 'test', 'foo', 'bar'
  ]);

  const cleanedLower = lower.replace(/[^\w\s]/g, '').trim();
  const words = cleanedLower.split(/\s+/).filter(Boolean);

  const hasFoodKeyword = foodKeywords.some((k) => lower.includes(k));
  const hasIngredient = words.some((w) => commonIngredients.includes(w));
  const hasMultiFood = lower.includes(' and ') || lower.includes(',');
  const isSingleNounIngredient = words.length === 1 && !nonFoodExclusions.has(words[0]);

  const isRecipeQuery = hasFoodKeyword || hasIngredient || hasMultiFood || isSingleNounIngredient;

  // IF NOT A VALID RECIPE/FOOD QUERY, RETURN NULL!
  if (!isRecipeQuery) {
    return null;
  }

  // 4. Clean Fallback AI Generator for custom ingredient prompts
  const cleanedTitle = query
    .replace(/^\[.*?\]\s*/, '')
    .replace(/give me (recipe ideas (with|for)?|something)?/i, '')
    .replace(/show (recipe for|me)/i, '')
    .replace(/what can i (make|cook) with/i, '')
    .replace(/i have/i, '')
    .trim();

  const titleWords = (cleanedTitle || 'Pantry Special').split(' ')
    .filter(w => w.length > 0)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const formattedName = titleWords ? `${titleWords} Gourmet Delight` : 'Chef AI Gourmet Special';

  const isSoup = lower.includes('soup');
  const isBreakfast = lower.includes('egg') || lower.includes('pancake');

  return {
    name: formattedName,
    img: isSoup ? '🥣' : isBreakfast ? '🥞' : '🍲',
    difficulty: lower.includes('easy') ? 'Easy' : lower.includes('pro') ? 'Advanced' : 'Beginner',
    servings: '2 - 3 Servings',
    time: '20 min',
    calories: '360 cal',
    protein: '24g',
    carbs: '38g',
    fat: '14g',
    ingredients: [
      `2 cups fresh ${cleanedTitle || 'pantry ingredients'}, prepared`,
      '2 tbsp extra virgin olive oil or avocado oil',
      '2 cloves fresh garlic, finely minced',
      '1/2 tsp sea salt & freshly cracked pepper',
      '1 tsp dried herbs (thyme, oregano, or rosemary)',
      'Fresh lemon wedges & parsley for finishing'
    ],
    steps: [
      `Prepare your ingredients by washing, trimming, and chopping ${cleanedTitle || 'all fresh produce'}.`,
      'Heat oil in a heavy-bottomed skillet over medium heat and sauté minced garlic until golden and fragrant (1-2 mins).',
      `Add ${cleanedTitle || 'prepared ingredients'} into the pan and season evenly with herbs, salt, and pepper.`,
      'Sauté or simmer gently for 10-12 minutes over medium-low heat until completely tender and deeply flavorful.',
      'Remove from heat, rest for 2 minutes, squeeze fresh lemon juice on top, and serve warm!'
    ],
    tip: 'Pair with a side of steamed greens or toasted garlic bread for a balanced gourmet experience!'
  };
}
