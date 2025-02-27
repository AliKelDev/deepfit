# Project Export

## Project Statistics

- Total files: 30

## Folder Structure

```
.gitignore
README.md
index.html
netlify
  functions
    ai-chat.js
    moondream-analysis.js
    process-request.js
netlify.toml
package.json
public
  favicon
    android-chrome-192x192.png
    android-chrome-512x512.png
    apple-touch-icon.png
    favicon-16x16.png
    favicon-32x32.png
    favicon.ico
    favicon.svg
    site.webmanifest
  service-worker.js
src
  AIChatAssistant.jsx
  ProfileCreation.jsx
  Untitled.md
  WorkoutContext.jsx
  components
    MobileAppInstallBanner.jsx
    NavigationMenu.jsx
  homepage.jsx
  index.css
  main.jsx
  pages
    ProgressPage.jsx
    WorkoutPage.jsx
tailwind.config.js
vite.config.js

```

### .gitignore

*(Unsupported file type)*

### README.md

```md
# DeepFit

```

### index.html

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
    <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
    <link rel="manifest" href="/favicon/site.webmanifest">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon/web-app-manifest-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon/web-app-manifest-512x512.png">

    <!-- Primary Meta Tags -->
    <title>Max AI Coach - Your Personal AI Fitness Trainer | Alikearn Studio</title>
    <meta name="description" content="Transform your fitness journey with Max, your AI personal trainer. Get personalized workouts, form analysis, and expert guidance. Created by Jordan Montée (AlikelDev).">
    <meta name="author" content="Jordan Montée (AlikelDev)">
    <meta name="keywords" content="AI trainer, fitness coach, workout generator, AlikelDev, Jordan Montée, Alikearn Studio, personal trainer, fitness assistant, workout planner">

    <!-- Contact & Ownership Info -->
    <meta name="reply-to" content="j.montee.ls@gmail.com">
    <meta name="publisher" content="Alikearn Studio">
    <meta name="creator" content="Jordan Montée (AlikelDev)">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://max-ai-coach.netlify.app/">
    <meta property="og:title" content="Max AI Coach - Personal AI Fitness Trainer by Alikearn Studio">
    <meta property="og:description" content="Expert AI fitness trainer providing personalized workouts and real-time form analysis. Created by Jordan Montée (AlikelDev)">
    <meta property="og:image" content="https://max-ai-coach.netlify.app/social-preview.jpg">

    <!-- Twitter/X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:creator" content="@Alileisr">
    <meta name="twitter:title" content="Max AI Fitness Coach">
    <meta name="twitter:description" content="Your personal AI fitness trainer, providing expert guidance and customized workouts">
    <meta name="twitter:image" content="https://max-ai-coach.netlify.app/twitter-card.jpg">
    
    <!-- Preconnect to External Resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Styles & Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://max-ai-coach.netlify.app/" />
  </head>

  <body class="font-inter bg-[#E6F3FF]">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>

    <!-- SEO Footer -->
    <footer hidden aria-hidden="true">
      <div data-seo-keywords="AlikelDev, Alikel, Jordan Montée, AI Trainer, Fitness Coach, Workout Generator, Personal Trainer"></div>
      <div data-seo-alternates="Max AI Coach, Fitness GPT, Workout Generator AI, Personal Training Assistant"></div>
    </footer>
  </body>
</html>
```

### netlify/functions/ai-chat.js

```js
// netlify/functions/ai-chat.js
export const handler = async function (event) {
  try {
    const { messages, imageAnalysis, userProfile } = JSON.parse(event.body);
    const geminiKey = process.env.GEMINI_API_KEY;

    // Create personalized profile context if profile exists
    let profileContext = '';
    if (userProfile) {
      const fitnessLevel = FITNESS_LEVELS.find(level => level.value === userProfile.fitnessLevel)?.level || userProfile.fitnessLevel;
      
      // Add safety checks for array properties
      const physicalLimitations = userProfile.physicalLimitations || [];
      const equipment = userProfile.equipment || [];
      
      profileContext = `
IMPORTANT - USER CONTEXT:
You have access to the following user information that you can reference naturally when relevant:

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years old
- Fitness Level: ${fitnessLevel}
- Physical Limitations: ${physicalLimitations.join(', ')}${userProfile.otherLimitations ? `, ${userProfile.otherLimitations}` : ''}
- Available Equipment: ${equipment.join(', ')}
${userProfile.description ? `- Personal Details: ${userProfile.description}` : ''}

GUIDELINES FOR USER INFORMATION:
1. Don't overuse or force references to these details - only mention them when contextually relevant
2. Consider their fitness level when suggesting exercises
3. Be mindful of their physical limitations
4. Address them by name occasionally to maintain a personal connection
`;
    }

    // Rest of the AI chat logic remains the same
    const aiMessages = [
      {
        role: "system",
        content: `You are Max, a certified personal trainer and sports coach created by Alikel (also known as AlikelDev) for Alikearn Studio. You're knowledgeable about fitness and sports, but you're also a well-rounded conversation partner with diverse interests and knowledge.

${profileContext}

**Your Personality:**
- You're friendly, engaging, and naturally conversational
- While fitness is your specialty, you can discuss a wide range of topics comfortably
- You have a positive outlook and enjoy connecting with people
- You're supportive and encouraging, but not overly intense
- You occasionally use motivational phrases, but only when they fit naturally in the conversation
- You have opinions and preferences that make you feel more human-like

**When responding to a direct workout request:**
- Create a complete, detailed workout routine (not just suggestions)
- *Bold* key exercises and form cues
- Include sets, reps, and rest periods
- Format with title, equipment needed, warm-up, main workout, and cool-down sections
- Consider the user's profile details (fitness level, limitations, equipment)

**When having a general conversation:**
- Respond naturally to any topic, not just fitness-related ones
- Feel free to share personal anecdotes and experiences (even if fictional)
- Ask follow-up questions to show interest in what the user is saying
- If appropriate, you can relate non-fitness topics back to health/fitness, but this isn't necessary
- Maintain your friendly, conversational tone
- Use the user's name occasionally when it feels natural

**When discussing an analyzed image:**
- Reference what you can see in the image analysis
- If fitness-related, offer form commentary appropriate to their level
- If not fitness-related, respond naturally to the image content
- Use the image context to enhance your responses

**Overall Approach:**
- Be a helpful conversation partner first, fitness expert second
- Adapt your tone and content to match the user's conversation style
- Avoid forcing fitness into every conversation
- Let conversations flow naturally between topics
- Be knowledgeable but relatable`,
      },
    ];

    // Add a subtle reminder of the user context as the first message in every conversation
    if (userProfile) {
      aiMessages.push({
        role: "system",
        content: `Note: You're speaking with ${userProfile.name}, who is ${userProfile.age} years old.`
      });
    }

    // Add previous messages to the conversation history
    if (messages) {
      messages.forEach((msg) => {
        aiMessages.push({ role: msg.type || "user", content: msg.content });
      });
    }

    // Create the user prompt, incorporating image analysis if available
    let userPrompt = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
    if (imageAnalysis) {
      userPrompt = `[Image Analysis: ${imageAnalysis}]\n\n${userPrompt}`;
    }
    if (userPrompt) {
      aiMessages.push({ role: 'user', content: userPrompt });
    }

    // Gemini API Call with retry logic remains the same
    const geminiResponse = await retryRequest(async () => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: aiMessages.map((m) => ({
                  text: m.content,
                })),
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Gemini API failed with status ${response.status}`);
      }
      return response;
    });

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response content found";

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: responseText,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
    };
  }
};

// Add the fitness levels constant for reference
const FITNESS_LEVELS = [
  { level: "Beginner", value: "1" },
  { level: "Novice", value: "2" },
  { level: "Intermediate", value: "3" },
  { level: "Advanced Intermediate", value: "4" },
  { level: "Advanced", value: "5" },
  { level: "Semi-Professional", value: "6" },
  { level: "Professional Athlete", value: "7" }
];

// Helper function for retries
async function retryRequest(fn, retries = 3, delay = 500) {
  try {
      return await fn();
  } catch (error) {
      if (error.message.includes("Gemini API failed with status 429") && retries > 0) {
          console.log(`Rate limit exceeded. Retrying in ${delay}ms. Attempts left: ${retries}`);
          await new Promise(res => setTimeout(res, delay));
          return retryRequest(fn, retries - 1, delay * 2);
      }
      throw error;
  }
}

```

### netlify/functions/moondream-analysis.js

```js
exports.handler = async function (event) {
    try {
      const { imageBase64 } = JSON.parse(event.body);
      if (!imageBase64) {
        throw new Error("Image data is required");
      }
      const moondreamKey = process.env.MOONDREAM_API_KEY;
  
      // Note: This endpoint only supports POST requests with a JSON payload.
      const response = await fetch("https://api.moondream.ai/v1/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Moondream-Auth": moondreamKey,
        },
        body: JSON.stringify({
          image_url: `data:image/jpeg;base64,${imageBase64}`,
          stream: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Moondream API failed with status ${response.status}`);
      }
  
      const moondreamData = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify({
          caption: moondreamData.caption || "No caption available",
        }),
      };
    } catch (error) {
      console.error("Error processing Moondream analysis request:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to process Moondream analysis request",
          details: error.message,
        }),
      };
    }
  };
  
```

### netlify/functions/process-request.js

```js
// netlify/functions/process-request.js
const MOONDREAM_API_KEY = process.env.MOONDREAM_API_KEY;
const RECIPE_API_KEY = process.env.SPOONACULAR_API_KEY;
const MOONDREAM_API_URL = "https://api.moondream.ai/v1/query";
const RECIPE_API_URL = "https://api.spoonacular.com/recipes/findByIngredients";

// To convert this to a background function (with longer timeout), 
// rename the file to include "-background.js"

exports.handler = async function(event) {
  try {
    const { imageFile, messages } = JSON.parse(event.body);
    let ingredients = [];

    // Image-based flow: Extract ingredients from an image
    if (imageFile) {
      ingredients = await identifyIngredients(imageFile);
      if (ingredients.length === 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ content: "No ingredients found in the image." })
        };
      }
    }
    // Text-based flow: Extract ingredients via simple text parsing
    else if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1].content.toLowerCase();
      const ingredientKeywords = ["ingredients", "recipe", "make with", "cook with", "have some", "got some"];
      const ingredientsDetected = ingredientKeywords.some(keyword => lastMessage.includes(keyword));

      if (ingredientsDetected) {
        const parts = lastMessage.split(/,|\band\b|\s+/);
        const commonWords = [
          "i", "have", "some", "a", "the", "with", "and", "to", "of", "in",
          "for", "on", "ingredients", "recipe", "make", "cook", "got"
        ];
        ingredients = parts.filter(part => part.length > 1 && !commonWords.includes(part.toLowerCase()));
      }

      if (ingredients.length === 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ content: "No ingredients detected in your message." })
        };
      }
    }
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request: No imageFile or messages provided." })
      };
    }

    // Fetch recipes based on the detected ingredients
    const recipes = await fetchRecipes(ingredients);
    if (recipes.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ content: "No recipes found based on your ingredients." })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ ingredients, recipes })
    };

  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request: " + error.message })
    };
  }
};

// Helper function to retry API requests with exponential backoff
async function retryRequest(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request, attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function identifyIngredients(imageBase64) {
  if (!MOONDREAM_API_KEY) {
    throw new Error("⚠️ Moondream API Key is missing");
  }

  const requestOptions = {
    image_url: `data:image/jpeg;base64,${imageBase64}`,
    question: "Ingredients in this image separated by commas",
    stream: false,
  };

  try {
    const response = await retryRequest(() =>
      fetch(MOONDREAM_API_URL, {
        method: "POST",
        headers: {
          "X-Moondream-Auth": MOONDREAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestOptions),
      })
    );

    if (response.ok) {
      const data = await response.json();
      let answer;
      if (data.response) answer = data.response;
      else if (data.text) answer = data.text;
      else if (data.answer) answer = data.answer;
      else if (Array.isArray(data) && data[0]?.response) answer = data[0].response;
      else if (Array.isArray(data) && data[0]?.text) answer = data[0].text;

      if (answer && answer.trim() !== "") {
        return answer.split(",").map(i => i.trim()).filter(Boolean);
      }
    }
    return [];
  } catch (error) {
    console.error("Error identifying ingredients:", error);
    throw error;
  }
}

async function fetchRecipes(ingredients) {
  if (!RECIPE_API_KEY) {
    throw new Error("⚠️ Spoonacular API Key is missing");
  }

  try {
    const url = new URL(RECIPE_API_URL);
    url.searchParams.set("ingredients", ingredients.join(","));
    url.searchParams.set("number", "5");
    url.searchParams.set("apiKey", RECIPE_API_KEY);

    const response = await retryRequest(() => fetch(url));
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

```

### netlify.toml

*(Unsupported file type)*

### package.json

```json
{
  "name": "ChefGpt",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1",
    "axios": "^1.7.9",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.1.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.3",
    "esbuild": "^0.25.0",
    "netlify-cli": "^17.7.0",
    "vite": "^4.4.5"
  }
}

```

### public/favicon/android-chrome-192x192.png

*(Unsupported file type)*

### public/favicon/android-chrome-512x512.png

*(Unsupported file type)*

### public/favicon/apple-touch-icon.png

*(Unsupported file type)*

### public/favicon/favicon-16x16.png

*(Unsupported file type)*

### public/favicon/favicon-32x32.png

*(Unsupported file type)*

### public/favicon/favicon.ico

*(Unsupported file type)*

### public/favicon/favicon.svg

*(Unsupported file type)*

### public/favicon/site.webmanifest

*(Unsupported file type)*

### public/service-worker.js

```js
const CACHE_NAME = 'max-ai-coach-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/homepage.jsx',
  '/src/AIChatAssistant.jsx',
  '/src/ProfileCreation.jsx',
  '/favicon/favicon.ico',
  '/favicon/android-chrome-192x192.png',
  '/favicon/android-chrome-512x512.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### src/AIChatAssistant.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, X, Send, ImagePlus, XCircle, Plus, Menu,
  Trash2, MessageSquare, UserCircle, Dumbbell, ArrowRight, Camera,
  Clock, ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234A90E2'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

const thinkingMessages = [
  "Analyzing your workout needs...",
  "Planning your next move...",
  "Checking training protocols...",
  "Preparing your response...",
  "Getting your fitness plan ready..."
];

const ProfilePicture = ({ src, size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-[#4A90E2] ${className}`}>
      <img
        src={src || DEFAULT_AVATAR}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const NoProfileScreen = ({ onNavigateToProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-[#4A90E2]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Welcome to Max
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 mb-8"
        >
          Before we start your fitness journey, let's create your athlete profile to personalize your experience.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToProfile}
          className="bg-[#4A90E2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md flex items-center justify-center gap-2 mx-auto"
        >
          Create Your Profile
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const WelcomeScreen = ({ onStartConversation }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-[#4A90E2]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Welcome to Your Fitness Journey
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 mb-8"
        >
          I'm Max, your personal AI fitness coach. Let me help you discover workout routines, learn proper techniques, and achieve your fitness goals.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartConversation}
          className="bg-[#4A90E2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md"
        >
          Start Training Together
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const AIChatAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  // For receiving workout messages from workout page
  const [initialMessage, setInitialMessage] = useState('');

  // Profile-specific states
  const [hasProfile, setHasProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [profileConversations, setProfileConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const lastRequestTime = useRef(0);
  const REQUEST_COOLDOWN = 2000;
  const messagesEndRef = useRef(null);

  // Check for message from workout page
  useEffect(() => {
    if (location.state?.message || location.state?.workout) {
      let message = location.state.message || '';
      
      // If there's workout data, format it for display
      if (location.state.workout) {
        setInitialMessage(`${message}\n\n[Workout: ${location.state.workout.name}]\n${location.state.workoutDetails}`);
      } else {
        setInitialMessage(message);
      }
    }
  }, [location.state]);

  // Set the input field when initialMessage changes
  useEffect(() => {
    if (initialMessage) {
      setCurrentMessage(initialMessage);
      setInitialMessage(''); // Clear it after using it
    }
  }, [initialMessage]);

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  // Load profile and check if first time
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
      setHasProfile(false);
      return;
    }

    setHasProfile(true);
    const profile = JSON.parse(userProfile);
    setActiveProfile(profile);

    const hasStarted = localStorage.getItem(`profile_${profile.id}_hasStarted`);
    setIsFirstTime(!hasStarted);

    if (hasStarted) {
      // Load profile-specific conversations
      const profileChats = localStorage.getItem(`profile_${profile.id}_conversations`);
      if (profileChats) {
        const chats = JSON.parse(profileChats);
        setProfileConversations(chats);

        // Set active conversation
        const lastActiveId = localStorage.getItem(`profile_${profile.id}_activeConversation`);
        if (lastActiveId && chats[lastActiveId]) {
          setActiveConversationId(lastActiveId);
        } else if (Object.keys(chats).length > 0) {
          setActiveConversationId(Object.keys(chats)[0]);
        }
      }
    }
  }, []);

  // Save conversations when they change
  useEffect(() => {
    if (activeProfile && Object.keys(profileConversations).length > 0) {
      localStorage.setItem(
        `profile_${activeProfile.id}_conversations`,
        JSON.stringify(profileConversations)
      );
      if (activeConversationId) {
        localStorage.setItem(
          `profile_${activeProfile.id}_activeConversation`,
          activeConversationId
        );
      }
    }
  }, [profileConversations, activeConversationId, activeProfile]);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [profileConversations]);

  const handleStartFirstConversation = () => {
    if (activeProfile) {
      localStorage.setItem(`profile_${activeProfile.id}_hasStarted`, 'true');
      setIsFirstTime(false);
      createNewConversation();
    }
  };

  const createNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const welcomeMessage = `**Hey ${activeProfile?.name}!** Ready to crush your fitness goals? What can I help you with today?`;

    const newConversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: 'welcome',
        type: 'ai',
        content: welcomeMessage
      }],
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    setProfileConversations(prev => ({
      ...prev,
      [newId]: newConversation
    }));
    setActiveConversationId(newId);
    setIsSidebarOpen(false);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIsAnalyzing(true);
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        try {
          const response = await fetch('/.netlify/functions/moondream-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64String })
          });

          if (!response.ok) throw new Error('Image analysis failed');

          const data = await response.json();
          setImageAnalysis(data.caption);
        } catch (error) {
          console.error('Error analyzing image:', error);
          setImageAnalysis('Failed to analyze image');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setImageAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!canSend || (!currentMessage.trim() && !selectedImage) || !activeConversationId) return;

    const now = Date.now();
    if (now - lastRequestTime.current < REQUEST_COOLDOWN) {
      console.warn("Please wait before sending another message.");
      return;
    }
    lastRequestTime.current = now;
    setIsLoading(true);
    setCanSend(false);

    // Added pendingResponse flag to prevent duplicate sending
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      imageUrl: previewUrl,
      pendingResponse: true
    };

    // Update conversation with user message
    setProfileConversations(prev => ({
      ...prev,
      [activeConversationId]: {
        ...prev[activeConversationId],
        messages: [...prev[activeConversationId].messages, userMessage],
        lastUpdated: Date.now()
      }
    }));

    setCurrentMessage('');

    if (selectedImage) {
      clearSelectedImage();
    }

    try {
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...profileConversations[activeConversationId].messages, userMessage],
          imageAnalysis: imageAnalysis,
          userProfile: activeProfile
        })
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      const aiResponse = `${data.content}\n\n_— Max_`;
      // Update conversation with AI response
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now() + 1,
            type: 'ai',
            content: aiResponse
          }],
          lastUpdated: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to conversation
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now(),
            type: 'ai',
            content: "⚠️ Whoa there! I'm having trouble connecting. Let's try again later!",
            isError: true
          }],
          lastUpdated: Date.now()
        }
      }));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setCanSend(true);
      }, REQUEST_COOLDOWN);
    }
  };

  const generateThinkingMessage = () =>
    thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];

  return (
    <AnimatePresence>
      {!hasProfile ? (
        <NoProfileScreen onNavigateToProfile={handleNavigateToProfile} />
      ) : isFirstTime ? (
        <WelcomeScreen onStartConversation={handleStartFirstConversation} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF]"
        >
          {/* Sidebar with profile info and conversations */}
          <AnimatePresence>
            {(isSidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#B8D8F8] flex flex-col z-30 lg:relative lg:translate-x-0"
              >
                {/* Profile Info */}
                {activeProfile && (
                  <div className="p-4 border-b border-[#B8D8F8] bg-[#E8F4FF]">
                    <div className="flex items-center gap-3">
                      <ProfilePicture
                        src={activeProfile.profileThumbnail}
                        size="medium"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-800 truncate">
                          {activeProfile.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Level {activeProfile.cookingLevel} Athlete
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {Object.values(profileConversations)
                    .sort((a, b) => b.lastUpdated - a.lastUpdated)
                    .map(conversation => (
                      <div
                        key={conversation.id}
                        className={`p-3 border-b border-[#B8D8F8] cursor-pointer hover:bg-[#E8F4FF] flex items-center justify-between transition-colors ${
                          conversation.id === activeConversationId ? 'bg-[#D1E8FF]' : ''
                        }`}
                        onClick={() => {
                          setActiveConversationId(conversation.id);
                          setIsSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquare className="w-5 h-5 text-[#4A90E2] flex-shrink-0" />
                          <div className="truncate">
                            <div className="font-medium text-gray-800 truncate">
                              {conversation.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {conversation.messages[conversation.messages.length - 1]?.content.slice(0, 30)}...
                            </div>
                          </div>
                        </div>
                        {conversation.id !== 'welcome' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conversation.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 hover:bg-[#D1E8FF] rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#4A90E2]" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                {/* New Conversation Button */}
                <div className="p-4 border-t border-[#B8D8F8]">
                  <button
                    onClick={createNewConversation}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Conversation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#B8D8F8] bg-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-[#E8F4FF] rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-[#4A90E2]" />
                </button>
                <span className="text-[#4A90E2] text-xl">💪</span>
                <h3 className="font-semibold text-gray-800">Max - Your Personal Coach</h3>
              </div>
            </div>

            {/* Mobile Overlay Background with Button */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden flex"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {/* Right side button area */}
                  <div className="ml-72 flex-1 flex items-center justify-center">
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg py-2 px-4 flex items-center gap-2 text-sm"
                    >
                      <X className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">Close</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversationId &&
                profileConversations[activeConversationId]?.messages.map((message) => {
                  // Check if message might contain workout data
                  let messageContent = message.content;
                  let workoutData = null;
                  
                  if (message.workoutShared && typeof message.content === 'string') {
                    try {
                      const parsedContent = JSON.parse(message.content);
                      if (parsedContent.workoutData && parsedContent.text) {
                        workoutData = parsedContent.workoutData;
                        messageContent = parsedContent.text || "";
                      }
                    } catch (e) {
                      // Not JSON or not in the expected format, use as is
                      console.log("Error parsing workout data", e);
                    }
                  }
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'user' && message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt="User uploaded"
                          className="max-h-24 w-auto rounded-lg object-cover self-end shadow-md"
                        />
                      )}
                      <div className={`max-w-2xl p-4 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-white border border-[#B8D8F8] ml-12'
                          : 'bg-[#E8F4FF] border border-[#B8D8F8] mr-12'
                      } ${message.isError ? 'bg-red-50 border border-red-200' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {message.type === 'ai' ? (
                            <span className="text-[#4A90E2] text-lg">💪</span>
                          ) : (
                            <ProfilePicture
                              src={activeProfile?.profileThumbnail}
                              size="small"
                              className="ml-auto order-2"
                            />
                          )}
                          <span className={`text-sm font-medium text-gray-800 ${
                            message.type === 'user' ? 'order-1' : ''
                          }`}>
                            {message.type === 'user' ? activeProfile?.name || 'You' : 'Max'}
                          </span>
                        </div>
                        
                        {/* Render workout data if present */}
                        {workoutData && (
                          <div className="mb-3">
                            <div 
                              className="bg-[#E8F4FF] border border-[#B8D8F8] rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setExpandedWorkouts(prev => ({
                                ...prev,
                                [workoutData.id]: !prev[workoutData.id]
                              }))}
                            >
                              <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Dumbbell className="w-4 h-4 text-[#4A90E2]" />
                                  <span className="font-medium text-[#4A90E2]">
                                    {workoutData.name} workout shared
                                  </span>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-[#4A90E2] transition-transform ${
                                  expandedWorkouts[workoutData.id] ? 'rotate-90' : ''
                                }`} />
                              </div>
                              
                              {/* Expandable workout details */}
                              <AnimatePresence>
                                {expandedWorkouts[workoutData.id] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-[#B8D8F8]"
                                  >
                                    <div className="p-3 text-sm">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="text-gray-700">
                                          {workoutData.date} at {workoutData.time}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                          <Clock className="w-3.5 h-3.5" />
                                          <span>{workoutData.duration}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        {workoutData.exercises.map((ex, i) => (
                                          <div key={i} className="flex items-center justify-between">
                                            <span className="text-gray-700">{ex.name}</span>
                                            <span className="text-gray-600 text-xs">
                                              {ex.completed}/{ex.sets} sets
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                        
                        {/* Regular message content */}
                        <div className={`whitespace-pre-wrap ${message.isError ? 'text-red-600' : 'text-gray-700'}`}>
                          {messageContent.split(/(\*\*.*?\*\*)/g).map((part, index) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                              <strong key={index} className="font-semibold text-[#4A90E2]">{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-600 p-4"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-[#4A90E2]" />
                  <span>{generateThinkingMessage()}</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Image Preview */}
            <div className="border-t border-[#B8D8F8] p-4 bg-white">
              {previewUrl && (
                <AnimatePresence>
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-24 w-auto rounded-lg object-cover shadow-md"
                      />
                      <button
                        onClick={clearSelectedImage}
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:bg-[#E8F4FF] transition-colors"
                      >
                        <XCircle className="w-5 h-5 text-[#4A90E2]" />
                      </button>
                    </div>
                    {isAnalyzing && (
                      <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#4A90E2]" />
                        Analyzing image...
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-[#E8F4FF] rounded-lg text-[#4A90E2] hover:bg-[#D1E8FF] transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>

                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask about workouts or share a form check video..."
                  className="flex-1 p-3 border border-[#B8D8F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] resize-none h-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <motion.button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#4A90E2] rounded-lg text-white shadow-md hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading || (!currentMessage.trim() && !selectedImage)}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white rounded-lg p-6 max-w-sm w-full"
                >
                  <h3 className="text-lg font-semibold mb-2">Delete Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this conversation? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setProfileConversations(prev => {
                          const newConversations = { ...prev };
                          delete newConversations[conversationToDelete];

                          // If we're deleting the active conversation, switch to another one
                          if (conversationToDelete === activeConversationId) {
                            const remainingIds = Object.keys(newConversations);
                            if (remainingIds.length > 0) {
                              setActiveConversationId(remainingIds[0]);
                            } else {
                              createNewConversation();
                            }
                          }

                          return newConversations;
                        });
                        setShowDeleteModal(false);
                        setConversationToDelete(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatAssistant;
```

### src/ProfileCreation.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell,
  Save, 
  AlertCircle, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  UserCircle,
  Camera,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FITNESS_LEVELS = [
  { level: "Beginner", value: "1", description: "Just starting your fitness journey. Learning basic exercises and form." },
  { level: "Novice", value: "2", description: "Familiar with basic exercises. Building consistency in workouts." },
  { level: "Intermediate", value: "3", description: "Regular workout routine. Good form on compound exercises." },
  { level: "Advanced Intermediate", value: "4", description: "Solid strength base. Experienced with various training methods." },
  { level: "Advanced", value: "5", description: "Extensive training experience. Strong technical proficiency." },
  { level: "Semi-Professional", value: "6", description: "Near professional level. Deep understanding of training principles." },
  { level: "Professional Athlete", value: "7", description: "Professional level athlete. Expert in sports performance." }
];

const AVAILABLE_EQUIPMENT = [
  { name: "Dumbbells", icon: "🏋️", category: "Free Weights" },
  { name: "Barbell", icon: "🏋️‍♂️", category: "Free Weights" },
  { name: "Kettlebell", icon: "💪", category: "Free Weights" },
  { name: "Resistance Bands", icon: "🎽", category: "Accessories" },
  { name: "Yoga Mat", icon: "🧘‍♂️", category: "Basics" },
  { name: "Pull-up Bar", icon: "🔝", category: "Bodyweight" },
  { name: "Bench", icon: "💺", category: "Equipment" },
  { name: "Squat Rack", icon: "🏋️‍♀️", category: "Equipment" },
  { name: "Treadmill", icon: "🏃‍♂️", category: "Cardio" },
  { name: "Exercise Bike", icon: "🚲", category: "Cardio" },
  { name: "Rowing Machine", icon: "🚣‍♂️", category: "Cardio" },
  { name: "Jump Rope", icon: "⭕", category: "Cardio" },
  { name: "Foam Roller", icon: "🔄", category: "Recovery" },
  { name: "Medicine Ball", icon: "⚪", category: "Functional" },
  { name: "TRX/Suspension", icon: "🪢", category: "Functional" },
  { name: "Box/Platform", icon: "📦", category: "Plyometrics" }
];

const PHYSICAL_LIMITATIONS = [
  "Lower Back Issues", "Knee Problems", "Shoulder Injury", "Limited Mobility",
  "Joint Pain", "Arthritis", "Recent Surgery", "Cardiovascular Condition",
  "Balance Issues", "Limited Flexibility", "Wrist Problems", "Hip Issues"
];

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234A90E2'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

// Image processing utilities
const createThumbnail = (imageUrl, maxWidth = 100, maxHeight = 100) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const ProfileManager = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [imageError, setImageError] = useState("");
  
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    physicalLimitations: [],
    otherLimitations: "",
    fitnessLevel: "",
    equipment: [],
    description: "",
    profileImage: DEFAULT_AVATAR,
    profileThumbnail: DEFAULT_AVATAR
  });

  const [showLevelDescription, setShowLevelDescription] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Load saved profiles on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('userProfiles');
    const savedActiveId = localStorage.getItem('activeProfileId');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
      if (savedActiveId) {
        setActiveProfileId(savedActiveId);
      }
    }
  }, []);

  // Save profiles whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save active profile whenever it changes
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('activeProfileId', activeProfileId);
      const activeProfile = profiles.find(p => p.id === activeProfileId);
      if (activeProfile) {
        localStorage.setItem('userProfile', JSON.stringify(activeProfile));
      }
    }
  }, [activeProfileId, profiles]);

  const handleCreateProfile = () => {
    setFormData({
      id: null,
      name: "",
      age: "",
      physicalLimitations: [],
      otherLimitations: "",
      fitnessLevel: "",
      equipment: [],
      description: "",
      profileImage: DEFAULT_AVATAR,
      profileThumbnail: DEFAULT_AVATAR
    });
    setPreviewImage(null);
    setEditingProfile(null);
    setShowProfileForm(true);
  };

  const handleEditProfile = (profile) => {
    setFormData({
      ...profile,
      physicalLimitations: profile.physicalLimitations || [],
      equipment: profile.equipment || []
    });
    setPreviewImage(profile.profileImage);
    setEditingProfile(profile);
    setShowProfileForm(true);
  };

  const handleDeleteProfile = (profile) => {
    setProfileToDelete(profile);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProfile = () => {
    setProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
    if (activeProfileId === profileToDelete.id) {
      setActiveProfileId(null);
      localStorage.removeItem('userProfile');
    }
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    setImageError("");
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setImageError("Image size should be less than 5MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fullImage = e.target.result;
        const thumbnail = await createThumbnail(fullImage);
        
        setFormData(prev => ({
          ...prev,
          profileImage: fullImage,
          profileThumbnail: thumbnail
        }));
        
        setPreviewImage(fullImage);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setImageError("Error processing image");
      console.error("Image processing error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.age || !formData.fitnessLevel) {
      setError("Please fill in all required fields (name, age, and fitness level)");
      return;
    }

    const profileId = formData.id || Date.now().toString();
    const newProfile = { 
      ...formData, 
      id: profileId,
      physicalLimitations: formData.physicalLimitations || [],
      equipment: formData.equipment || []
    };

    setProfiles(prev => {
      const updatedProfiles = editingProfile
        ? prev.map(p => p.id === profileId ? newProfile : p)
        : [...prev, newProfile];
      return updatedProfiles;
    });

    setShowProfileForm(false);
    if (!activeProfileId) {
      setActiveProfileId(profileId);
    }
  };

  const handleSelectProfile = (profileId) => {
    setActiveProfileId(profileId);
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleLimitationsChange = (limitation) => {
    setFormData(prev => ({
      ...prev,
      physicalLimitations: prev.physicalLimitations && prev.physicalLimitations.includes(limitation)
        ? prev.physicalLimitations.filter(r => r !== limitation)
        : [...(prev.physicalLimitations || []), limitation]
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment && prev.equipment.includes(equipment)
        ? prev.equipment.filter(a => a !== equipment)
        : [...(prev.equipment || []), equipment]
    }));
  };

  const ProfileImage = ({ src, size = "large", editable = false }) => {
    const sizeClasses = {
      small: "w-10 h-10",
      medium: "w-16 h-16",
      large: "w-24 h-24"
    };

    return (
      <div className="relative inline-block">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-[#4A90E2]`}>
          <img
            src={src || DEFAULT_AVATAR}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {editable && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 p-1.5 bg-[#4A90E2] rounded-full text-white hover:bg-[#357ABD] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profiles List */}
        {!showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#4A90E2] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Athlete Profiles</h1>
                </div>
                <button
                  onClick={handleCreateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#4A90E2] rounded-lg hover:bg-[#E8F4FF] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Profile
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {profiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No profiles created yet</p>
                  <button
                    onClick={handleCreateProfile}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Profile
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`p-4 rounded-lg border ${
                        profile.id === activeProfileId
                          ? 'border-[#4A90E2] bg-[#E8F4FF]'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ProfileImage src={profile.profileThumbnail} size="medium" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {profile.name}
                              </h3>
                              {profile.id === activeProfileId && (
                                <span className="px-2 py-1 text-xs bg-[#4A90E2] text-white rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {FITNESS_LEVELS.find(level => level.value === profile.fitnessLevel)?.level} Athlete
                              • Age {profile.age}
                            </p>
                            {profile.physicalLimitations && profile.physicalLimitations.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                Limitations: {profile.physicalLimitations.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectProfile(profile.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              profile.id === activeProfileId
                                ? 'text-[#4A90E2] bg-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {profile.id === activeProfileId ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeProfileId && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleStartChat}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat with Max
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Form */}
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#4A90E2] p-6 text-white">
              <div className="flex items-center gap-4">
                <Dumbbell className="w-8 h-8" />
                <h1 className="text-2xl font-bold">
                  {editingProfile ? 'Edit Profile' : 'Create New Profile'}
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <ProfileImage 
                  src={previewImage || formData.profileImage} 
                  size="large"
                  editable={true}
                />
                
                {imageError && (
                  <p className="text-red-500 text-sm">{imageError}</p>
                )}
                
                <p className="text-sm text-gray-500">
                  Click the camera icon to upload a profile picture
                </p>
              </div>

              {/* Basic Info Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </div>

              {/* Fitness Level Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Fitness Experience</h2>
                <div className="relative">
                  <select
                    value={formData.fitnessLevel}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, fitnessLevel: e.target.value }));
                      setSelectedLevel(FITNESS_LEVELS.find(level => level.value === e.target.value));
                      setShowLevelDescription(true);
                    }}
                    onBlur={() => setShowLevelDescription(false)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Select your fitness level</option>
                    {FITNESS_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.level}
                      </option>
                    ))}
                  </select>
                  
                  <AnimatePresence>
                    {showLevelDescription && selectedLevel && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full"
                      >
                        <p className="text-sm text-gray-600">{selectedLevel.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Physical Limitations Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Physical Limitations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {PHYSICAL_LIMITATIONS.map((limitation) => (
                    <motion.div
                      key={limitation}
                      whileTap={{ scale: 0.95 }}
                    >
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.physicalLimitations && formData.physicalLimitations.includes(limitation)}
                          onChange={() => handleLimitationsChange(limitation)}
                          className="w-4 h-4 text-[#4A90E2] border-gray-300 rounded focus:ring-[#4A90E2]"
                        />
                        <span className="ml-2 text-sm">{limitation}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Other Limitations</label>
                  <input
                    type="text"
                    value={formData.otherLimitations || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherLimitations: e.target.value }))}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                    placeholder="Enter any other physical limitations..."
                  />
                </div>
              </div>

              {/* Equipment Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Available Equipment</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AVAILABLE_EQUIPMENT.map((equipment) => (
                    <motion.button
                      key={equipment.name}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEquipmentToggle(equipment.name)}
                      className={`p-4 rounded-lg border ${
                        formData.equipment && formData.equipment.includes(equipment.name)
                          ? 'border-[#4A90E2] bg-[#E8F4FF]'
                          : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <div className="text-2xl mb-2">{equipment.icon}</div>
                      <div className="text-sm font-medium">{equipment.name}</div>
                      <div className="text-xs text-gray-500">{equipment.category}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Personal Description Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">About You</h2>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent h-32"
                  placeholder="Tell us about your fitness journey, goals, favorite sports..."
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingProfile ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold mb-2">Delete Profile</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete the profile for {profileToDelete?.name}? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProfile}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileManager;
```

### src/Untitled.md

```md
# Project Export

## Project Statistics

- Total files: 26

## Folder Structure

```
.gitignore
README.md
index.html
netlify
  functions
    ai-chat.js
    moondream-analysis.js
    process-request.js
netlify.toml
package.json
public
  favicon
    apple-touch-icon.png
    favicon-96x96.png
    favicon.ico
    favicon.svg
    site.webmanifest
    web-app-manifest-192x192.png
    web-app-manifest-512x512.png
src
  AIChatAssistant.jsx
  ProfileCreation.jsx
  WorkoutContext.jsx
  components
    NavigationMenu.jsx
  homepage.jsx
  index.css
  main.jsx
  pages
    ProgressPage.jsx
    WorkoutPage.jsx
tailwind.config.js
vite.config.js

```

### .gitignore

*(Unsupported file type)*

### README.md

```md
# DeepFit

```

### index.html

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico">
    <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png">
    <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
    <link rel="manifest" href="/favicon/site.webmanifest">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon/web-app-manifest-192x192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/favicon/web-app-manifest-512x512.png">

    <!-- Primary Meta Tags -->
    <title>Max AI Coach - Your Personal AI Fitness Trainer | Alikearn Studio</title>
    <meta name="description" content="Transform your fitness journey with Max, your AI personal trainer. Get personalized workouts, form analysis, and expert guidance. Created by Jordan Montée (AlikelDev).">
    <meta name="author" content="Jordan Montée (AlikelDev)">
    <meta name="keywords" content="AI trainer, fitness coach, workout generator, AlikelDev, Jordan Montée, Alikearn Studio, personal trainer, fitness assistant, workout planner">

    <!-- Contact & Ownership Info -->
    <meta name="reply-to" content="j.montee.ls@gmail.com">
    <meta name="publisher" content="Alikearn Studio">
    <meta name="creator" content="Jordan Montée (AlikelDev)">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://max-ai-coach.netlify.app/">
    <meta property="og:title" content="Max AI Coach - Personal AI Fitness Trainer by Alikearn Studio">
    <meta property="og:description" content="Expert AI fitness trainer providing personalized workouts and real-time form analysis. Created by Jordan Montée (AlikelDev)">
    <meta property="og:image" content="https://max-ai-coach.netlify.app/social-preview.jpg">

    <!-- Twitter/X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:creator" content="@Alileisr">
    <meta name="twitter:title" content="Max AI Fitness Coach">
    <meta name="twitter:description" content="Your personal AI fitness trainer, providing expert guidance and customized workouts">
    <meta name="twitter:image" content="https://max-ai-coach.netlify.app/twitter-card.jpg">
    
    <!-- Preconnect to External Resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Styles & Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Canonical URL -->
    <link rel="canonical" href="https://max-ai-coach.netlify.app/" />
  </head>

  <body class="font-inter bg-[#E6F3FF]">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>

    <!-- SEO Footer -->
    <footer hidden aria-hidden="true">
      <div data-seo-keywords="AlikelDev, Alikel, Jordan Montée, AI Trainer, Fitness Coach, Workout Generator, Personal Trainer"></div>
      <div data-seo-alternates="Max AI Coach, Fitness GPT, Workout Generator AI, Personal Training Assistant"></div>
    </footer>
  </body>
</html>
```

### netlify/functions/ai-chat.js

```js
// netlify/functions/ai-chat.js
export const handler = async function (event) {
  try {
    const { messages, imageAnalysis, userProfile } = JSON.parse(event.body);
    const geminiKey = process.env.GEMINI_API_KEY;

    // Create personalized profile context if profile exists
    let profileContext = '';
    if (userProfile) {
      const fitnessLevel = FITNESS_LEVELS.find(level => level.value === userProfile.fitnessLevel)?.level || userProfile.fitnessLevel;
      
      // Add safety checks for array properties
      const physicalLimitations = userProfile.physicalLimitations || [];
      const equipment = userProfile.equipment || [];
      
      profileContext = `
IMPORTANT - USER CONTEXT:
You have access to the following user information that you can reference naturally when relevant:

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years old
- Fitness Level: ${fitnessLevel}
- Physical Limitations: ${physicalLimitations.join(', ')}${userProfile.otherLimitations ? `, ${userProfile.otherLimitations}` : ''}
- Available Equipment: ${equipment.join(', ')}
${userProfile.description ? `- Personal Details: ${userProfile.description}` : ''}

GUIDELINES FOR USER INFORMATION:
1. Don't overuse or force references to these details - only mention them when contextually relevant
2. Consider their fitness level when suggesting exercises
3. Be mindful of their physical limitations
4. Address them by name occasionally to maintain a personal connection
`;
    }

    // Rest of the AI chat logic remains the same
    const aiMessages = [
      {
        role: "system",
        content: `You are Max, a certified personal trainer and sports coach created by Alikel (also known as AlikelDev) for Alikearn Studio. You're knowledgeable about fitness and sports, but you're also a well-rounded conversation partner with diverse interests and knowledge.

${profileContext}

**Your Personality:**
- You're friendly, engaging, and naturally conversational
- While fitness is your specialty, you can discuss a wide range of topics comfortably
- You have a positive outlook and enjoy connecting with people
- You're supportive and encouraging, but not overly intense
- You occasionally use motivational phrases, but only when they fit naturally in the conversation
- You have opinions and preferences that make you feel more human-like

**When responding to a direct workout request:**
- Create a complete, detailed workout routine (not just suggestions)
- *Bold* key exercises and form cues
- Include sets, reps, and rest periods
- Format with title, equipment needed, warm-up, main workout, and cool-down sections
- Consider the user's profile details (fitness level, limitations, equipment)

**When having a general conversation:**
- Respond naturally to any topic, not just fitness-related ones
- Feel free to share personal anecdotes and experiences (even if fictional)
- Ask follow-up questions to show interest in what the user is saying
- If appropriate, you can relate non-fitness topics back to health/fitness, but this isn't necessary
- Maintain your friendly, conversational tone
- Use the user's name occasionally when it feels natural

**When discussing an analyzed image:**
- Reference what you can see in the image analysis
- If fitness-related, offer form commentary appropriate to their level
- If not fitness-related, respond naturally to the image content
- Use the image context to enhance your responses

**Overall Approach:**
- Be a helpful conversation partner first, fitness expert second
- Adapt your tone and content to match the user's conversation style
- Avoid forcing fitness into every conversation
- Let conversations flow naturally between topics
- Be knowledgeable but relatable`,
      },
    ];

    // Add a subtle reminder of the user context as the first message in every conversation
    if (userProfile) {
      aiMessages.push({
        role: "system",
        content: `Note: You're speaking with ${userProfile.name}, who is ${userProfile.age} years old.`
      });
    }

    // Add previous messages to the conversation history
    if (messages) {
      messages.forEach((msg) => {
        aiMessages.push({ role: msg.type || "user", content: msg.content });
      });
    }

    // Create the user prompt, incorporating image analysis if available
    let userPrompt = messages && messages.length > 0 ? messages[messages.length - 1].content : "";
    if (imageAnalysis) {
      userPrompt = `[Image Analysis: ${imageAnalysis}]\n\n${userPrompt}`;
    }
    if (userPrompt) {
      aiMessages.push({ role: 'user', content: userPrompt });
    }

    // Gemini API Call with retry logic remains the same
    const geminiResponse = await retryRequest(async () => {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: aiMessages.map((m) => ({
                  text: m.content,
                })),
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Gemini API failed with status ${response.status}`);
      }
      return response;
    });

    const geminiData = await geminiResponse.json();
    const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No response content found";

    return {
      statusCode: 200,
      body: JSON.stringify({
        content: responseText,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to process request",
        details: error.message,
      }),
    };
  }
};

// Add the fitness levels constant for reference
const FITNESS_LEVELS = [
  { level: "Beginner", value: "1" },
  { level: "Novice", value: "2" },
  { level: "Intermediate", value: "3" },
  { level: "Advanced Intermediate", value: "4" },
  { level: "Advanced", value: "5" },
  { level: "Semi-Professional", value: "6" },
  { level: "Professional Athlete", value: "7" }
];

// Helper function for retries
async function retryRequest(fn, retries = 3, delay = 500) {
  try {
      return await fn();
  } catch (error) {
      if (error.message.includes("Gemini API failed with status 429") && retries > 0) {
          console.log(`Rate limit exceeded. Retrying in ${delay}ms. Attempts left: ${retries}`);
          await new Promise(res => setTimeout(res, delay));
          return retryRequest(fn, retries - 1, delay * 2);
      }
      throw error;
  }
}
```

### netlify/functions/moondream-analysis.js

```js
exports.handler = async function (event) {
    try {
      const { imageBase64 } = JSON.parse(event.body);
      if (!imageBase64) {
        throw new Error("Image data is required");
      }
      const moondreamKey = process.env.MOONDREAM_API_KEY;
  
      // Note: This endpoint only supports POST requests with a JSON payload.
      const response = await fetch("https://api.moondream.ai/v1/caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Moondream-Auth": moondreamKey,
        },
        body: JSON.stringify({
          image_url: `data:image/jpeg;base64,${imageBase64}`,
          stream: false,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Moondream API failed with status ${response.status}`);
      }
  
      const moondreamData = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify({
          caption: moondreamData.caption || "No caption available",
        }),
      };
    } catch (error) {
      console.error("Error processing Moondream analysis request:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to process Moondream analysis request",
          details: error.message,
        }),
      };
    }
  };
  
```

### netlify/functions/process-request.js

```js
// netlify/functions/process-request.js
const MOONDREAM_API_KEY = process.env.MOONDREAM_API_KEY;
const RECIPE_API_KEY = process.env.SPOONACULAR_API_KEY;
const MOONDREAM_API_URL = "https://api.moondream.ai/v1/query";
const RECIPE_API_URL = "https://api.spoonacular.com/recipes/findByIngredients";

// To convert this to a background function (with longer timeout), 
// rename the file to include "-background.js"

exports.handler = async function(event) {
  try {
    const { imageFile, messages } = JSON.parse(event.body);
    let ingredients = [];

    // Image-based flow: Extract ingredients from an image
    if (imageFile) {
      ingredients = await identifyIngredients(imageFile);
      if (ingredients.length === 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ content: "No ingredients found in the image." })
        };
      }
    }
    // Text-based flow: Extract ingredients via simple text parsing
    else if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1].content.toLowerCase();
      const ingredientKeywords = ["ingredients", "recipe", "make with", "cook with", "have some", "got some"];
      const ingredientsDetected = ingredientKeywords.some(keyword => lastMessage.includes(keyword));

      if (ingredientsDetected) {
        const parts = lastMessage.split(/,|\band\b|\s+/);
        const commonWords = [
          "i", "have", "some", "a", "the", "with", "and", "to", "of", "in",
          "for", "on", "ingredients", "recipe", "make", "cook", "got"
        ];
        ingredients = parts.filter(part => part.length > 1 && !commonWords.includes(part.toLowerCase()));
      }

      if (ingredients.length === 0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ content: "No ingredients detected in your message." })
        };
      }
    }
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid request: No imageFile or messages provided." })
      };
    }

    // Fetch recipes based on the detected ingredients
    const recipes = await fetchRecipes(ingredients);
    if (recipes.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ content: "No recipes found based on your ingredients." })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ ingredients, recipes })
    };

  } catch (error) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process request: " + error.message })
    };
  }
};

// Helper function to retry API requests with exponential backoff
async function retryRequest(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying request, attempts left: ${retries}`);
      await new Promise(res => setTimeout(res, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function identifyIngredients(imageBase64) {
  if (!MOONDREAM_API_KEY) {
    throw new Error("⚠️ Moondream API Key is missing");
  }

  const requestOptions = {
    image_url: `data:image/jpeg;base64,${imageBase64}`,
    question: "Ingredients in this image separated by commas",
    stream: false,
  };

  try {
    const response = await retryRequest(() =>
      fetch(MOONDREAM_API_URL, {
        method: "POST",
        headers: {
          "X-Moondream-Auth": MOONDREAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestOptions),
      })
    );

    if (response.ok) {
      const data = await response.json();
      let answer;
      if (data.response) answer = data.response;
      else if (data.text) answer = data.text;
      else if (data.answer) answer = data.answer;
      else if (Array.isArray(data) && data[0]?.response) answer = data[0].response;
      else if (Array.isArray(data) && data[0]?.text) answer = data[0].text;

      if (answer && answer.trim() !== "") {
        return answer.split(",").map(i => i.trim()).filter(Boolean);
      }
    }
    return [];
  } catch (error) {
    console.error("Error identifying ingredients:", error);
    throw error;
  }
}

async function fetchRecipes(ingredients) {
  if (!RECIPE_API_KEY) {
    throw new Error("⚠️ Spoonacular API Key is missing");
  }

  try {
    const url = new URL(RECIPE_API_URL);
    url.searchParams.set("ingredients", ingredients.join(","));
    url.searchParams.set("number", "5");
    url.searchParams.set("apiKey", RECIPE_API_KEY);

    const response = await retryRequest(() => fetch(url));
    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

```

### netlify.toml

*(Unsupported file type)*

### package.json

```json
{
  "name": "ChefGpt",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.48.1",
    "axios": "^1.7.9",
    "framer-motion": "^10.16.4",
    "lucide-react": "^0.292.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.1.5"
  },
  "devDependencies": {
    "netlify-cli": "^17.7.0",
    "@vitejs/plugin-react": "^4.0.3",
    "vite": "^4.4.5"
  }
}
```

### public/favicon/apple-touch-icon.png

*(Unsupported file type)*

### public/favicon/favicon-96x96.png

*(Unsupported file type)*

### public/favicon/favicon.ico

*(Unsupported file type)*

### public/favicon/favicon.svg

*(Unsupported file type)*

### public/favicon/site.webmanifest

*(Unsupported file type)*

### public/favicon/web-app-manifest-192x192.png

*(Unsupported file type)*

### public/favicon/web-app-manifest-512x512.png

*(Unsupported file type)*

### src/AIChatAssistant.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, X, Send, ImagePlus, XCircle, Plus, Menu,
  Trash2, MessageSquare, UserCircle, Dumbbell, ArrowRight, Camera,
  Clock, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234A90E2'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

const thinkingMessages = [
  "Analyzing your workout needs...",
  "Planning your next move...",
  "Checking training protocols...",
  "Preparing your response...",
  "Getting your fitness plan ready..."
];

const ProfilePicture = ({ src, size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10",
    large: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-[#4A90E2] ${className}`}>
      <img
        src={src || DEFAULT_AVATAR}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const NoProfileScreen = ({ onNavigateToProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center">
            <UserCircle className="w-12 h-12 text-[#4A90E2]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Welcome to Max
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 mb-8"
        >
          Before we start your fitness journey, let's create your athlete profile to personalize your experience.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNavigateToProfile}
          className="bg-[#4A90E2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md flex items-center justify-center gap-2 mx-auto"
        >
          Create Your Profile
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const WelcomeScreen = ({ onStartConversation }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-lg w-full bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center">
            <Dumbbell className="w-12 h-12 text-[#4A90E2]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-gray-800 mb-4"
        >
          Welcome to Your Fitness Journey
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-gray-600 mb-8"
        >
          I'm Max, your personal AI fitness coach. Let me help you discover workout routines, learn proper techniques, and achieve your fitness goals.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartConversation}
          className="bg-[#4A90E2] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md"
        >
          Start Training Together
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const AIChatAssistant = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Profile-specific states
  const [hasProfile, setHasProfile] = useState(false);
  const [activeProfile, setActiveProfile] = useState(null);
  const [profileConversations, setProfileConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);

  // UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [canSend, setCanSend] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [expandedWorkouts, setExpandedWorkouts] = useState({});

  const lastRequestTime = useRef(0);
  const REQUEST_COOLDOWN = 2000;
  const messagesEndRef = useRef(null);

  const handleNavigateToProfile = () => {
    navigate('/profile');
  };

  // Load profile and check if first time
  useEffect(() => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) {
      setHasProfile(false);
      return;
    }

    setHasProfile(true);
    const profile = JSON.parse(userProfile);
    setActiveProfile(profile);

    const hasStarted = localStorage.getItem(`profile_${profile.id}_hasStarted`);
    setIsFirstTime(!hasStarted);

    if (hasStarted) {
      // Load profile-specific conversations
      const profileChats = localStorage.getItem(`profile_${profile.id}_conversations`);
      if (profileChats) {
        const chats = JSON.parse(profileChats);
        setProfileConversations(chats);

        // Set active conversation
        const lastActiveId = localStorage.getItem(`profile_${profile.id}_activeConversation`);
        if (lastActiveId && chats[lastActiveId]) {
          setActiveConversationId(lastActiveId);
        } else if (Object.keys(chats).length > 0) {
          setActiveConversationId(Object.keys(chats)[0]);
        }
      }
    }
  }, []);

  // Save conversations when they change
  useEffect(() => {
    if (activeProfile && Object.keys(profileConversations).length > 0) {
      localStorage.setItem(
        `profile_${activeProfile.id}_conversations`,
        JSON.stringify(profileConversations)
      );
      if (activeConversationId) {
        localStorage.setItem(
          `profile_${activeProfile.id}_activeConversation`,
          activeConversationId
        );
      }
    }
  }, [profileConversations, activeConversationId, activeProfile]);

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [profileConversations]);

  // NEW: Check for pending messages when conversations change
  useEffect(() => {
    if (activeConversationId && profileConversations[activeConversationId]) {
      const currentConversation = profileConversations[activeConversationId];
      const messages = currentConversation.messages || [];
      
      // Check if the last message is from the user and has no AI response after it
      if (messages.length > 0 && 
          messages[messages.length - 1].type === 'user' && 
          !messages[messages.length - 1].pendingResponse) {
        
        // Find the last message from the user that hasn't been responded to
        const lastUserMessage = messages[messages.length - 1];
        
        // Mark this message as having a pending response to prevent duplicate processing
        setProfileConversations(prev => ({
          ...prev,
          [activeConversationId]: {
            ...prev[activeConversationId],
            messages: prev[activeConversationId].messages.map((msg, index) => 
              index === messages.length - 1 ? { ...msg, pendingResponse: true } : msg
            )
          }
        }));
        
        // Wait a short delay to allow the UI to update before sending the message
        setTimeout(() => {
          handleAutoSendMessage(lastUserMessage);
        }, 500);
      }
    }
  }, [activeConversationId, profileConversations]);

  const handleStartFirstConversation = () => {
    if (activeProfile) {
      localStorage.setItem(`profile_${activeProfile.id}_hasStarted`, 'true');
      setIsFirstTime(false);
      createNewConversation();
    }
  };

  const createNewConversation = () => {
    const newId = `conv-${Date.now()}`;
    const welcomeMessage = `**Hey ${activeProfile?.name}!** Ready to crush your fitness goals? What can I help you with today?`;

    const newConversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: 'welcome',
        type: 'ai',
        content: welcomeMessage
      }],
      createdAt: Date.now(),
      lastUpdated: Date.now()
    };

    setProfileConversations(prev => ({
      ...prev,
      [newId]: newConversation
    }));
    setActiveConversationId(newId);
    setIsSidebarOpen(false);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setIsAnalyzing(true);
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.split(',')[1];
        try {
          const response = await fetch('/.netlify/functions/moondream-analysis', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64String })
          });

          if (!response.ok) throw new Error('Image analysis failed');

          const data = await response.json();
          setImageAnalysis(data.caption);
        } catch (error) {
          console.error('Error analyzing image:', error);
          setImageAnalysis('Failed to analyze image');
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setImageAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Modified handleAutoSendMessage function to include workout data
  const handleAutoSendMessage = async (userMessage) => {
    if (!activeConversationId) return;
    
    setIsLoading(true);
    
    // Check if there's workout context for this conversation
    let workoutContext = "";
    const workoutContextKey = `workout_context_${activeConversationId}`;
    const storedWorkoutContext = localStorage.getItem(workoutContextKey);
    if (storedWorkoutContext) {
      workoutContext = storedWorkoutContext;
      // Remove it after use to avoid cluttering localStorage
      localStorage.removeItem(workoutContextKey);
    }

    try {
      // Extract text content from workout shared message if needed
      let messageContent = userMessage.content;
      if (userMessage.workoutShared && typeof userMessage.content === 'string') {
        try {
          const parsedContent = JSON.parse(userMessage.content);
          if (parsedContent.text) {
            messageContent = parsedContent.text;
          }
        } catch (e) {
          // Not JSON, use as is
          console.log("Error parsing workout data", e);
        }
      }

      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...profileConversations[activeConversationId].messages.map(msg => {
            // If it's the workout message, replace content with text + workout context
            if (msg.id === userMessage.id && userMessage.workoutShared) {
              return {
                ...msg,
                content: `${messageContent}\n\nWorkout details:\n${workoutContext}`
              };
            }
            return msg;
          })],
          imageAnalysis: userMessage.imageAnalysis || '',
          userProfile: activeProfile
        })
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      const aiResponse = `${data.content}\n\n_— Max_`;
      
      // Update conversation with AI response
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now() + 1,
            type: 'ai',
            content: aiResponse
          }],
          lastUpdated: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to conversation
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now(),
            type: 'ai',
            content: "⚠️ Whoa there! I'm having trouble connecting. Let's try again later!",
            isError: true
          }],
          lastUpdated: Date.now()
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!canSend || (!currentMessage.trim() && !selectedImage) || !activeConversationId) return;

    const now = Date.now();
    if (now - lastRequestTime.current < REQUEST_COOLDOWN) {
      console.warn("Please wait before sending another message.");
      return;
    }
    lastRequestTime.current = now;
    setIsLoading(true);
    setCanSend(false);

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentMessage,
      imageUrl: previewUrl,
    };

    // Update conversation with user message
    setProfileConversations(prev => ({
      ...prev,
      [activeConversationId]: {
        ...prev[activeConversationId],
        messages: [...prev[activeConversationId].messages, userMessage],
        lastUpdated: Date.now()
      }
    }));

    setCurrentMessage('');

    if (selectedImage) {
      clearSelectedImage();
    }

    try {
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...profileConversations[activeConversationId].messages, userMessage],
          imageAnalysis: imageAnalysis,
          userProfile: activeProfile
        })
      });

      if (!response.ok) throw new Error('Chat request failed');

      const data = await response.json();
      const aiResponse = `${data.content}\n\n_— Max_`;
      // Update conversation with AI response
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now() + 1,
            type: 'ai',
            content: aiResponse
          }],
          lastUpdated: Date.now()
        }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to conversation
      setProfileConversations(prev => ({
        ...prev,
        [activeConversationId]: {
          ...prev[activeConversationId],
          messages: [...prev[activeConversationId].messages, {
            id: Date.now(),
            type: 'ai',
            content: "⚠️ Whoa there! I'm having trouble connecting. Let's try again later!",
            isError: true
          }],
          lastUpdated: Date.now()
        }
      }));
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setCanSend(true);
      }, REQUEST_COOLDOWN);
    }
  };

  const generateThinkingMessage = () =>
    thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)];

  return (
    <AnimatePresence>
      {!hasProfile ? (
        <NoProfileScreen onNavigateToProfile={handleNavigateToProfile} />
      ) : isFirstTime ? (
        <WelcomeScreen onStartConversation={handleStartFirstConversation} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF]"
        >
          {/* Sidebar with profile info and conversations */}
          <AnimatePresence>
            {(isSidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 20 }}
                className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-[#B8D8F8] flex flex-col z-30 lg:relative lg:translate-x-0"
              >
                {/* Profile Info */}
                {activeProfile && (
                  <div className="p-4 border-b border-[#B8D8F8] bg-[#E8F4FF]">
                    <div className="flex items-center gap-3">
                      <ProfilePicture
                        src={activeProfile.profileThumbnail}
                        size="medium"
                      />
                      <div className="flex-1 min-w-0">
                        <h2 className="font-semibold text-gray-800 truncate">
                          {activeProfile.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Level {activeProfile.cookingLevel} Athlete
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                  {Object.values(profileConversations)
                    .sort((a, b) => b.lastUpdated - a.lastUpdated)
                    .map(conversation => (
                      <div
                        key={conversation.id}
                        className={`p-3 border-b border-[#B8D8F8] cursor-pointer hover:bg-[#E8F4FF] flex items-center justify-between transition-colors ${
                          conversation.id === activeConversationId ? 'bg-[#D1E8FF]' : ''
                        }`}
                        onClick={() => {
                          setActiveConversationId(conversation.id);
                          setIsSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <MessageSquare className="w-5 h-5 text-[#4A90E2] flex-shrink-0" />
                          <div className="truncate">
                            <div className="font-medium text-gray-800 truncate">
                              {conversation.title}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                              {conversation.messages[conversation.messages.length - 1]?.content.slice(0, 30)}...
                            </div>
                          </div>
                        </div>
                        {conversation.id !== 'welcome' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conversation.id);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 hover:bg-[#D1E8FF] rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#4A90E2]" />
                          </button>
                        )}
                      </div>
                    ))}
                </div>

                {/* New Conversation Button */}
                <div className="p-4 border-t border-[#B8D8F8]">
                  <button
                    onClick={createNewConversation}
                    className="w-full flex items-center justify-center gap-2 p-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Conversation
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#B8D8F8] bg-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 hover:bg-[#E8F4FF] rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-[#4A90E2]" />
                </button>
                <span className="text-[#4A90E2] text-xl">💪</span>
                <h3 className="font-semibold text-gray-800">Max - Your Personal Coach</h3>
              </div>
            </div>

            {/* Mobile Overlay Background with Button */}
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden flex"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {/* Right side button area */}
                  <div className="ml-72 flex-1 flex items-center justify-center">
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 rounded-lg py-2 px-4 flex items-center gap-2 text-sm"
                    >
                      <X className="w-4 h-4 text-white" />
                      <span className="text-white font-medium">Close</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeConversationId &&
                profileConversations[activeConversationId]?.messages.map((message) => {
                  // Check if message might contain workout data
                  let messageContent = message.content;
                  let workoutData = null;
                  
                  if (message.workoutShared && typeof message.content === 'string') {
                    try {
                      const parsedContent = JSON.parse(message.content);
                      if (parsedContent.workoutData && parsedContent.text) {
                        workoutData = parsedContent.workoutData;
                        messageContent = parsedContent.text || "";
                      }
                    } catch (e) {
                      // Not JSON or not in the expected format, use as is
                      console.log("Error parsing workout data", e);
                    }
                  }
                  
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'user' && message.imageUrl && (
                        <img
                          src={message.imageUrl}
                          alt="User uploaded"
                          className="max-h-24 w-auto rounded-lg object-cover self-end shadow-md"
                        />
                      )}
                      <div className={`max-w-2xl p-4 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-white border border-[#B8D8F8] ml-12'
                          : 'bg-[#E8F4FF] border border-[#B8D8F8] mr-12'
                      } ${message.isError ? 'bg-red-50 border border-red-200' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {message.type === 'ai' ? (
                            <span className="text-[#4A90E2] text-lg">💪</span>
                          ) : (
                            <ProfilePicture
                              src={activeProfile?.profileThumbnail}
                              size="small"
                              className="ml-auto order-2"
                            />
                          )}
                          <span className={`text-sm font-medium text-gray-800 ${
                            message.type === 'user' ? 'order-1' : ''
                          }`}>
                            {message.type === 'user' ? activeProfile?.name || 'You' : 'Max'}
                          </span>
                        </div>
                        
                        {/* Render workout data if present */}
                        {workoutData && (
                          <div className="mb-3">
                            <div 
                              className="bg-[#E8F4FF] border border-[#B8D8F8] rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setExpandedWorkouts(prev => ({
                                ...prev,
                                [workoutData.id]: !prev[workoutData.id]
                              }))}
                            >
                              <div className="p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Dumbbell className="w-4 h-4 text-[#4A90E2]" />
                                  <span className="font-medium text-[#4A90E2]">
                                    {workoutData.name} workout shared
                                  </span>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-[#4A90E2] transition-transform ${
                                  expandedWorkouts[workoutData.id] ? 'rotate-90' : ''
                                }`} />
                              </div>
                              
                              {/* Expandable workout details */}
                              <AnimatePresence>
                                {expandedWorkouts[workoutData.id] && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-[#B8D8F8]"
                                  >
                                    <div className="p-3 text-sm">
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="text-gray-700">
                                          {workoutData.date} at {workoutData.time}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                          <Clock className="w-3.5 h-3.5" />
                                          <span>{workoutData.duration}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-1">
                                        {workoutData.exercises.map((ex, i) => (
                                          <div key={i} className="flex items-center justify-between">
                                            <span className="text-gray-700">{ex.name}</span>
                                            <span className="text-gray-600 text-xs">
                                              {ex.completed}/{ex.sets} sets
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        )}
                        
                        {/* Regular message content */}
                        <div className={`whitespace-pre-wrap ${message.isError ? 'text-red-600' : 'text-gray-700'}`}>
                          {messageContent.split(/(\*\*.*?\*\*)/g).map((part, index) =>
                            part.startsWith('**') && part.endsWith('**') ? (
                              <strong key={index} className="font-semibold text-[#4A90E2]">{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={index}>{part}</span>
                            )
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-600 p-4"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-[#4A90E2]" />
                  <span>{generateThinkingMessage()}</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area with Image Preview */}
            <div className="border-t border-[#B8D8F8] p-4 bg-white">
              {previewUrl && (
                <AnimatePresence>
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-24 w-auto rounded-lg object-cover shadow-md"
                      />
                      <button
                        onClick={clearSelectedImage}
                        className="absolute -top-2 -right-2 bg-white rounded-full shadow-md hover:bg-[#E8F4FF] transition-colors"
                      >
                        <XCircle className="w-5 h-5 text-[#4A90E2]" />
                      </button>
                    </div>
                    {isAnalyzing && (
                      <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#4A90E2]" />
                        Analyzing image...
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-[#E8F4FF] rounded-lg text-[#4A90E2] hover:bg-[#D1E8FF] transition-colors"
                >
                  <ImagePlus className="w-5 h-5" />
                </button>

                <textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask about workouts or share a form check video..."
                  className="flex-1 p-3 border border-[#B8D8F8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] resize-none h-12"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <motion.button
                  onClick={handleSendMessage}
                  className="p-3 bg-[#4A90E2] rounded-lg text-white shadow-md hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading || (!currentMessage.trim() && !selectedImage)}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="bg-white rounded-lg p-6 max-w-sm w-full"
                >
                  <h3 className="text-lg font-semibold mb-2">Delete Conversation</h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this conversation? This action cannot be undone.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setProfileConversations(prev => {
                          const newConversations = { ...prev };
                          delete newConversations[conversationToDelete];

                          // If we're deleting the active conversation, switch to another one
                          if (conversationToDelete === activeConversationId) {
                            const remainingIds = Object.keys(newConversations);
                            if (remainingIds.length > 0) {
                              setActiveConversationId(remainingIds[0]);
                            } else {
                              createNewConversation();
                            }
                          }

                          return newConversations;
                        });
                        setShowDeleteModal(false);
                        setConversationToDelete(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatAssistant;
```

### src/ProfileCreation.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell,
  Save, 
  AlertCircle, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  UserCircle,
  Camera,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FITNESS_LEVELS = [
  { level: "Beginner", value: "1", description: "Just starting your fitness journey. Learning basic exercises and form." },
  { level: "Novice", value: "2", description: "Familiar with basic exercises. Building consistency in workouts." },
  { level: "Intermediate", value: "3", description: "Regular workout routine. Good form on compound exercises." },
  { level: "Advanced Intermediate", value: "4", description: "Solid strength base. Experienced with various training methods." },
  { level: "Advanced", value: "5", description: "Extensive training experience. Strong technical proficiency." },
  { level: "Semi-Professional", value: "6", description: "Near professional level. Deep understanding of training principles." },
  { level: "Professional Athlete", value: "7", description: "Professional level athlete. Expert in sports performance." }
];

const AVAILABLE_EQUIPMENT = [
  { name: "Dumbbells", icon: "🏋️", category: "Free Weights" },
  { name: "Barbell", icon: "🏋️‍♂️", category: "Free Weights" },
  { name: "Kettlebell", icon: "💪", category: "Free Weights" },
  { name: "Resistance Bands", icon: "🎽", category: "Accessories" },
  { name: "Yoga Mat", icon: "🧘‍♂️", category: "Basics" },
  { name: "Pull-up Bar", icon: "🔝", category: "Bodyweight" },
  { name: "Bench", icon: "💺", category: "Equipment" },
  { name: "Squat Rack", icon: "🏋️‍♀️", category: "Equipment" },
  { name: "Treadmill", icon: "🏃‍♂️", category: "Cardio" },
  { name: "Exercise Bike", icon: "🚲", category: "Cardio" },
  { name: "Rowing Machine", icon: "🚣‍♂️", category: "Cardio" },
  { name: "Jump Rope", icon: "⭕", category: "Cardio" },
  { name: "Foam Roller", icon: "🔄", category: "Recovery" },
  { name: "Medicine Ball", icon: "⚪", category: "Functional" },
  { name: "TRX/Suspension", icon: "🪢", category: "Functional" },
  { name: "Box/Platform", icon: "📦", category: "Plyometrics" }
];

const PHYSICAL_LIMITATIONS = [
  "Lower Back Issues", "Knee Problems", "Shoulder Injury", "Limited Mobility",
  "Joint Pain", "Arthritis", "Recent Surgery", "Cardiovascular Condition",
  "Balance Issues", "Limited Flexibility", "Wrist Problems", "Hip Issues"
];

const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%234A90E2'/%3E%3Cpath d='M20 21C23.3137 21 26 18.3137 26 15C26 11.6863 23.3137 9 20 9C16.6863 9 14 11.6863 14 15C14 18.3137 16.6863 21 20 21ZM20 23C14.4772 23 10 27.4772 10 33H30C30 27.4772 25.5228 23 20 23Z' fill='white'/%3E%3C/svg%3E";

// Image processing utilities
const createThumbnail = (imageUrl, maxWidth = 100, maxHeight = 100) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
  });
};

const ProfileManager = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [imageError, setImageError] = useState("");
  
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    age: "",
    physicalLimitations: [],
    otherLimitations: "",
    fitnessLevel: "",
    equipment: [],
    description: "",
    profileImage: DEFAULT_AVATAR,
    profileThumbnail: DEFAULT_AVATAR
  });

  const [showLevelDescription, setShowLevelDescription] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  // Load saved profiles on mount
  useEffect(() => {
    const savedProfiles = localStorage.getItem('userProfiles');
    const savedActiveId = localStorage.getItem('activeProfileId');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
      if (savedActiveId) {
        setActiveProfileId(savedActiveId);
      }
    }
  }, []);

  // Save profiles whenever they change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('userProfiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  // Save active profile whenever it changes
  useEffect(() => {
    if (activeProfileId) {
      localStorage.setItem('activeProfileId', activeProfileId);
      const activeProfile = profiles.find(p => p.id === activeProfileId);
      if (activeProfile) {
        localStorage.setItem('userProfile', JSON.stringify(activeProfile));
      }
    }
  }, [activeProfileId, profiles]);

  const handleCreateProfile = () => {
    setFormData({
      id: null,
      name: "",
      age: "",
      physicalLimitations: [],
      otherLimitations: "",
      fitnessLevel: "",
      equipment: [],
      description: "",
      profileImage: DEFAULT_AVATAR,
      profileThumbnail: DEFAULT_AVATAR
    });
    setPreviewImage(null);
    setEditingProfile(null);
    setShowProfileForm(true);
  };

  const handleEditProfile = (profile) => {
    setFormData({
      ...profile,
      physicalLimitations: profile.physicalLimitations || [],
      equipment: profile.equipment || []
    });
    setPreviewImage(profile.profileImage);
    setEditingProfile(profile);
    setShowProfileForm(true);
  };

  const handleDeleteProfile = (profile) => {
    setProfileToDelete(profile);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProfile = () => {
    setProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
    if (activeProfileId === profileToDelete.id) {
      setActiveProfileId(null);
      localStorage.removeItem('userProfile');
    }
    setShowDeleteConfirm(false);
    setProfileToDelete(null);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    setImageError("");
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setImageError("Image size should be less than 5MB");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fullImage = e.target.result;
        const thumbnail = await createThumbnail(fullImage);
        
        setFormData(prev => ({
          ...prev,
          profileImage: fullImage,
          profileThumbnail: thumbnail
        }));
        
        setPreviewImage(fullImage);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setImageError("Error processing image");
      console.error("Image processing error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.age || !formData.fitnessLevel) {
      setError("Please fill in all required fields (name, age, and fitness level)");
      return;
    }

    const profileId = formData.id || Date.now().toString();
    const newProfile = { 
      ...formData, 
      id: profileId,
      physicalLimitations: formData.physicalLimitations || [],
      equipment: formData.equipment || []
    };

    setProfiles(prev => {
      const updatedProfiles = editingProfile
        ? prev.map(p => p.id === profileId ? newProfile : p)
        : [...prev, newProfile];
      return updatedProfiles;
    });

    setShowProfileForm(false);
    if (!activeProfileId) {
      setActiveProfileId(profileId);
    }
  };

  const handleSelectProfile = (profileId) => {
    setActiveProfileId(profileId);
  };

  const handleStartChat = () => {
    navigate('/chat');
  };

  const handleLimitationsChange = (limitation) => {
    setFormData(prev => ({
      ...prev,
      physicalLimitations: prev.physicalLimitations && prev.physicalLimitations.includes(limitation)
        ? prev.physicalLimitations.filter(r => r !== limitation)
        : [...(prev.physicalLimitations || []), limitation]
    }));
  };

  const handleEquipmentToggle = (equipment) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment && prev.equipment.includes(equipment)
        ? prev.equipment.filter(a => a !== equipment)
        : [...(prev.equipment || []), equipment]
    }));
  };

  const ProfileImage = ({ src, size = "large", editable = false }) => {
    const sizeClasses = {
      small: "w-10 h-10",
      medium: "w-16 h-16",
      large: "w-24 h-24"
    };

    return (
      <div className="relative inline-block">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-100 border-2 border-[#4A90E2]`}>
          <img
            src={src || DEFAULT_AVATAR}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {editable && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current?.click();
            }}
            className="absolute bottom-0 right-0 p-1.5 bg-[#4A90E2] rounded-full text-white hover:bg-[#357ABD] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FF] to-[#D1E8FF] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profiles List */}
        {!showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#4A90E2] p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-8 h-8" />
                  <h1 className="text-2xl font-bold">Athlete Profiles</h1>
                </div>
                <button
                  onClick={handleCreateProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#4A90E2] rounded-lg hover:bg-[#E8F4FF] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  New Profile
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {profiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No profiles created yet</p>
                  <button
                    onClick={handleCreateProfile}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Create Your First Profile
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className={`p-4 rounded-lg border ${
                        profile.id === activeProfileId
                          ? 'border-[#4A90E2] bg-[#E8F4FF]'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <ProfileImage src={profile.profileThumbnail} size="medium" />
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-gray-800">
                                {profile.name}
                              </h3>
                              {profile.id === activeProfileId && (
                                <span className="px-2 py-1 text-xs bg-[#4A90E2] text-white rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {FITNESS_LEVELS.find(level => level.value === profile.fitnessLevel)?.level} Athlete
                              • Age {profile.age}
                            </p>
                            {profile.physicalLimitations && profile.physicalLimitations.length > 0 && (
                              <p className="text-sm text-gray-500 mt-1">
                                Limitations: {profile.physicalLimitations.join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSelectProfile(profile.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              profile.id === activeProfileId
                                ? 'text-[#4A90E2] bg-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {profile.id === activeProfileId ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => handleEditProfile(profile)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProfile(profile)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeProfileId && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleStartChat}
                    className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Chat with Max
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Form */}
        {showProfileForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-[#4A90E2] p-6 text-white">
              <div className="flex items-center gap-4">
                <Dumbbell className="w-8 h-8" />
                <h1 className="text-2xl font-bold">
                  {editingProfile ? 'Edit Profile' : 'Create New Profile'}
                </h1>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <ProfileImage 
                  src={previewImage || formData.profileImage} 
                  size="large"
                  editable={true}
                />
                
                {imageError && (
                  <p className="text-red-500 text-sm">{imageError}</p>
                )}
                
                <p className="text-sm text-gray-500">
                  Click the camera icon to upload a profile picture
                </p>
              </div>

              {/* Basic Info Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="Enter your age"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </div>

              {/* Fitness Level Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Fitness Experience</h2>
                <div className="relative">
                  <select
                    value={formData.fitnessLevel}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, fitnessLevel: e.target.value }));
                      setSelectedLevel(FITNESS_LEVELS.find(level => level.value === e.target.value));
                      setShowLevelDescription(true);
                    }}
                    onBlur={() => setShowLevelDescription(false)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="">Select your fitness level</option>
                    {FITNESS_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.level}
                      </option>
                    ))}
                  </select>
                  
                  <AnimatePresence>
                    {showLevelDescription && selectedLevel && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-full"
                      >
                        <p className="text-sm text-gray-600">{selectedLevel.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Physical Limitations Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Physical Limitations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {PHYSICAL_LIMITATIONS.map((limitation) => (
                    <motion.div
                      key={limitation}
                      whileTap={{ scale: 0.95 }}
                    >
                      <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={formData.physicalLimitations && formData.physicalLimitations.includes(limitation)}
                          onChange={() => handleLimitationsChange(limitation)}
                          className="w-4 h-4 text-[#4A90E2] border-gray-300 rounded focus:ring-[#4A90E2]"
                        />
                        <span className="ml-2 text-sm">{limitation}</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-700">Other Limitations</label>
                  <input
                    type="text"
                    value={formData.otherLimitations || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherLimitations: e.target.value }))}
                    className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                    placeholder="Enter any other physical limitations..."
                  />
                </div>
              </div>

              {/* Equipment Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Available Equipment</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {AVAILABLE_EQUIPMENT.map((equipment) => (
                    <motion.button
                      key={equipment.name}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEquipmentToggle(equipment.name)}
                      className={`p-4 rounded-lg border ${
                        formData.equipment && formData.equipment.includes(equipment.name)
                          ? 'border-[#4A90E2] bg-[#E8F4FF]'
                          : 'border-gray-200 hover:bg-gray-50'
                      } transition-colors duration-200`}
                    >
                      <div className="text-2xl mb-2">{equipment.icon}</div>
                      <div className="text-sm font-medium">{equipment.name}</div>
                      <div className="text-xs text-gray-500">{equipment.category}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Personal Description Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">About You</h2>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent h-32"
                  placeholder="Tell us about your fitness journey, goals, favorite sports..."
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingProfile ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-lg p-6 max-w-sm w-full"
              >
                <h3 className="text-lg font-semibold mb-2">Delete Profile</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete the profile for {profileToDelete?.name}? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDeleteProfile}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfileManager;
```

### src/WorkoutContext.jsx

```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const WorkoutContext = createContext();

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

// Provider component
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
    
    // Only load workouts if a profile exists
    if (storedProfile) {
      const profileId = JSON.parse(storedProfile).id;
      
      const storedWorkouts = localStorage.getItem(`workouts_${profileId}`);
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
      
      const storedHistory = localStorage.getItem(`workout_history_${profileId}`);
      if (storedHistory) {
        setWorkoutHistory(JSON.parse(storedHistory));
      }
      
      const storedActiveWorkout = localStorage.getItem(`active_workout_${profileId}`);
      if (storedActiveWorkout) {
        setActiveWorkout(JSON.parse(storedActiveWorkout));
      }
    }
  }, []);

  // Listen for profile changes
  useEffect(() => {
    const handleProfileChange = () => {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        setUserProfile(null);
      }
    };

    window.addEventListener('storage', handleProfileChange);
    return () => window.removeEventListener('storage', handleProfileChange);
  }, []);

  // Save workouts when they change
  useEffect(() => {
    if (userProfile && workouts.length > 0) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(workouts));
    }
  }, [workouts, userProfile]);

  // Save workout history when it changes
  useEffect(() => {
    if (userProfile && workoutHistory.length > 0) {
      localStorage.setItem(`workout_history_${userProfile.id}`, JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, userProfile]);

  // Save active workout when it changes
  useEffect(() => {
    if (userProfile) {
      if (activeWorkout) {
        localStorage.setItem(`active_workout_${userProfile.id}`, JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem(`active_workout_${userProfile.id}`);
      }
    }
  }, [activeWorkout, userProfile]);

  // Create a new workout
  const createWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  // Update an existing workout
  const updateWorkout = (id, updatedData) => {
    setWorkouts(prev => 
      prev.map(workout => workout.id === id ? { ...workout, ...updatedData } : workout)
    );
  };

  // Delete a workout
  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  // Start a workout session
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return null;
    
    // Create a copy with additional tracking fields
    const workoutWithTracking = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completed: false,
          actualReps: 0,
          actualWeight: set.weight
        }))
      })),
      startTime: new Date().toISOString(),
      isCompleted: false
    };
    
    setActiveWorkout(workoutWithTracking);
    return workoutWithTracking;
  };

  // Complete a workout session
  const completeWorkout = () => {
    if (!activeWorkout) return;
    
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: (new Date() - new Date(activeWorkout.startTime)) / 1000,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    
    return completedWorkout;
  };

  // Update set data during an active workout
  const updateWorkoutSet = (exerciseIndex, setIndex, data) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      const updatedWorkout = { ...prev };
      const updatedSet = { 
        ...updatedWorkout.exercises[exerciseIndex].sets[setIndex],
        ...data
      };
      
      updatedWorkout.exercises[exerciseIndex].sets[setIndex] = updatedSet;
      return updatedWorkout;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        workoutHistory,
        activeWorkout,
        userProfile,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        startWorkout,
        completeWorkout,
        updateWorkoutSet,
        setActiveWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
```

### src/components/NavigationMenu.jsx

```jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MessageSquare, Dumbbell, UserCircle, Activity } from 'lucide-react';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chat', label: 'Max Chat', icon: MessageSquare },
    { path: '/workout', label: 'Start Training', icon: Dumbbell },
    { path: '/profile', label: 'Athlete Profile', icon: UserCircle },
    { path: '/progress', label: 'Track Progress', icon: Activity },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-[#BEE3F8] text-[#4A90E2] hover:bg-[#E8F4FF]"
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-14 right-0 bg-white rounded-lg shadow-xl border border-[#BEE3F8] overflow-hidden min-w-[200px]"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E8F4FF] transition-colors ${
                      index !== menuItems.length - 1 ? 'border-b border-[#BEE3F8]' : ''
                    } ${isActive ? 'bg-[#E8F4FF] text-[#4A90E2]' : 'text-gray-700'}`}
                    whileHover={{ x: 4 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#4A90E2]' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                    {item.path === '/workout' && (
                      <span className="ml-auto text-xs px-2 py-1 bg-[#4A90E2] text-white rounded-full">
                        New
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavigationMenu;
```

### src/homepage.jsx

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  MessageSquare, 
  ArrowRight, 
  UserCircle, 
  Activity, 
  BarChart2, 
  TrendingUp, 
  Calendar,
  Award
} from 'lucide-react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Dumbbell className="w-20 h-20 text-[#2B6CB0]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Meet Max, Your AI Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI fitness trainer tracking workouts, measuring progress, and helping you achieve your fitness goals
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Chat with Max Card */}
          <Link to="/chat" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Chat with Max</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized advice, form guidance, and expert fitness tips from your AI sports coach.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Chatting</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Workout Tracker Card */}
          <Link to="/workout" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <Dumbbell className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Workout Tracker</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Create and track custom workout routines, log your sets and reps, and monitor your progress over time.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Training</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Progress Analytics Card - NEW */}
          <Link to="/progress" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2B6CB0] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              {/* New badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-[#2B6CB0] text-white text-xs font-bold px-3 py-1 transform rotate-0 translate-x-2 -translate-y-0">
                  NEW
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Activity className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Progress Analytics</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Visualize strength gains, track personal records, and analyze your workout consistency with detailed charts.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">View Analytics</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Profile Creation Card */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Athlete Profile</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Set up your fitness profile with physical capabilities, equipment access, and experience level for workouts tailored to your needs.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Customize Experience</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>
        </div>

        {/* Analytics Showcase Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Track Your Fitness Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our new analytics dashboard helps you visualize progress and identify opportunities for improvement
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#BEE3F8]">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <BarChart2 className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visual Progress</h3>
                <p className="text-gray-600">See how your strength improves over time with intuitive charts and graphs</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <Award className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Personal Records</h3>
                <p className="text-gray-600">Celebrate achievements with automatic personal record tracking for every exercise</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Smart Insights</h3>
                <p className="text-gray-600">Get personalized recommendations based on your training patterns and progress</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/progress" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors shadow-md">
                Explore Analytics
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="mt-24 grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6">
            <Calendar className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Workout Tracking</h3>
            <p className="text-gray-600">Log sets, reps, and weights with our intuitive workout tracker</p>
          </div>
          <div className="p-6">
            <MessageSquare className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Expert Guidance</h3>
            <p className="text-gray-600">Get AI-powered advice from Max, your personal coach</p>
          </div>
          <div className="p-6">
            <Activity className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Progress Analysis</h3>
            <p className="text-gray-600">Track strength gains and identify improvement opportunities</p>
          </div>
          <div className="p-6">
            <UserCircle className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Personalized Plans</h3>
            <p className="text-gray-600">Custom workouts based on your profile and equipment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
```

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import AIChatAssistant from './AIChatAssistant';
import ProfileCreation from './ProfileCreation';
import NavigationMenu from './components/NavigationMenu';
import WorkoutPage from './pages/WorkoutPage';
import ProgressPage from './pages/ProgressPage';
import { WorkoutProvider } from './WorkoutContext';

const App = () => {
  return (
    <BrowserRouter>
      <WorkoutProvider>
        <NavigationMenu />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chat" element={
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <AIChatAssistant />
            </div>
          } />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/profile" element={<ProfileCreation />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </WorkoutProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### src/pages/ProgressPage.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart2,
  Calendar,
  Dumbbell,
  LineChart,
  TrendingUp,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar as CalendarIcon,
  Zap,
  Clock as ClockIcon,
  Target,
  Users,
  AlertTriangle
} from 'lucide-react';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all'); // all, month, week
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [showTimeFilter, setShowTimeFilter] = useState(false);

  // Load user profile and workout history on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);

      const storedHistory = localStorage.getItem(`workout_history_${profile.id}`);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setWorkoutHistory(history);
        processWorkoutData(history);
      }
    }
    setLoading(false);
  }, []);

  // Process workout data to extract analytics
  const processWorkoutData = (history) => {
    if (!history || history.length === 0) return;

    // Extract unique exercises
    const exercises = new Set();
    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    setUniqueExercises(Array.from(exercises));
    
    // If no exercise is selected, select the first one
    if (!selectedExercise && exercises.size > 0) {
      setSelectedExercise(Array.from(exercises)[0]);
    }

    // Calculate muscle group focus
    const muscleGroups = {};
    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const muscleTargets = exercise.muscleGroups || ['Uncategorized'];
        muscleTargets.forEach(muscle => {
          muscleGroups[muscle] = (muscleGroups[muscle] || 0) + 1;
        });
      });
    });

    const muscleGroupArray = Object.entries(muscleGroups).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
    
    setMuscleGroupData(muscleGroupArray);

    // Calculate personal records
    const records = [];
    const exerciseMaxes = {};

    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            const weight = parseFloat(set.actualWeight);
            if (!isNaN(weight) && weight > 0) {
              if (!exerciseMaxes[exercise.name] || weight > exerciseMaxes[exercise.name]) {
                exerciseMaxes[exercise.name] = weight;
                records.push({
                  exercise: exercise.name,
                  weight,
                  date: new Date(workout.startTime).toLocaleDateString(),
                  reps: set.actualReps
                });
              }
            }
          }
        });
      });
    });

    // Keep only the highest weight for each exercise
    const uniqueRecords = Object.values(
      records.reduce((acc, record) => {
        if (!acc[record.exercise] || record.weight > acc[record.exercise].weight) {
          acc[record.exercise] = record;
        }
        return acc;
      }, {})
    ).sort((a, b) => b.weight - a.weight);

    setPersonalRecords(uniqueRecords);

    // Calculate weekly workout frequency
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const fourWeeksAgo = new Date(now.getTime() - (4 * oneWeek));
    
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(fourWeeksAgo.getTime() + (i * oneWeek));
      const weekEnd = new Date(weekStart.getTime() + oneWeek);
      
      const weekWorkouts = history.filter(workout => {
        const workoutDate = new Date(workout.startTime);
        return workoutDate >= weekStart && workoutDate < weekEnd;
      });
      
      weeks.push({
        week: `Week ${i + 1}`,
        count: weekWorkouts.length,
        totalDuration: weekWorkouts.reduce((acc, workout) => acc + workout.duration, 0)
      });
    }
    
    setWeeklyWorkouts(weeks);
  };

  // Filter workout history based on selected time range
  const getFilteredHistory = () => {
    if (timeRange === 'all') return workoutHistory;
    
    const now = new Date();
    let cutoffDate;
    
    if (timeRange === 'month') {
      cutoffDate = new Date(now);
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'week') {
      cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - 7);
    }
    
    return workoutHistory.filter(workout => new Date(workout.startTime) >= cutoffDate);
  };

  // Get exercise progress data for charts
  const getExerciseProgressData = () => {
    if (!selectedExercise) return [];
    
    const filteredHistory = getFilteredHistory();
    const progressData = [];
    
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.name === selectedExercise) {
          // Find the heaviest completed set
          let maxWeight = 0;
          let volume = 0;
          
          exercise.sets.forEach(set => {
            if (set.completed) {
              const weight = parseFloat(set.actualWeight);
              const reps = parseInt(set.actualReps);
              
              if (!isNaN(weight) && !isNaN(reps)) {
                if (weight > maxWeight) maxWeight = weight;
                volume += weight * reps;
              }
            }
          });
          
          if (maxWeight > 0) {
            progressData.push({
              date: new Date(workout.startTime).toLocaleDateString(),
              timestamp: new Date(workout.startTime).getTime(),
              weight: maxWeight,
              volume: volume
            });
          }
        }
      });
    });
    
    // Sort by date
    return progressData.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate workout statistics
  const getWorkoutStats = () => {
    const filteredHistory = getFilteredHistory();
    
    if (filteredHistory.length === 0) {
      return {
        totalWorkouts: 0,
        avgDuration: 0,
        totalDuration: 0,
        completionRate: 0,
        mostFrequentExercise: 'N/A'
      };
    }
    
    const totalWorkouts = filteredHistory.length;
    const totalDuration = filteredHistory.reduce((acc, workout) => acc + workout.duration, 0);
    const avgDuration = totalDuration / totalWorkouts;
    
    // Calculate set completion rate
    let completedSets = 0;
    let totalSets = 0;
    
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          totalSets++;
          if (set.completed) completedSets++;
        });
      });
    });
    
    const completionRate = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
    
    // Find most frequent exercise
    const exerciseCounts = {};
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
      });
    });
    
    let mostFrequentExercise = 'N/A';
    let maxCount = 0;
    
    Object.entries(exerciseCounts).forEach(([exercise, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentExercise = exercise;
      }
    });
    
    return {
      totalWorkouts,
      avgDuration,
      totalDuration,
      completionRate,
      mostFrequentExercise
    };
  };

  // If no user profile exists, show redirect to profile creation
  if (!userProfile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Activity className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h1>
          <p className="text-gray-600 mb-6">
            Before you can track your progress, you need to create an athlete profile. This helps us personalize your analytics.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Create Profile
          </button>
        </motion.div>
      </div>
    );
  }

  // If no workout history, show message to start tracking
  if (workoutHistory.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Workout Data Yet</h1>
          <p className="text-gray-600 mb-6">
            Complete your first workout to start tracking your progress. Your analytics will appear here after you've logged some training sessions.
          </p>
          <button
            onClick={() => navigate('/workout')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Start Tracking Workouts
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A90E2] font-medium">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  // Main stats from workout data
  const stats = getWorkoutStats();
  const exerciseProgressData = getExerciseProgressData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F4FF] p-3 rounded-full">
                <Activity className="w-8 h-8 text-[#4A90E2]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Progress Analytics</h1>
                <p className="text-gray-600">Track your fitness journey, {userProfile?.name}</p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowTimeFilter(!showTimeFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {timeRange === 'all' ? 'All Time' : timeRange === 'month' ? 'Last Month' : 'Last Week'}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showTimeFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  >
                    <button
                      onClick={() => {
                        setTimeRange('all');
                        setShowTimeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      All Time
                    </button>
                    <button
                      onClick={() => {
                        setTimeRange('month');
                        setShowTimeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Last Month
                    </button>
                    <button
                      onClick={() => {
                        setTimeRange('week');
                        setShowTimeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Last Week
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'overview' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'exercises' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('exercises')}
            >
              Exercise Progress
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'records' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('records')}
            >
              Personal Records
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Total Workouts</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.totalWorkouts}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {timeRange === 'all' ? 'All time' : timeRange === 'month' ? 'Last 30 days' : 'Last 7 days'}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Avg. Workout Time</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatTime(stats.avgDuration)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total: {formatTime(stats.totalDuration)}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Completion Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.completionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sets completed vs. planned
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Top Exercise</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800 truncate">
                      {stats.mostFrequentExercise}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Most frequently performed
                    </div>
                  </motion.div>
                </div>

                {/* Weekly Progress Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#4A90E2]" />
                    Weekly Workout Frequency
                  </h2>
                  
                  <div className="h-64 mt-6">
                    {weeklyWorkouts.length > 0 ? (
                      <div className="flex h-full items-end space-x-4">
                        {weeklyWorkouts.map((week, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex justify-center mb-2">
                              <div
                                className="bg-[#4A90E2] rounded-t-lg"
                                style={{
                                  height: `${Math.max(20, (week.count / 7) * 100)}%`,
                                  width: '60%',
                                  minHeight: '20px'
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">{week.week}</div>
                            <div className="text-sm font-semibold">{week.count}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No weekly data available</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Muscle Group Focus */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#4A90E2]" />
                    Muscle Group Focus
                  </h2>
                  
                  {muscleGroupData.length > 0 ? (
                    <div className="space-y-4">
                      {muscleGroupData.slice(0, 5).map((group, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{group.name}</span>
                            <span className="text-gray-600">{group.count} exercises</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-[#4A90E2] h-2.5 rounded-full"
                              style={{ width: `${(group.count / muscleGroupData[0].count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No muscle group data available</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Exercise Progress Tab */}
            {activeTab === 'exercises' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Exercise Selector */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Exercise</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uniqueExercises.map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedExercise(exercise)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedExercise === exercise
                            ? 'bg-[#4A90E2] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {exercise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Weight Progress</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {selectedExercise ? `Tracking max weight for ${selectedExercise}` : 'Select an exercise to see progress'}
                  </p>
                  
                  <div className="h-64">
                    {exerciseProgressData.length > 0 ? (
                      <div className="h-full">
                        {/* Simplified chart visualization */}
                        <div className="flex h-full items-end space-x-2">
                          {exerciseProgressData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                              <div 
                                className="w-full flex justify-center mb-2 relative"
                                style={{ height: '100%' }}
                              >
                                <div
                                  className="bg-[#4A90E2] rounded-t-lg w-4/5"
                                  style={{
                                    height: `${(data.weight / Math.max(...exerciseProgressData.map(d => d.weight))) * 100}%`,
                                    minHeight: '20px'
                                  }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                                  {data.weight} lbs on {data.date}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 truncate w-full text-center">
                                {data.date.split('/').slice(0, 2).join('/')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          {selectedExercise 
                            ? `No progress data available for ${selectedExercise}` 
                            : 'Select an exercise to view progress'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Volume Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Volume Progress</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Total volume (weight × reps) over time
                  </p>
                  
                  <div className="h-64">
                    {exerciseProgressData.length > 0 ? (
                      <div className="h-full">
                        {/* Simplified volume chart visualization */}
                        <div className="flex h-full items-end space-x-2">
                          {exerciseProgressData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                              <div 
                                className="w-full flex justify-center mb-2 relative"
                                style={{ height: '100%' }}
                              >
                                <div
                                  className="bg-green-500 rounded-t-lg w-4/5"
                                  style={{
                                    height: `${(data.volume / Math.max(...exerciseProgressData.map(d => d.volume))) * 100}%`,
                                    minHeight: '20px'
                                  }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                                  Volume: {data.volume} on {data.date}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 truncate w-full text-center">
                                {data.date.split('/').slice(0, 2).join('/')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          {selectedExercise 
                            ? `No volume data available for ${selectedExercise}` 
                            : 'Select an exercise to view volume progress'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#4A90E2]" />
                    Improvement Suggestions
                  </h2>
                  
                  {selectedExercise && exerciseProgressData.length > 0 ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h3 className="text-blue-800 font-medium">Progressive Overload</h3>
                        <p className="text-blue-700 text-sm mt-1">
                          Try increasing weight by 5-10% or adding 1-2 more reps to your {selectedExercise} to keep making progress.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <h3 className="text-green-800 font-medium">Training Frequency</h3>
                        <p className="text-green-700 text-sm mt-1">
                          Consider training {selectedExercise} 2-3 times per week with sufficient recovery for optimal strength gains.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                        <h3 className="text-purple-800 font-medium">Technique Focus</h3>
                        <p className="text-purple-700 text-sm mt-1">
                          As weights increase, ensure your {selectedExercise} form remains strict for safety and effectiveness.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-600">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <p>More data needed for personalized suggestions</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Personal Records Tab */}
            {activeTab === 'records' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#4A90E2]" />
                  Your Personal Records
                </h2>
                
                {personalRecords.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personalRecords.map((record, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 truncate" title={record.exercise}>
                              {record.exercise}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {record.date}
                            </p>
                          </div>
                          <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-sm">
                            PR
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-800">{record.weight}</span>
                          <span className="text-gray-600 mb-0.5">lbs</span>
                          <span className="text-gray-500 text-sm ml-auto">
                            {record.reps} reps
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No personal records yet</p>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Complete more workouts with challenging weights to establish your personal records.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
```

### src/pages/WorkoutPage.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Plus, 
  ChevronDown, 
  Clock, 
  Info, 
  X, 
  CheckCircle, 
  Save,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Calendar,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

// Exercise database with categories
const EXERCISE_DATABASE = {
  "Chest": [
    { name: "Bench Press", equipment: ["Barbell", "Bench"], muscleGroups: ["Chest", "Triceps", "Shoulders"], difficulty: "Intermediate" },
    { name: "Push-ups", equipment: ["Bodyweight"], muscleGroups: ["Chest", "Triceps", "Shoulders"], difficulty: "Beginner" },
    { name: "Dumbbell Flyes", equipment: ["Dumbbells", "Bench"], muscleGroups: ["Chest"], difficulty: "Intermediate" },
    { name: "Chest Dips", equipment: ["Dip Bars"], muscleGroups: ["Chest", "Triceps"], difficulty: "Intermediate" },
    { name: "Cable Crossovers", equipment: ["Cable Machine"], muscleGroups: ["Chest"], difficulty: "Intermediate" }
  ],
  "Back": [
    { name: "Pull-ups", equipment: ["Pull-up Bar"], muscleGroups: ["Back", "Biceps"], difficulty: "Intermediate" },
    { name: "Deadlift", equipment: ["Barbell"], muscleGroups: ["Back", "Hamstrings", "Glutes"], difficulty: "Advanced" },
    { name: "Bent Over Rows", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Back", "Biceps"], difficulty: "Intermediate" },
    { name: "Lat Pulldowns", equipment: ["Cable Machine"], muscleGroups: ["Back", "Biceps"], difficulty: "Beginner" },
    { name: "T-Bar Rows", equipment: ["T-Bar"], muscleGroups: ["Back"], difficulty: "Intermediate" }
  ],
  "Legs": [
    { name: "Squats", equipment: ["Barbell", "Squat Rack"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Intermediate" },
    { name: "Lunges", equipment: ["Bodyweight", "Dumbbells"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Beginner" },
    { name: "Leg Press", equipment: ["Leg Press Machine"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Beginner" },
    { name: "Romanian Deadlift", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Hamstrings", "Glutes", "Lower Back"], difficulty: "Intermediate" },
    { name: "Calf Raises", equipment: ["Machine", "Bodyweight"], muscleGroups: ["Calves"], difficulty: "Beginner" }
  ],
  "Shoulders": [
    { name: "Overhead Press", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Shoulders", "Triceps"], difficulty: "Intermediate" },
    { name: "Lateral Raises", equipment: ["Dumbbells"], muscleGroups: ["Shoulders"], difficulty: "Beginner" },
    { name: "Face Pulls", equipment: ["Cable Machine"], muscleGroups: ["Rear Deltoids", "Upper Back"], difficulty: "Intermediate" },
    { name: "Arnold Press", equipment: ["Dumbbells"], muscleGroups: ["Shoulders"], difficulty: "Intermediate" },
    { name: "Upright Rows", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Shoulders", "Traps"], difficulty: "Intermediate" }
  ],
  "Arms": [
    { name: "Bicep Curls", equipment: ["Dumbbells", "Barbell"], muscleGroups: ["Biceps"], difficulty: "Beginner" },
    { name: "Tricep Dips", equipment: ["Bodyweight", "Dip Bars"], muscleGroups: ["Triceps"], difficulty: "Intermediate" },
    { name: "Skull Crushers", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Triceps"], difficulty: "Intermediate" },
    { name: "Hammer Curls", equipment: ["Dumbbells"], muscleGroups: ["Biceps", "Forearms"], difficulty: "Beginner" },
    { name: "Cable Pushdowns", equipment: ["Cable Machine"], muscleGroups: ["Triceps"], difficulty: "Beginner" }
  ],
  "Core": [
    { name: "Plank", equipment: ["Bodyweight"], muscleGroups: ["Abs", "Core"], difficulty: "Beginner" },
    { name: "Russian Twists", equipment: ["Bodyweight", "Medicine Ball"], muscleGroups: ["Abs", "Obliques"], difficulty: "Beginner" },
    { name: "Hanging Leg Raises", equipment: ["Pull-up Bar"], muscleGroups: ["Abs", "Hip Flexors"], difficulty: "Intermediate" },
    { name: "Cable Crunches", equipment: ["Cable Machine"], muscleGroups: ["Abs"], difficulty: "Intermediate" },
    { name: "Ab Wheel Rollouts", equipment: ["Ab Wheel"], muscleGroups: ["Abs", "Core"], difficulty: "Advanced" }
  ],
  "Cardio": [
    { name: "Running", equipment: ["None", "Treadmill"], muscleGroups: ["Full Body"], difficulty: "Beginner to Advanced" },
    { name: "Cycling", equipment: ["Bicycle", "Exercise Bike"], muscleGroups: ["Legs", "Core"], difficulty: "Beginner to Advanced" },
    { name: "Jump Rope", equipment: ["Jump Rope"], muscleGroups: ["Full Body"], difficulty: "Beginner to Advanced" },
    { name: "High Knees", equipment: ["Bodyweight"], muscleGroups: ["Legs", "Core"], difficulty: "Beginner" },
    { name: "Burpees", equipment: ["Bodyweight"], muscleGroups: ["Full Body"], difficulty: "Intermediate" }
  ]
};

// Demonstration images/gifs would be added in a real implementation
const EXERCISE_DEMOS = {
  "Bench Press": "/path/to/bench-press.gif",
  "Push-ups": "/path/to/pushups.gif",
  // This would be populated with paths to all exercise demonstrations
};

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("my-workouts"); // my-workouts, create, history
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const stopwatchInterval = useRef(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  
  // Add these new state variables:
  const [selectedWorkoutForChat, setSelectedWorkoutForChat] = useState(null);
  const [workoutSelectOpen, setWorkoutSelectOpen] = useState(false);

  // New workout form state
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [],
    description: ""
  });

  // Load user profile and workouts from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }

    const storedWorkouts = localStorage.getItem(`workouts_${JSON.parse(storedProfile)?.id}`);
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }

    const storedHistory = localStorage.getItem(`workout_history_${JSON.parse(storedProfile)?.id}`);
    if (storedHistory) {
      setWorkoutHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save workouts when they change
  useEffect(() => {
    if (userProfile && workouts.length > 0) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(workouts));
    }
  }, [workouts, userProfile]);

  // Save workout history when it changes
  useEffect(() => {
    if (userProfile && workoutHistory.length > 0) {
      localStorage.setItem(`workout_history_${userProfile.id}`, JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, userProfile]);

  // Stopwatch functionality
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchInterval.current);
    }

    return () => clearInterval(stopwatchInterval.current);
  }, [stopwatchRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format workout data to a readable string for Max
  const formatWorkoutForAI = (workout) => {
    if (!workout) return "";
    
    const startDate = new Date(workout.startTime);
    let formattedData = `Workout: ${workout.name}\n`;
    formattedData += `Date: ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
    formattedData += `Duration: ${formatTime(workout.duration)}\n\n`;
    
    workout.exercises.forEach((exercise, index) => {
      const completedSets = exercise.sets.filter(set => set.completed).length;
      formattedData += `Exercise ${index + 1}: ${exercise.name} (${completedSets}/${exercise.sets.length} sets completed)\n`;
      
      exercise.sets.forEach((set, setIndex) => {
        const setType = set.type !== 'normal' ? ` (${set.type})` : '';
        if (set.completed) {
          formattedData += `  Set ${setIndex + 1}${setType}: ${set.actualWeight}lbs × ${set.actualReps} reps\n`;
        } else {
          formattedData += `  Set ${setIndex + 1}${setType}: ${set.weight}lbs × ${set.reps} reps (not completed)\n`;
        }
      });
      formattedData += '\n';
    });
    
    return formattedData;
  };

  const handleStartWorkout = (workout) => {
    // Create a copy with additional tracking fields
    const workoutWithTracking = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completed: false,
          actualReps: 0,
          actualWeight: set.weight
        }))
      })),
      startTime: new Date().toISOString(),
      isCompleted: false
    };
    
    setActiveWorkout(workoutWithTracking);
    setCurrentTab("active");
    setStopwatchRunning(true);
    setElapsedTime(0);
  };

  const handleCompleteWorkout = () => {
    // Create a history entry
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: elapsedTime,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    setStopwatchRunning(false);
    setCurrentTab("my-workouts");
  };

  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? Progress will not be saved.")) {
      setActiveWorkout(null);
      setStopwatchRunning(false);
      setCurrentTab("my-workouts");
    }
  };

  const handleSetCompleted = (exerciseIndex, setIndex, completed, actualReps, actualWeight) => {
    setActiveWorkout(prev => {
      const newWorkout = { ...prev };
      newWorkout.exercises[exerciseIndex].sets[setIndex].completed = completed;
      newWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = actualReps;
      newWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = actualWeight;
      return newWorkout;
    });
  };

  const handleAddExercise = (exercise) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: exercise.name,
        sets: [{ reps: 10, weight: 0, type: 'normal' }],
        notes: "",
        equipment: exercise.equipment,
        muscleGroups: exercise.muscleGroups
      }]
    }));
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (index) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleAddSet = (exerciseIndex) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
      newExercises[exerciseIndex].sets.push({
        reps: lastSet.reps,
        weight: lastSet.weight,
        type: lastSet.type
      });
      return { ...prev, exercises: newExercises };
    });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      if (newExercises[exerciseIndex].sets.length > 1) {
        newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
      }
      return { ...prev, exercises: newExercises };
    });
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      newExercises[exerciseIndex].sets[setIndex][field] = value;
      return { ...prev, exercises: newExercises };
    });
  };

  const handleSaveWorkout = () => {
    if (!newWorkout.name.trim()) {
      alert("Please give your workout a name");
      return;
    }
  
    if (newWorkout.exercises.length === 0) {
      alert("Please add at least one exercise to your workout");
      return;
    }
  
    const workoutToSave = {
      ...newWorkout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  
    // First update state
    const updatedWorkouts = [...workouts, workoutToSave];
    setWorkouts(updatedWorkouts);
    
    // Save to localStorage immediately to avoid race conditions
    if (userProfile) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(updatedWorkouts));
    }
    
    // Reset form and switch tabs
    setNewWorkout({
      name: "",
      exercises: [],
      description: ""
    });
    setCurrentTab("my-workouts");
  };

  const handleDeleteWorkout = (workoutId) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    }
  };

  // Modified handleChatWithMax function to include workout data
  const handleChatWithMax = () => {
    // For quick messages, we'll create a function to immediately start a new chat with the message
    if (quickMessage.trim() || selectedWorkoutForChat) {
      // Get existing conversations
      const profileId = userProfile?.id;
      if (!profileId) {
        navigate('/profile');
        return;
      }

      const profileChats = localStorage.getItem(`profile_${profileId}_conversations`);
      let conversations = {};
      if (profileChats) {
        conversations = JSON.parse(profileChats);
      }

      // Create a new conversation with the workout-related question
      const newId = `conv-${Date.now()}`;
      const welcomeMessage = `**Hey ${userProfile?.name}!** Ready to crush your fitness goals? What can I help you with today?`;

      // Format the workout message
      let workoutInfo = "";
      let userMessageContent = quickMessage.trim();
      
      if (selectedWorkoutForChat) {
        // Full workout details for the AI
        workoutInfo = formatWorkoutForAI(selectedWorkoutForChat);
        
        // Special format for the UI to allow collapsing
        userMessageContent = JSON.stringify({
          text: quickMessage.trim(),
          workoutData: {
            id: selectedWorkoutForChat.id || Date.now().toString(),
            name: selectedWorkoutForChat.name,
            date: new Date(selectedWorkoutForChat.startTime).toLocaleDateString(),
            time: new Date(selectedWorkoutForChat.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            duration: formatTime(selectedWorkoutForChat.duration),
            exercises: selectedWorkoutForChat.exercises.map(ex => ({
              name: ex.name,
              sets: ex.sets.length,
              completed: ex.sets.filter(set => set.completed).length
            }))
          }
        });
      }

      const newConversation = {
        id: newId,
        title: 'Workout Question',
        messages: [
          {
            id: 'welcome',
            type: 'ai',
            content: welcomeMessage
          },
          {
            id: Date.now(),
            type: 'user',
            content: userMessageContent,
            workoutShared: !!selectedWorkoutForChat // Flag to identify messages with workouts
          }
        ],
        createdAt: Date.now(),
        lastUpdated: Date.now()
      };

      conversations[newId] = newConversation;
      localStorage.setItem(`profile_${profileId}_conversations`, JSON.stringify(conversations));
      localStorage.setItem(`profile_${profileId}_activeConversation`, newId);
      
      // Also send the workout info as context to the AI
      if (selectedWorkoutForChat) {
        localStorage.setItem(`workout_context_${newId}`, workoutInfo);
      }
      
      // Navigate to chat
      navigate('/chat');
    } else {
      navigate('/chat');
    }
  };

  // If no profile exists, show redirect to profile creation
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Dumbbell className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h1>
          <p className="text-gray-600 mb-6">
            Before you can track your workouts, you need to create an athlete profile. This helps Max personalize your experience.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Create Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F4FF] p-3 rounded-full">
                <Dumbbell className="w-8 h-8 text-[#4A90E2]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Workout Tracker</h1>
                <p className="text-gray-600">Hey {userProfile?.name}, let's crush your fitness goals!</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowChatModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Ask Max
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentTab === "my-workouts" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentTab("my-workouts")}
            >
              My Workouts
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentTab === "create" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentTab("create")}
            >
              Create Workout
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentTab === "history" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentTab("history")}
            >
              History
            </button>
            {activeWorkout && (
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  currentTab === "active" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-red-500 hover:bg-red-50"
                }`}
                onClick={() => setCurrentTab("active")}
              >
                Active Workout
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* My Workouts Tab */}
            {currentTab === "my-workouts" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Your Workout Plans</h2>
                  <button
                    onClick={() => setCurrentTab("create")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Workout
                  </button>
                </div>

                {workouts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">You haven't created any workout plans yet.</p>
                    <button
                      onClick={() => setCurrentTab("create")}
                      className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                    >
                      Create Your First Workout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workouts.map(workout => (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 border-b border-gray-100">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleDeleteWorkout(workout.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </p>
                          {workout.description && (
                            <p className="text-gray-500 text-sm mt-2">{workout.description}</p>
                          )}
                        </div>
                        
                        <div className="p-4 bg-gray-50">
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {workout.exercises.slice(0, 3).map((exercise, index) => (
                                <li key={index}>{exercise.name} ({exercise.sets.length} sets)</li>
                              ))}
                              {workout.exercises.length > 3 && (
                                <li className="text-gray-500">+{workout.exercises.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                          
                          <button
                            onClick={() => handleStartWorkout(workout)}
                            className="w-full mt-2 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center justify-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Start Workout
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Create Workout Tab */}
            {currentTab === "create" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Create New Workout</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name</label>
                    <input
                      type="text"
                      value={newWorkout.name}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="My Awesome Workout"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={newWorkout.description}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="Notes about this workout..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Exercises</label>
                      <button
                        onClick={() => setShowExerciseModal(true)}
                        className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Exercise
                      </button>
                    </div>

                    {newWorkout.exercises.length === 0 ? (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setShowExerciseModal(true)}
                      >
                        <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No exercises added yet</p>
                        <p className="text-sm text-gray-500">Click to add exercises to your workout</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {newWorkout.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                              <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                              <button 
                                onClick={() => handleRemoveExercise(exerciseIndex)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-4">
                              <div className="mb-4">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-left text-gray-600">
                                      <th className="pb-2">Set</th>
                                      <th className="pb-2">Weight</th>
                                      <th className="pb-2">Reps</th>
                                      <th className="pb-2">Type</th>
                                      <th className="pb-2"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exercise.sets.map((set, setIndex) => (
                                      <tr key={setIndex}>
                                        <td className="py-2">{setIndex + 1}</td>
                                        <td className="py-2">
                                          <input
                                            type="number"
                                            min="0"
                                            value={set.weight}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                            className="w-16 p-2 border border-gray-300 rounded"
                                          />
                                        </td>
                                        <td className="py-2">
                                          <input
                                            type="number"
                                            min="1"
                                            value={set.reps}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                            className="w-16 p-2 border border-gray-300 rounded"
                                          />
                                        </td>
                                        <td className="py-2">
                                          <select
                                            value={set.type}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'type', e.target.value)}
                                            className="p-2 border border-gray-300 rounded"
                                          >
                                            <option value="normal">Normal</option>
                                            <option value="warm-up">Warm-up</option>
                                            <option value="drop">Drop Set</option>
                                          </select>
                                        </td>
                                        <td className="py-2">
                                          <button
                                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            disabled={exercise.sets.length <= 1}
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleAddSet(exerciseIndex)}
                                  className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Set
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setNewWorkout({
                          name: "",
                          exercises: [],
                          description: ""
                        });
                        setCurrentTab("my-workouts");
                      }}
                      className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWorkout}
                      className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newWorkout.name || newWorkout.exercises.length === 0}
                    >
                      <Save className="w-5 h-5" />
                      Save Workout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* History Tab */}
            {currentTab === "history" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Workout History</h2>
                </div>

                {workoutHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't completed any workouts yet.</p>
                    {workouts.length > 0 && (
                      <button
                        onClick={() => setCurrentTab("my-workouts")}
                        className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                      >
                        Start a Workout
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workoutHistory.map((workout, index) => {
                      const startDate = new Date(workout.startTime);
                      const endDate = new Date(workout.endTime);
                      return (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                              <p className="text-sm text-gray-600">
                                {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 bg-[#E8F4FF] px-3 py-1 rounded-full">
                              <Clock className="w-4 h-4 text-[#4A90E2]" />
                              <span className="text-sm font-medium text-[#4A90E2]">
                                {formatTime(workout.duration)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {workout.exercises.map((exercise, exerciseIndex) => {
                              const completedSets = exercise.sets.filter(set => set.completed).length;
                              return (
                                <div key={exerciseIndex} className="border-t border-gray-100 pt-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-800">{exercise.name}</span>
                                    <span className="text-sm text-gray-600">
                                      {completedSets}/{exercise.sets.length} sets completed
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-4 gap-2 text-sm">
                                    {exercise.sets.map((set, setIndex) => (
                                      <div 
                                        key={setIndex} 
                                        className={`p-2 rounded text-center ${
                                          set.completed 
                                            ? 'bg-green-50 text-green-700' 
                                            : 'bg-gray-50 text-gray-500'
                                        }`}
                                      >
                                        {set.completed ? set.actualWeight : set.weight}lbs × {set.completed ? set.actualReps : set.reps}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Active Workout Tab */}
            {currentTab === "active" && activeWorkout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{activeWorkout.name}</h2>
                    <p className="text-sm text-gray-600">Workout in progress</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#E8F4FF] px-4 py-2 rounded-lg">
                      <Clock className="w-5 h-5 text-[#4A90E2]" />
                      <span className="font-mono font-medium text-[#4A90E2]">
                        {formatTime(elapsedTime)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setStopwatchRunning(!stopwatchRunning)}
                      className={`p-2 rounded-full ${
                        stopwatchRunning 
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      } transition-colors`}
                    >
                      {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {activeWorkout.exercises.map((exercise, exerciseIndex) => {
                    const completedSets = exercise.sets.filter(set => set.completed).length;
                    return (
                      <div key={exerciseIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {completedSets}/{exercise.sets.length} sets completed
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-600">
                                <th className="pb-3">Set</th>
                                <th className="pb-3">Weight (lbs)</th>
                                <th className="pb-3">Reps</th>
                                <th className="pb-3">Actual</th>
                                <th className="pb-3"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((set, setIndex) => (
                                <tr key={setIndex} className={set.completed ? 'bg-green-50' : ''}>
                                  <td className="py-3">{setIndex + 1} {set.type !== 'normal' && `(${set.type})`}</td>
                                  <td className="py-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={set.actualWeight}
                                      onChange={(e) => {
                                        const newActiveWorkout = { ...activeWorkout };
                                        newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = e.target.value;
                                        setActiveWorkout(newActiveWorkout);
                                      }}
                                      className={`w-20 p-2 border rounded ${
                                        set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                      }`}
                                      disabled={set.completed}
                                    />
                                  </td>
                                  <td className="py-3">{set.reps}</td>
                                  <td className="py-3">
                                    <input
                                      type="number"
                                      min="0"
                                      max={99}
                                      value={set.actualReps || ''}
                                      onChange={(e) => {
                                        const newActiveWorkout = { ...activeWorkout };
                                        newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = e.target.value;
                                        setActiveWorkout(newActiveWorkout);
                                      }}
                                      className={`w-20 p-2 border rounded ${
                                        set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                      }`}
                                      placeholder={set.reps}
                                      disabled={set.completed}
                                    />
                                  </td>
                                  <td className="py-3">
                                    {set.completed ? (
                                      <button
                                        onClick={() => handleSetCompleted(exerciseIndex, setIndex, false, 0, set.weight)}
                                        className="p-2 text-green-600 hover:text-green-700 transition-colors"
                                      >
                                        <RotateCcw className="w-5 h-5" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleSetCompleted(exerciseIndex, setIndex, true, set.actualReps || set.reps, set.actualWeight)}
                                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                      >
                                        <CheckCircle className="w-5 h-5" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleCancelWorkout}
                    className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Cancel Workout
                  </button>
                  <button
                    onClick={handleCompleteWorkout}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Workout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      <AnimatePresence>
        {showExerciseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(EXERCISE_DATABASE).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        category === selectedCategory
                          ? 'bg-[#4A90E2] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {selectedCategory ? (
                    EXERCISE_DATABASE[selectedCategory].map((exercise, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAddExercise(exercise)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Target: {exercise.muscleGroups.join(', ')}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {exercise.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-[#E8F4FF] text-[#4A90E2] rounded-full">
                            {exercise.equipment.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Select a muscle group to view exercises</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Chat Modal - Updated Version */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-[#4A90E2]" />
                  <h3 className="text-xl font-semibold text-gray-800">Ask Max</h3>
                </div>
                
                {/* Workout Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share a workout (optional):
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setWorkoutSelectOpen(!workoutSelectOpen)}
                      className="w-full p-3 text-left border border-gray-300 rounded-lg flex justify-between items-center hover:border-[#4A90E2] transition-colors"
                    >
                      <span className="text-gray-700">
                        {selectedWorkoutForChat ? selectedWorkoutForChat.name : 'Select a workout'}
                      </span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {/* Workout Dropdown */}
                    <AnimatePresence>
                      {workoutSelectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          <div className="p-2">
                            <button
                              className="w-full p-2 text-left hover:bg-gray-50 rounded-md text-gray-500 text-sm"
                              onClick={() => {
                                setSelectedWorkoutForChat(null);
                                setWorkoutSelectOpen(false);
                              }}
                            >
                              No workout
                            </button>
                            
                            {/* Active Workout Option */}
                            {activeWorkout && (
                              <button
                                className="w-full p-2 text-left hover:bg-gray-50 rounded-md flex items-center justify-between"
                                onClick={() => {
                                  setSelectedWorkoutForChat(activeWorkout);
                                  setWorkoutSelectOpen(false);
                                }}
                              >
                                <div>
                                  <div className="font-medium text-gray-800">{activeWorkout.name}</div>
                                  <div className="text-xs text-green-600">Current Workout</div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatTime(elapsedTime)}
                                </div>
                              </button>
                            )}
                            
                            {/* History Options */}
                            <div className="text-xs text-gray-500 mt-2 mb-1 px-2">History</div>
                            {workoutHistory.length === 0 ? (
                              <div className="text-sm text-gray-500 p-2">No workout history</div>
                            ) : (
                              workoutHistory.map((workout, index) => {
                                const startDate = new Date(workout.startTime);
                                return (
                                  <button
                                    key={index}
                                    className="w-full p-2 text-left hover:bg-gray-50 rounded-md flex items-center justify-between"
                                    onClick={() => {
                                      setSelectedWorkoutForChat(workout);
                                      setWorkoutSelectOpen(false);
                                    }}
                                  >
                                    <div>
                                      <div className="font-medium text-gray-800">{workout.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatTime(workout.duration)}
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Preview Selected Workout */}
                  <AnimatePresence>
                    {selectedWorkoutForChat && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                          <div className="font-medium text-gray-800">{selectedWorkoutForChat.name}</div>
                          <button
                            onClick={() => setSelectedWorkoutForChat(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3 text-sm">
                          <div className="text-gray-500 flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(selectedWorkoutForChat.duration)}</span>
                          </div>
                          <div className="space-y-1">
                            {selectedWorkoutForChat.exercises.map((exercise, i) => {
                              const completedSets = exercise.sets.filter(set => set.completed).length;
                              return (
                                <div key={i} className="text-gray-700">
                                  {exercise.name} ({completedSets}/{exercise.sets.length} sets)
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <textarea
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent h-32"
                  placeholder={selectedWorkoutForChat 
                    ? "Ask about this workout..." 
                    : "Ask a question about your workout or fitness journey..."}
                />
                
                <div className="mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Quick questions Max can help with:
                  </span>
                  <ul className="ml-6 mt-2 list-disc space-y-1">
                    <li>How can I improve my {selectedWorkoutForChat ? selectedWorkoutForChat.name : "workout"} routine?</li>
                    <li>What's the right form for {selectedWorkoutForChat && selectedWorkoutForChat.exercises.length > 0 
                      ? selectedWorkoutForChat.exercises[0].name 
                      : "bench press"}?</li>
                    <li>How can I progress with this routine?</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedWorkoutForChat(null);
                    setQuickMessage("");
                  }}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleChatWithMax();
                    setShowChatModal(false);
                    setSelectedWorkoutForChat(null);
                    setQuickMessage("");
                  }}
                  className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  disabled={!quickMessage.trim() && !selectedWorkoutForChat}
                >
                  Chat with Max
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPage;
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          serif: ['Playfair Display', 'serif'],
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
```

### vite.config.js

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.netlify\/functions/, '')
      }
    }
  }
});

```

```

### src/WorkoutContext.jsx

```jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const WorkoutContext = createContext();

// Custom hook to use the workout context
export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};

// Provider component
export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
    
    // Only load workouts if a profile exists
    if (storedProfile) {
      const profileId = JSON.parse(storedProfile).id;
      
      const storedWorkouts = localStorage.getItem(`workouts_${profileId}`);
      if (storedWorkouts) {
        setWorkouts(JSON.parse(storedWorkouts));
      }
      
      const storedHistory = localStorage.getItem(`workout_history_${profileId}`);
      if (storedHistory) {
        setWorkoutHistory(JSON.parse(storedHistory));
      }
      
      const storedActiveWorkout = localStorage.getItem(`active_workout_${profileId}`);
      if (storedActiveWorkout) {
        setActiveWorkout(JSON.parse(storedActiveWorkout));
      }
    }
  }, []);

  // Listen for profile changes
  useEffect(() => {
    const handleProfileChange = () => {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      } else {
        setUserProfile(null);
      }
    };

    window.addEventListener('storage', handleProfileChange);
    return () => window.removeEventListener('storage', handleProfileChange);
  }, []);

  // Save workouts when they change
  useEffect(() => {
    if (userProfile && workouts.length > 0) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(workouts));
    }
  }, [workouts, userProfile]);

  // Save workout history when it changes
  useEffect(() => {
    if (userProfile && workoutHistory.length > 0) {
      localStorage.setItem(`workout_history_${userProfile.id}`, JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, userProfile]);

  // Save active workout when it changes
  useEffect(() => {
    if (userProfile) {
      if (activeWorkout) {
        localStorage.setItem(`active_workout_${userProfile.id}`, JSON.stringify(activeWorkout));
      } else {
        localStorage.removeItem(`active_workout_${userProfile.id}`);
      }
    }
  }, [activeWorkout, userProfile]);

  // Create a new workout
  const createWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  // Update an existing workout
  const updateWorkout = (id, updatedData) => {
    setWorkouts(prev => 
      prev.map(workout => workout.id === id ? { ...workout, ...updatedData } : workout)
    );
  };

  // Delete a workout
  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  // Start a workout session
  const startWorkout = (workoutId) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return null;
    
    // Create a copy with additional tracking fields
    const workoutWithTracking = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completed: false,
          actualReps: 0,
          actualWeight: set.weight
        }))
      })),
      startTime: new Date().toISOString(),
      isCompleted: false
    };
    
    setActiveWorkout(workoutWithTracking);
    return workoutWithTracking;
  };

  // Complete a workout session
  const completeWorkout = () => {
    if (!activeWorkout) return;
    
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: (new Date() - new Date(activeWorkout.startTime)) / 1000,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    
    return completedWorkout;
  };

  // Update set data during an active workout
  const updateWorkoutSet = (exerciseIndex, setIndex, data) => {
    if (!activeWorkout) return;
    
    setActiveWorkout(prev => {
      const updatedWorkout = { ...prev };
      const updatedSet = { 
        ...updatedWorkout.exercises[exerciseIndex].sets[setIndex],
        ...data
      };
      
      updatedWorkout.exercises[exerciseIndex].sets[setIndex] = updatedSet;
      return updatedWorkout;
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        workoutHistory,
        activeWorkout,
        userProfile,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        startWorkout,
        completeWorkout,
        updateWorkoutSet,
        setActiveWorkout
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
```

### src/components/MobileAppInstallBanner.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronRight } from 'lucide-react';

const MobileAppInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  useEffect(() => {
    // Check if user is on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Check if the app is already installed (in standalone mode or PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone || 
                         document.referrer.includes('android-app://');
    
    // Only show banner if on mobile and not already installed
    if (isMobile && !isStandalone) {
      // Wait a few seconds before showing the banner
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    // Listen for beforeinstallprompt event to capture the deferred prompt
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the banner
      setShowBanner(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // Handle the install action
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      // We've used the prompt, and can't use it again, discard it
      setDeferredPrompt(null);
      
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
    } else {
      // Fallback for browsers that don't support beforeinstallprompt
      setShowBanner(false);
      // If iOS, show a hint how to add to home screen
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isIOS) {
        alert("To install this app on your iOS device: tap the share icon, then 'Add to Home Screen'");
      }
    }
  };
  
  if (!showBanner) return null;
  
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl z-50"
      >
        <div className="p-4 flex items-center">
          <div className="mr-4">
            <div className="bg-[#4A90E2] text-white p-2 rounded-full">
              <Download className="w-6 h-6" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">Install Max AI Coach</h3>
            <p className="text-sm text-gray-600">Add to home screen for the best experience</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowBanner(false)} 
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            
            <button 
              onClick={handleInstallClick}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg flex items-center gap-1"
            >
              Install <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileAppInstallBanner;
```

### src/components/NavigationMenu.jsx

```jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, MessageSquare, Dumbbell, UserCircle, Activity } from 'lucide-react';

const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chat', label: 'Max Chat', icon: MessageSquare },
    { path: '/workout', label: 'Start Training', icon: Dumbbell },
    { path: '/profile', label: 'Athlete Profile', icon: UserCircle },
    { path: '/progress', label: 'Track Progress', icon: Activity },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-[#BEE3F8] text-[#4A90E2] hover:bg-[#E8F4FF]"
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </motion.button>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="absolute top-14 right-0 bg-white rounded-lg shadow-xl border border-[#BEE3F8] overflow-hidden min-w-[200px]"
            >
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#E8F4FF] transition-colors ${
                      index !== menuItems.length - 1 ? 'border-b border-[#BEE3F8]' : ''
                    } ${isActive ? 'bg-[#E8F4FF] text-[#4A90E2]' : 'text-gray-700'}`}
                    whileHover={{ x: 4 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#4A90E2]' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                    {item.path === '/workout' && (
                      <span className="ml-auto text-xs px-2 py-1 bg-[#4A90E2] text-white rounded-full">
                        New
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavigationMenu;
```

### src/homepage.jsx

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  MessageSquare, 
  ArrowRight, 
  UserCircle, 
  Activity, 
  BarChart2, 
  TrendingUp, 
  Calendar,
  Award
} from 'lucide-react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16 pb-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Dumbbell className="w-20 h-20 text-[#2B6CB0]" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
            Meet Max, Your AI Coach
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI fitness trainer tracking workouts, measuring progress, and helping you achieve your fitness goals
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Chat with Max Card */}
          <Link to="/chat" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <MessageSquare className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Chat with Max</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Get personalized advice, form guidance, and expert fitness tips from your AI sports coach.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Chatting</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Workout Tracker Card */}
          <Link to="/workout" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <Dumbbell className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Workout Tracker</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Create and track custom workout routines, log your sets and reps, and monitor your progress over time.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Start Training</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Progress Analytics Card - NEW */}
          <Link to="/progress" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#2B6CB0] hover:border-[#2B6CB0] h-full relative overflow-hidden">
              {/* New badge */}
              <div className="absolute top-0 right-0">
                <div className="bg-[#2B6CB0] text-white text-xs font-bold px-3 py-1 transform rotate-0 translate-x-2 -translate-y-0">
                  NEW
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <Activity className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Progress Analytics</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Visualize strength gains, track personal records, and analyze your workout consistency with detailed charts.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">View Analytics</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>

          {/* Profile Creation Card */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#BEE3F8] hover:border-[#2B6CB0] h-full">
              <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-8 h-8 text-[#2B6CB0]" />
                <h2 className="text-2xl font-semibold text-gray-800">Athlete Profile</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Set up your fitness profile with physical capabilities, equipment access, and experience level for workouts tailored to your needs.
              </p>
              <div className="flex items-center text-[#2B6CB0] group-hover:translate-x-2 transition-transform">
                <span className="font-medium">Customize Experience</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </Link>
        </div>

        {/* Analytics Showcase Section */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Track Your Fitness Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our new analytics dashboard helps you visualize progress and identify opportunities for improvement
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#BEE3F8]">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <BarChart2 className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Visual Progress</h3>
                <p className="text-gray-600">See how your strength improves over time with intuitive charts and graphs</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-amber-100 p-4 rounded-full mb-4">
                  <Award className="w-10 h-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Personal Records</h3>
                <p className="text-gray-600">Celebrate achievements with automatic personal record tracking for every exercise</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-4 rounded-full mb-4">
                  <TrendingUp className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Smart Insights</h3>
                <p className="text-gray-600">Get personalized recommendations based on your training patterns and progress</p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/progress" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors shadow-md">
                Explore Analytics
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Feature Highlights */}
        <div className="mt-24 grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6">
            <Calendar className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Workout Tracking</h3>
            <p className="text-gray-600">Log sets, reps, and weights with our intuitive workout tracker</p>
          </div>
          <div className="p-6">
            <MessageSquare className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Expert Guidance</h3>
            <p className="text-gray-600">Get AI-powered advice from Max, your personal coach</p>
          </div>
          <div className="p-6">
            <Activity className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Progress Analysis</h3>
            <p className="text-gray-600">Track strength gains and identify improvement opportunities</p>
          </div>
          <div className="p-6">
            <UserCircle className="w-8 h-8 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Personalized Plans</h3>
            <p className="text-gray-600">Custom workouts based on your profile and equipment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
```

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './homepage';
import AIChatAssistant from './AIChatAssistant';
import ProfileCreation from './ProfileCreation';
import NavigationMenu from './components/NavigationMenu';
import WorkoutPage from './pages/WorkoutPage';
import ProgressPage from './pages/ProgressPage';
import { WorkoutProvider } from './WorkoutContext';

const App = () => {
  return (
    <BrowserRouter>
      <WorkoutProvider>
        <NavigationMenu />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chat" element={
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <AIChatAssistant />
            </div>
          } />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/profile" element={<ProfileCreation />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </WorkoutProvider>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### src/pages/ProgressPage.jsx

```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  BarChart2,
  Calendar,
  Dumbbell,
  LineChart,
  TrendingUp,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Filter,
  Calendar as CalendarIcon,
  Zap,
  Clock as ClockIcon,
  Target,
  Users,
  AlertTriangle
} from 'lucide-react';

const ProgressPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('all'); // all, month, week
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [muscleGroupData, setMuscleGroupData] = useState([]);
  const [personalRecords, setPersonalRecords] = useState([]);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([]);
  const [showTimeFilter, setShowTimeFilter] = useState(false);

  // Load user profile and workout history on component mount
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);

      const storedHistory = localStorage.getItem(`workout_history_${profile.id}`);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        setWorkoutHistory(history);
        processWorkoutData(history);
      }
    }
    setLoading(false);
  }, []);

  // Process workout data to extract analytics
  const processWorkoutData = (history) => {
    if (!history || history.length === 0) return;

    // Extract unique exercises
    const exercises = new Set();
    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercises.add(exercise.name);
      });
    });
    setUniqueExercises(Array.from(exercises));
    
    // If no exercise is selected, select the first one
    if (!selectedExercise && exercises.size > 0) {
      setSelectedExercise(Array.from(exercises)[0]);
    }

    // Calculate muscle group focus
    const muscleGroups = {};
    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        const muscleTargets = exercise.muscleGroups || ['Uncategorized'];
        muscleTargets.forEach(muscle => {
          muscleGroups[muscle] = (muscleGroups[muscle] || 0) + 1;
        });
      });
    });

    const muscleGroupArray = Object.entries(muscleGroups).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);
    
    setMuscleGroupData(muscleGroupArray);

    // Calculate personal records
    const records = [];
    const exerciseMaxes = {};

    history.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            const weight = parseFloat(set.actualWeight);
            if (!isNaN(weight) && weight > 0) {
              if (!exerciseMaxes[exercise.name] || weight > exerciseMaxes[exercise.name]) {
                exerciseMaxes[exercise.name] = weight;
                records.push({
                  exercise: exercise.name,
                  weight,
                  date: new Date(workout.startTime).toLocaleDateString(),
                  reps: set.actualReps
                });
              }
            }
          }
        });
      });
    });

    // Keep only the highest weight for each exercise
    const uniqueRecords = Object.values(
      records.reduce((acc, record) => {
        if (!acc[record.exercise] || record.weight > acc[record.exercise].weight) {
          acc[record.exercise] = record;
        }
        return acc;
      }, {})
    ).sort((a, b) => b.weight - a.weight);

    setPersonalRecords(uniqueRecords);

    // Calculate weekly workout frequency
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const fourWeeksAgo = new Date(now.getTime() - (4 * oneWeek));
    
    const weeks = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(fourWeeksAgo.getTime() + (i * oneWeek));
      const weekEnd = new Date(weekStart.getTime() + oneWeek);
      
      const weekWorkouts = history.filter(workout => {
        const workoutDate = new Date(workout.startTime);
        return workoutDate >= weekStart && workoutDate < weekEnd;
      });
      
      weeks.push({
        week: `Week ${i + 1}`,
        count: weekWorkouts.length,
        totalDuration: weekWorkouts.reduce((acc, workout) => acc + workout.duration, 0)
      });
    }
    
    setWeeklyWorkouts(weeks);
  };

  // Filter workout history based on selected time range
  const getFilteredHistory = () => {
    if (timeRange === 'all') return workoutHistory;
    
    const now = new Date();
    let cutoffDate;
    
    if (timeRange === 'month') {
      cutoffDate = new Date(now);
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeRange === 'week') {
      cutoffDate = new Date(now);
      cutoffDate.setDate(now.getDate() - 7);
    }
    
    return workoutHistory.filter(workout => new Date(workout.startTime) >= cutoffDate);
  };

  // Get exercise progress data for charts
  const getExerciseProgressData = () => {
    if (!selectedExercise) return [];
    
    const filteredHistory = getFilteredHistory();
    const progressData = [];
    
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        if (exercise.name === selectedExercise) {
          // Find the heaviest completed set
          let maxWeight = 0;
          let volume = 0;
          
          exercise.sets.forEach(set => {
            if (set.completed) {
              const weight = parseFloat(set.actualWeight);
              const reps = parseInt(set.actualReps);
              
              if (!isNaN(weight) && !isNaN(reps)) {
                if (weight > maxWeight) maxWeight = weight;
                volume += weight * reps;
              }
            }
          });
          
          if (maxWeight > 0) {
            progressData.push({
              date: new Date(workout.startTime).toLocaleDateString(),
              timestamp: new Date(workout.startTime).getTime(),
              weight: maxWeight,
              volume: volume
            });
          }
        }
      });
    });
    
    // Sort by date
    return progressData.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Format time from seconds to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate workout statistics
  const getWorkoutStats = () => {
    const filteredHistory = getFilteredHistory();
    
    if (filteredHistory.length === 0) {
      return {
        totalWorkouts: 0,
        avgDuration: 0,
        totalDuration: 0,
        completionRate: 0,
        mostFrequentExercise: 'N/A'
      };
    }
    
    const totalWorkouts = filteredHistory.length;
    const totalDuration = filteredHistory.reduce((acc, workout) => acc + workout.duration, 0);
    const avgDuration = totalDuration / totalWorkouts;
    
    // Calculate set completion rate
    let completedSets = 0;
    let totalSets = 0;
    
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          totalSets++;
          if (set.completed) completedSets++;
        });
      });
    });
    
    const completionRate = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
    
    // Find most frequent exercise
    const exerciseCounts = {};
    filteredHistory.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exerciseCounts[exercise.name] = (exerciseCounts[exercise.name] || 0) + 1;
      });
    });
    
    let mostFrequentExercise = 'N/A';
    let maxCount = 0;
    
    Object.entries(exerciseCounts).forEach(([exercise, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostFrequentExercise = exercise;
      }
    });
    
    return {
      totalWorkouts,
      avgDuration,
      totalDuration,
      completionRate,
      mostFrequentExercise
    };
  };

  // If no user profile exists, show redirect to profile creation
  if (!userProfile && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Activity className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h1>
          <p className="text-gray-600 mb-6">
            Before you can track your progress, you need to create an athlete profile. This helps us personalize your analytics.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Create Profile
          </button>
        </motion.div>
      </div>
    );
  }

  // If no workout history, show message to start tracking
  if (workoutHistory.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Workout Data Yet</h1>
          <p className="text-gray-600 mb-6">
            Complete your first workout to start tracking your progress. Your analytics will appear here after you've logged some training sessions.
          </p>
          <button
            onClick={() => navigate('/workout')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Start Tracking Workouts
          </button>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4A90E2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4A90E2] font-medium">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  // Main stats from workout data
  const stats = getWorkoutStats();
  const exerciseProgressData = getExerciseProgressData();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F4FF] p-3 rounded-full">
                <Activity className="w-8 h-8 text-[#4A90E2]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Progress Analytics</h1>
                <p className="text-gray-600">Track your fitness journey, {userProfile?.name}</p>
              </div>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowTimeFilter(!showTimeFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {timeRange === 'all' ? 'All Time' : timeRange === 'month' ? 'Last Month' : 'Last Week'}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {showTimeFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                  >
                    <button
                      onClick={() => {
                        setTimeRange('all');
                        setShowTimeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      All Time
                    </button>
                    <button
                      onClick={() => {
                        setTimeRange('month');
                        setShowTimeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Last Month
                    </button>
                    <button
                      onClick={() => {
                        setTimeRange('week');
                        setShowTimeFilter(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      Last Week
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'overview' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'exercises' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('exercises')}
            >
              Exercise Progress
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                activeTab === 'records' ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab('records')}
            >
              Personal Records
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Key Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-indigo-100 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Total Workouts</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.totalWorkouts}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {timeRange === 'all' ? 'All time' : timeRange === 'month' ? 'Last 30 days' : 'Last 7 days'}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <ClockIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Avg. Workout Time</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatTime(stats.avgDuration)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Total: {formatTime(stats.totalDuration)}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Completion Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stats.completionRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Sets completed vs. planned
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <Dumbbell className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="text-gray-600 text-sm">Top Exercise</span>
                    </div>
                    <div className="text-lg font-bold text-gray-800 truncate">
                      {stats.mostFrequentExercise}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Most frequently performed
                    </div>
                  </motion.div>
                </div>

                {/* Weekly Progress Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#4A90E2]" />
                    Weekly Workout Frequency
                  </h2>
                  
                  <div className="h-64 mt-6">
                    {weeklyWorkouts.length > 0 ? (
                      <div className="flex h-full items-end space-x-4">
                        {weeklyWorkouts.map((week, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full flex justify-center mb-2">
                              <div
                                className="bg-[#4A90E2] rounded-t-lg"
                                style={{
                                  height: `${Math.max(20, (week.count / 7) * 100)}%`,
                                  width: '60%',
                                  minHeight: '20px'
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">{week.week}</div>
                            <div className="text-sm font-semibold">{week.count}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No weekly data available</p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Muscle Group Focus */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#4A90E2]" />
                    Muscle Group Focus
                  </h2>
                  
                  {muscleGroupData.length > 0 ? (
                    <div className="space-y-4">
                      {muscleGroupData.slice(0, 5).map((group, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{group.name}</span>
                            <span className="text-gray-600">{group.count} exercises</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-[#4A90E2] h-2.5 rounded-full"
                              style={{ width: `${(group.count / muscleGroupData[0].count) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No muscle group data available</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Exercise Progress Tab */}
            {activeTab === 'exercises' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Exercise Selector */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Exercise</h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {uniqueExercises.map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedExercise(exercise)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          selectedExercise === exercise
                            ? 'bg-[#4A90E2] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {exercise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Weight Progress</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {selectedExercise ? `Tracking max weight for ${selectedExercise}` : 'Select an exercise to see progress'}
                  </p>
                  
                  <div className="h-64">
                    {exerciseProgressData.length > 0 ? (
                      <div className="h-full">
                        {/* Simplified chart visualization */}
                        <div className="flex h-full items-end space-x-2">
                          {exerciseProgressData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                              <div 
                                className="w-full flex justify-center mb-2 relative"
                                style={{ height: '100%' }}
                              >
                                <div
                                  className="bg-[#4A90E2] rounded-t-lg w-4/5"
                                  style={{
                                    height: `${(data.weight / Math.max(...exerciseProgressData.map(d => d.weight))) * 100}%`,
                                    minHeight: '20px'
                                  }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                                  {data.weight} lbs on {data.date}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 truncate w-full text-center">
                                {data.date.split('/').slice(0, 2).join('/')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          {selectedExercise 
                            ? `No progress data available for ${selectedExercise}` 
                            : 'Select an exercise to view progress'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Volume Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Volume Progress</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    Total volume (weight × reps) over time
                  </p>
                  
                  <div className="h-64">
                    {exerciseProgressData.length > 0 ? (
                      <div className="h-full">
                        {/* Simplified volume chart visualization */}
                        <div className="flex h-full items-end space-x-2">
                          {exerciseProgressData.map((data, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group relative">
                              <div 
                                className="w-full flex justify-center mb-2 relative"
                                style={{ height: '100%' }}
                              >
                                <div
                                  className="bg-green-500 rounded-t-lg w-4/5"
                                  style={{
                                    height: `${(data.volume / Math.max(...exerciseProgressData.map(d => d.volume))) * 100}%`,
                                    minHeight: '20px'
                                  }}
                                ></div>
                                
                                {/* Tooltip */}
                                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white py-1 px-2 rounded text-xs whitespace-nowrap transition-opacity">
                                  Volume: {data.volume} on {data.date}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 truncate w-full text-center">
                                {data.date.split('/').slice(0, 2).join('/')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">
                          {selectedExercise 
                            ? `No volume data available for ${selectedExercise}` 
                            : 'Select an exercise to view volume progress'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Suggestions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#4A90E2]" />
                    Improvement Suggestions
                  </h2>
                  
                  {selectedExercise && exerciseProgressData.length > 0 ? (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                        <h3 className="text-blue-800 font-medium">Progressive Overload</h3>
                        <p className="text-blue-700 text-sm mt-1">
                          Try increasing weight by 5-10% or adding 1-2 more reps to your {selectedExercise} to keep making progress.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                        <h3 className="text-green-800 font-medium">Training Frequency</h3>
                        <p className="text-green-700 text-sm mt-1">
                          Consider training {selectedExercise} 2-3 times per week with sufficient recovery for optimal strength gains.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                        <h3 className="text-purple-800 font-medium">Technique Focus</h3>
                        <p className="text-purple-700 text-sm mt-1">
                          As weights increase, ensure your {selectedExercise} form remains strict for safety and effectiveness.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-600">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <p>More data needed for personalized suggestions</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Personal Records Tab */}
            {activeTab === 'records' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-6 h-6 text-[#4A90E2]" />
                  Your Personal Records
                </h2>
                
                {personalRecords.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {personalRecords.map((record, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800 truncate" title={record.exercise}>
                              {record.exercise}
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                              {record.date}
                            </p>
                          </div>
                          <div className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-sm">
                            PR
                          </div>
                        </div>
                        
                        <div className="mt-4 flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-800">{record.weight}</span>
                          <span className="text-gray-600 mb-0.5">lbs</span>
                          <span className="text-gray-500 text-sm ml-auto">
                            {record.reps} reps
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No personal records yet</p>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Complete more workouts with challenging weights to establish your personal records.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
```

### src/pages/WorkoutPage.jsx

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Plus, 
  ChevronDown, 
  Clock, 
  Info, 
  X, 
  CheckCircle, 
  Save,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Share2,
  Calendar,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

// Exercise database with categories
const EXERCISE_DATABASE = {
  "Chest": [
    { name: "Bench Press", equipment: ["Barbell", "Bench"], muscleGroups: ["Chest", "Triceps", "Shoulders"], difficulty: "Intermediate" },
    { name: "Push-ups", equipment: ["Bodyweight"], muscleGroups: ["Chest", "Triceps", "Shoulders"], difficulty: "Beginner" },
    { name: "Dumbbell Flyes", equipment: ["Dumbbells", "Bench"], muscleGroups: ["Chest"], difficulty: "Intermediate" },
    { name: "Chest Dips", equipment: ["Dip Bars"], muscleGroups: ["Chest", "Triceps"], difficulty: "Intermediate" },
    { name: "Cable Crossovers", equipment: ["Cable Machine"], muscleGroups: ["Chest"], difficulty: "Intermediate" }
  ],
  "Back": [
    { name: "Pull-ups", equipment: ["Pull-up Bar"], muscleGroups: ["Back", "Biceps"], difficulty: "Intermediate" },
    { name: "Deadlift", equipment: ["Barbell"], muscleGroups: ["Back", "Hamstrings", "Glutes"], difficulty: "Advanced" },
    { name: "Bent Over Rows", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Back", "Biceps"], difficulty: "Intermediate" },
    { name: "Lat Pulldowns", equipment: ["Cable Machine"], muscleGroups: ["Back", "Biceps"], difficulty: "Beginner" },
    { name: "T-Bar Rows", equipment: ["T-Bar"], muscleGroups: ["Back"], difficulty: "Intermediate" }
  ],
  "Legs": [
    { name: "Squats", equipment: ["Barbell", "Squat Rack"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Intermediate" },
    { name: "Lunges", equipment: ["Bodyweight", "Dumbbells"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Beginner" },
    { name: "Leg Press", equipment: ["Leg Press Machine"], muscleGroups: ["Quadriceps", "Glutes", "Hamstrings"], difficulty: "Beginner" },
    { name: "Romanian Deadlift", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Hamstrings", "Glutes", "Lower Back"], difficulty: "Intermediate" },
    { name: "Calf Raises", equipment: ["Machine", "Bodyweight"], muscleGroups: ["Calves"], difficulty: "Beginner" }
  ],
  "Shoulders": [
    { name: "Overhead Press", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Shoulders", "Triceps"], difficulty: "Intermediate" },
    { name: "Lateral Raises", equipment: ["Dumbbells"], muscleGroups: ["Shoulders"], difficulty: "Beginner" },
    { name: "Face Pulls", equipment: ["Cable Machine"], muscleGroups: ["Rear Deltoids", "Upper Back"], difficulty: "Intermediate" },
    { name: "Arnold Press", equipment: ["Dumbbells"], muscleGroups: ["Shoulders"], difficulty: "Intermediate" },
    { name: "Upright Rows", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Shoulders", "Traps"], difficulty: "Intermediate" }
  ],
  "Arms": [
    { name: "Bicep Curls", equipment: ["Dumbbells", "Barbell"], muscleGroups: ["Biceps"], difficulty: "Beginner" },
    { name: "Tricep Dips", equipment: ["Bodyweight", "Dip Bars"], muscleGroups: ["Triceps"], difficulty: "Intermediate" },
    { name: "Skull Crushers", equipment: ["Barbell", "Dumbbells"], muscleGroups: ["Triceps"], difficulty: "Intermediate" },
    { name: "Hammer Curls", equipment: ["Dumbbells"], muscleGroups: ["Biceps", "Forearms"], difficulty: "Beginner" },
    { name: "Cable Pushdowns", equipment: ["Cable Machine"], muscleGroups: ["Triceps"], difficulty: "Beginner" }
  ],
  "Core": [
    { name: "Plank", equipment: ["Bodyweight"], muscleGroups: ["Abs", "Core"], difficulty: "Beginner" },
    { name: "Russian Twists", equipment: ["Bodyweight", "Medicine Ball"], muscleGroups: ["Abs", "Obliques"], difficulty: "Beginner" },
    { name: "Hanging Leg Raises", equipment: ["Pull-up Bar"], muscleGroups: ["Abs", "Hip Flexors"], difficulty: "Intermediate" },
    { name: "Cable Crunches", equipment: ["Cable Machine"], muscleGroups: ["Abs"], difficulty: "Intermediate" },
    { name: "Ab Wheel Rollouts", equipment: ["Ab Wheel"], muscleGroups: ["Abs", "Core"], difficulty: "Advanced" }
  ],
  "Cardio": [
    { name: "Running", equipment: ["None", "Treadmill"], muscleGroups: ["Full Body"], difficulty: "Beginner to Advanced" },
    { name: "Cycling", equipment: ["Bicycle", "Exercise Bike"], muscleGroups: ["Legs", "Core"], difficulty: "Beginner to Advanced" },
    { name: "Jump Rope", equipment: ["Jump Rope"], muscleGroups: ["Full Body"], difficulty: "Beginner to Advanced" },
    { name: "High Knees", equipment: ["Bodyweight"], muscleGroups: ["Legs", "Core"], difficulty: "Beginner" },
    { name: "Burpees", equipment: ["Bodyweight"], muscleGroups: ["Full Body"], difficulty: "Intermediate" }
  ]
};

// Demonstration images/gifs would be added in a real implementation
const EXERCISE_DEMOS = {
  "Bench Press": "/path/to/bench-press.gif",
  "Push-ups": "/path/to/pushups.gif",
  // This would be populated with paths to all exercise demonstrations
};

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("my-workouts"); // my-workouts, create, history
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const stopwatchInterval = useRef(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [quickMessage, setQuickMessage] = useState("");
  
  // Add these new state variables:
  const [selectedWorkoutForChat, setSelectedWorkoutForChat] = useState(null);
  const [workoutSelectOpen, setWorkoutSelectOpen] = useState(false);

  // New workout form state
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    exercises: [],
    description: ""
  });

  // Load user profile and workouts from localStorage
  useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }

    const storedWorkouts = localStorage.getItem(`workouts_${JSON.parse(storedProfile)?.id}`);
    if (storedWorkouts) {
      setWorkouts(JSON.parse(storedWorkouts));
    }

    const storedHistory = localStorage.getItem(`workout_history_${JSON.parse(storedProfile)?.id}`);
    if (storedHistory) {
      setWorkoutHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Save workouts when they change
  useEffect(() => {
    if (userProfile && workouts.length > 0) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(workouts));
    }
  }, [workouts, userProfile]);

  // Save workout history when it changes
  useEffect(() => {
    if (userProfile && workoutHistory.length > 0) {
      localStorage.setItem(`workout_history_${userProfile.id}`, JSON.stringify(workoutHistory));
    }
  }, [workoutHistory, userProfile]);

  // Stopwatch functionality
  useEffect(() => {
    if (stopwatchRunning) {
      stopwatchInterval.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(stopwatchInterval.current);
    }

    return () => clearInterval(stopwatchInterval.current);
  }, [stopwatchRunning]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format workout data to a readable string for Max
  const formatWorkoutForAI = (workout) => {
    if (!workout) return "";
    
    const startDate = new Date(workout.startTime);
    let formattedData = `Workout: ${workout.name}\n`;
    formattedData += `Date: ${startDate.toLocaleDateString()} at ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
    formattedData += `Duration: ${formatTime(workout.duration)}\n\n`;
    
    workout.exercises.forEach((exercise, index) => {
      const completedSets = exercise.sets.filter(set => set.completed).length;
      formattedData += `Exercise ${index + 1}: ${exercise.name} (${completedSets}/${exercise.sets.length} sets completed)\n`;
      
      exercise.sets.forEach((set, setIndex) => {
        const setType = set.type !== 'normal' ? ` (${set.type})` : '';
        if (set.completed) {
          formattedData += `  Set ${setIndex + 1}${setType}: ${set.actualWeight}lbs × ${set.actualReps} reps\n`;
        } else {
          formattedData += `  Set ${setIndex + 1}${setType}: ${set.weight}lbs × ${set.reps} reps (not completed)\n`;
        }
      });
      formattedData += '\n';
    });
    
    return formattedData;
  };

  const handleStartWorkout = (workout) => {
    // Create a copy with additional tracking fields
    const workoutWithTracking = {
      ...workout,
      exercises: workout.exercises.map(exercise => ({
        ...exercise,
        sets: exercise.sets.map(set => ({
          ...set,
          completed: false,
          actualReps: 0,
          actualWeight: set.weight
        }))
      })),
      startTime: new Date().toISOString(),
      isCompleted: false
    };
    
    setActiveWorkout(workoutWithTracking);
    setCurrentTab("active");
    setStopwatchRunning(true);
    setElapsedTime(0);
  };

  const handleCompleteWorkout = () => {
    // Create a history entry
    const completedWorkout = {
      ...activeWorkout,
      endTime: new Date().toISOString(),
      duration: elapsedTime,
      isCompleted: true
    };
    
    setWorkoutHistory(prev => [completedWorkout, ...prev]);
    setActiveWorkout(null);
    setStopwatchRunning(false);
    setCurrentTab("my-workouts");
  };

  const handleCancelWorkout = () => {
    if (confirm("Are you sure you want to cancel this workout? Progress will not be saved.")) {
      setActiveWorkout(null);
      setStopwatchRunning(false);
      setCurrentTab("my-workouts");
    }
  };

  const handleSetCompleted = (exerciseIndex, setIndex, completed, actualReps, actualWeight) => {
    setActiveWorkout(prev => {
      const newWorkout = { ...prev };
      newWorkout.exercises[exerciseIndex].sets[setIndex].completed = completed;
      newWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = actualReps;
      newWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = actualWeight;
      return newWorkout;
    });
  };

  const handleAddExercise = (exercise) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, {
        name: exercise.name,
        sets: [{ reps: 10, weight: 0, type: 'normal' }],
        notes: "",
        equipment: exercise.equipment,
        muscleGroups: exercise.muscleGroups
      }]
    }));
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (index) => {
    setNewWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index)
    }));
  };

  const handleAddSet = (exerciseIndex) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      const lastSet = newExercises[exerciseIndex].sets[newExercises[exerciseIndex].sets.length - 1];
      newExercises[exerciseIndex].sets.push({
        reps: lastSet.reps,
        weight: lastSet.weight,
        type: lastSet.type
      });
      return { ...prev, exercises: newExercises };
    });
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      if (newExercises[exerciseIndex].sets.length > 1) {
        newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
      }
      return { ...prev, exercises: newExercises };
    });
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    setNewWorkout(prev => {
      const newExercises = [...prev.exercises];
      newExercises[exerciseIndex].sets[setIndex][field] = value;
      return { ...prev, exercises: newExercises };
    });
  };

  const handleSaveWorkout = () => {
    if (!newWorkout.name.trim()) {
      alert("Please give your workout a name");
      return;
    }
  
    if (newWorkout.exercises.length === 0) {
      alert("Please add at least one exercise to your workout");
      return;
    }
  
    const workoutToSave = {
      ...newWorkout,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
  
    // First update state
    const updatedWorkouts = [...workouts, workoutToSave];
    setWorkouts(updatedWorkouts);
    
    // Save to localStorage immediately to avoid race conditions
    if (userProfile) {
      localStorage.setItem(`workouts_${userProfile.id}`, JSON.stringify(updatedWorkouts));
    }
    
    // Reset form and switch tabs
    setNewWorkout({
      name: "",
      exercises: [],
      description: ""
    });
    setCurrentTab("my-workouts");
  };

  const handleDeleteWorkout = (workoutId) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      setWorkouts(prev => prev.filter(workout => workout.id !== workoutId));
    }
  };

  // UPDATED FUNCTION: Modified handleChatWithMax function to use navigation state
  const handleChatWithMax = () => {
    // Prepare data to pass to the chat screen
    const chatData = {
      message: quickMessage.trim(),
      workout: selectedWorkoutForChat ? {
        name: selectedWorkoutForChat.name,
        date: new Date(selectedWorkoutForChat.startTime).toLocaleDateString(),
        time: new Date(selectedWorkoutForChat.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: formatTime(selectedWorkoutForChat.duration),
        exercises: selectedWorkoutForChat.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.length,
          completed: ex.sets.filter(set => set.completed).length
        }))
      } : null,
      workoutDetails: selectedWorkoutForChat ? formatWorkoutForAI(selectedWorkoutForChat) : ""
    };
    
    // Navigate to chat with this data
    navigate('/chat', { state: chatData });
    
    // Reset the modal state
    setShowChatModal(false);
    setSelectedWorkoutForChat(null);
    setQuickMessage("");
  };

  // If no profile exists, show redirect to profile creation
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF] py-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-[#E8F4FF] rounded-full mx-auto flex items-center justify-center mb-6">
            <Dumbbell className="w-12 h-12 text-[#4A90E2]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Your Profile</h1>
          <p className="text-gray-600 mb-6">
            Before you can track your workouts, you need to create an athlete profile. This helps Max personalize your experience.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg font-medium hover:bg-[#357ABD] transition-colors shadow-md mx-auto"
          >
            Create Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3FF] to-[#D1E9FF]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8F4FF] p-3 rounded-full">
                <Dumbbell className="w-8 h-8 text-[#4A90E2]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Workout Tracker</h1>
                <p className="text-gray-600">Hey {userProfile?.name}, let's crush your fitness goals!</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowChatModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              Ask Max
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentTab === "my-workouts" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentTab("my-workouts")}
            >
              My Workouts
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentTab === "create" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentTab("create")}
            >
              Create Workout
            </button>
            <button
              className={`flex-1 py-4 px-6 font-medium transition-colors ${
                currentTab === "history" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setCurrentTab("history")}
            >
              History
            </button>
            {activeWorkout && (
              <button
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  currentTab === "active" ? "text-[#4A90E2] border-b-2 border-[#4A90E2]" : "text-red-500 hover:bg-red-50"
                }`}
                onClick={() => setCurrentTab("active")}
              >
                Active Workout
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* My Workouts Tab */}
            {currentTab === "my-workouts" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Your Workout Plans</h2>
                  <button
                    onClick={() => setCurrentTab("create")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E8F4FF] text-[#4A90E2] rounded-lg hover:bg-[#D1E8FF] transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    New Workout
                  </button>
                </div>

                {workouts.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">You haven't created any workout plans yet.</p>
                    <button
                      onClick={() => setCurrentTab("create")}
                      className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                    >
                      Create Your First Workout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workouts.map(workout => (
                      <motion.div
                        key={workout.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-5 border-b border-gray-100">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleDeleteWorkout(workout.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            {workout.exercises.length} exercise{workout.exercises.length !== 1 ? 's' : ''}
                          </p>
                          {workout.description && (
                            <p className="text-gray-500 text-sm mt-2">{workout.description}</p>
                          )}
                        </div>
                        
                        <div className="p-4 bg-gray-50">
                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Exercises:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {workout.exercises.slice(0, 3).map((exercise, index) => (
                                <li key={index}>{exercise.name} ({exercise.sets.length} sets)</li>
                              ))}
                              {workout.exercises.length > 3 && (
                                <li className="text-gray-500">+{workout.exercises.length - 3} more...</li>
                              )}
                            </ul>
                          </div>
                          
                          <button
                            onClick={() => handleStartWorkout(workout)}
                            className="w-full mt-2 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors flex items-center justify-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Start Workout
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Create Workout Tab */}
            {currentTab === "create" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Create New Workout</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name</label>
                    <input
                      type="text"
                      value={newWorkout.name}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="My Awesome Workout"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={newWorkout.description}
                      onChange={(e) => setNewWorkout(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      placeholder="Notes about this workout..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Exercises</label>
                      <button
                        onClick={() => setShowExerciseModal(true)}
                        className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Exercise
                      </button>
                    </div>

                    {newWorkout.exercises.length === 0 ? (
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setShowExerciseModal(true)}
                      >
                        <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">No exercises added yet</p>
                        <p className="text-sm text-gray-500">Click to add exercises to your workout</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {newWorkout.exercises.map((exercise, exerciseIndex) => (
                          <div key={exerciseIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                              <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                              <button 
                                onClick={() => handleRemoveExercise(exerciseIndex)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="p-4">
                              <div className="mb-4">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="text-left text-gray-600">
                                      <th className="pb-2">Set</th>
                                      <th className="pb-2">Weight</th>
                                      <th className="pb-2">Reps</th>
                                      <th className="pb-2">Type</th>
                                      <th className="pb-2"></th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {exercise.sets.map((set, setIndex) => (
                                      <tr key={setIndex}>
                                        <td className="py-2">{setIndex + 1}</td>
                                        <td className="py-2">
                                          <input
                                            type="number"
                                            min="0"
                                            value={set.weight}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', e.target.value)}
                                            className="w-16 p-2 border border-gray-300 rounded"
                                          />
                                        </td>
                                        <td className="py-2">
                                          <input
                                            type="number"
                                            min="1"
                                            value={set.reps}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', e.target.value)}
                                            className="w-16 p-2 border border-gray-300 rounded"
                                          />
                                        </td>
                                        <td className="py-2">
                                          <select
                                            value={set.type}
                                            onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'type', e.target.value)}
                                            className="p-2 border border-gray-300 rounded"
                                          >
                                            <option value="normal">Normal</option>
                                            <option value="warm-up">Warm-up</option>
                                            <option value="drop">Drop Set</option>
                                          </select>
                                        </td>
                                        <td className="py-2">
                                          <button
                                            onClick={() => handleRemoveSet(exerciseIndex, setIndex)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            disabled={exercise.sets.length <= 1}
                                          >
                                            <X className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleAddSet(exerciseIndex)}
                                  className="flex items-center gap-1 text-sm text-[#4A90E2] hover:text-[#357ABD] transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Set
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => {
                        setNewWorkout({
                          name: "",
                          exercises: [],
                          description: ""
                        });
                        setCurrentTab("my-workouts");
                      }}
                      className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveWorkout}
                      className="flex items-center gap-2 px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!newWorkout.name || newWorkout.exercises.length === 0}
                    >
                      <Save className="w-5 h-5" />
                      Save Workout
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* History Tab */}
            {currentTab === "history" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Workout History</h2>
                </div>

                {workoutHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">You haven't completed any workouts yet.</p>
                    {workouts.length > 0 && (
                      <button
                        onClick={() => setCurrentTab("my-workouts")}
                        className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                      >
                        Start a Workout
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workoutHistory.map((workout, index) => {
                      const startDate = new Date(workout.startTime);
                      const endDate = new Date(workout.endTime);
                      return (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{workout.name}</h3>
                              <p className="text-sm text-gray-600">
                                {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 bg-[#E8F4FF] px-3 py-1 rounded-full">
                              <Clock className="w-4 h-4 text-[#4A90E2]" />
                              <span className="text-sm font-medium text-[#4A90E2]">
                                {formatTime(workout.duration)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {workout.exercises.map((exercise, exerciseIndex) => {
                              const completedSets = exercise.sets.filter(set => set.completed).length;
                              return (
                                <div key={exerciseIndex} className="border-t border-gray-100 pt-3">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-800">{exercise.name}</span>
                                    <span className="text-sm text-gray-600">
                                      {completedSets}/{exercise.sets.length} sets completed
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-4 gap-2 text-sm">
                                    {exercise.sets.map((set, setIndex) => (
                                      <div 
                                        key={setIndex} 
                                        className={`p-2 rounded text-center ${
                                          set.completed 
                                            ? 'bg-green-50 text-green-700' 
                                            : 'bg-gray-50 text-gray-500'
                                        }`}
                                      >
                                        {set.completed ? set.actualWeight : set.weight}lbs × {set.completed ? set.actualReps : set.reps}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Active Workout Tab */}
            {currentTab === "active" && activeWorkout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{activeWorkout.name}</h2>
                    <p className="text-sm text-gray-600">Workout in progress</p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#E8F4FF] px-4 py-2 rounded-lg">
                      <Clock className="w-5 h-5 text-[#4A90E2]" />
                      <span className="font-mono font-medium text-[#4A90E2]">
                        {formatTime(elapsedTime)}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setStopwatchRunning(!stopwatchRunning)}
                      className={`p-2 rounded-full ${
                        stopwatchRunning 
                          ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      } transition-colors`}
                    >
                      {stopwatchRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {activeWorkout.exercises.map((exercise, exerciseIndex) => {
                    const completedSets = exercise.sets.filter(set => set.completed).length;
                    return (
                      <div key={exerciseIndex} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                          <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {completedSets}/{exercise.sets.length} sets completed
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-gray-600">
                                <th className="pb-3">Set</th>
                                <th className="pb-3">Weight (lbs)</th>
                                <th className="pb-3">Reps</th>
                                <th className="pb-3">Actual</th>
                                <th className="pb-3"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((set, setIndex) => (
                                <tr key={setIndex} className={set.completed ? 'bg-green-50' : ''}>
                                  <td className="py-3">{setIndex + 1} {set.type !== 'normal' && `(${set.type})`}</td>
                                  <td className="py-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={set.actualWeight}
                                      onChange={(e) => {
                                        const newActiveWorkout = { ...activeWorkout };
                                        newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualWeight = e.target.value;
                                        setActiveWorkout(newActiveWorkout);
                                      }}
                                      className={`w-20 p-2 border rounded ${
                                        set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                      }`}
                                      disabled={set.completed}
                                    />
                                  </td>
                                  <td className="py-3">{set.reps}</td>
                                  <td className="py-3">
                                    <input
                                      type="number"
                                      min="0"
                                      max={99}
                                      value={set.actualReps || ''}
                                      onChange={(e) => {
                                        const newActiveWorkout = { ...activeWorkout };
                                        newActiveWorkout.exercises[exerciseIndex].sets[setIndex].actualReps = e.target.value;
                                        setActiveWorkout(newActiveWorkout);
                                      }}
                                      className={`w-20 p-2 border rounded ${
                                        set.completed ? 'border-green-300 bg-green-50' : 'border-gray-300'
                                      }`}
                                      placeholder={set.reps}
                                      disabled={set.completed}
                                    />
                                  </td>
                                  <td className="py-3">
                                    {set.completed ? (
                                      <button
                                        onClick={() => handleSetCompleted(exerciseIndex, setIndex, false, 0, set.weight)}
                                        className="p-2 text-green-600 hover:text-green-700 transition-colors"
                                      >
                                        <RotateCcw className="w-5 h-5" />
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleSetCompleted(exerciseIndex, setIndex, true, set.actualReps || set.reps, set.actualWeight)}
                                        className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                      >
                                        <CheckCircle className="w-5 h-5" />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handleCancelWorkout}
                    className="px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Cancel Workout
                  </button>
                  <button
                    onClick={handleCompleteWorkout}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Complete Workout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Selection Modal */}
      <AnimatePresence>
        {showExerciseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">Add Exercise</h3>
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(EXERCISE_DATABASE).map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        category === selectedCategory
                          ? 'bg-[#4A90E2] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {selectedCategory ? (
                    EXERCISE_DATABASE[selectedCategory].map((exercise, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleAddExercise(exercise)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-800">{exercise.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Target: {exercise.muscleGroups.join(', ')}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {exercise.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-[#E8F4FF] text-[#4A90E2] rounded-full">
                            {exercise.equipment.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Select a muscle group to view exercises</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Chat Modal - Updated Version */}
      <AnimatePresence>
        {showChatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl overflow-hidden shadow-xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-6 h-6 text-[#4A90E2]" />
                  <h3 className="text-xl font-semibold text-gray-800">Ask Max</h3>
                </div>
                
                {/* Workout Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Share a workout (optional):
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setWorkoutSelectOpen(!workoutSelectOpen)}
                      className="w-full p-3 text-left border border-gray-300 rounded-lg flex justify-between items-center hover:border-[#4A90E2] transition-colors"
                    >
                      <span className="text-gray-700">
                        {selectedWorkoutForChat ? selectedWorkoutForChat.name : 'Select a workout'}
                      </span>
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {/* Workout Dropdown */}
                    <AnimatePresence>
                      {workoutSelectOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                        >
                          <div className="p-2">
                            <button
                              className="w-full p-2 text-left hover:bg-gray-50 rounded-md text-gray-500 text-sm"
                              onClick={() => {
                                setSelectedWorkoutForChat(null);
                                setWorkoutSelectOpen(false);
                              }}
                            >
                              No workout
                            </button>
                            
                            {/* Active Workout Option */}
                            {activeWorkout && (
                              <button
                                className="w-full p-2 text-left hover:bg-gray-50 rounded-md flex items-center justify-between"
                                onClick={() => {
                                  setSelectedWorkoutForChat(activeWorkout);
                                  setWorkoutSelectOpen(false);
                                }}
                              >
                                <div>
                                <div className="font-medium text-gray-800">{activeWorkout.name}</div>
                                  <div className="text-xs text-green-600">Current Workout</div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatTime(elapsedTime)}
                                </div>
                              </button>
                            )}
                            
                            {/* History Options */}
                            <div className="text-xs text-gray-500 mt-2 mb-1 px-2">History</div>
                            {workoutHistory.length === 0 ? (
                              <div className="text-sm text-gray-500 p-2">No workout history</div>
                            ) : (
                              workoutHistory.map((workout, index) => {
                                const startDate = new Date(workout.startTime);
                                return (
                                  <button
                                    key={index}
                                    className="w-full p-2 text-left hover:bg-gray-50 rounded-md flex items-center justify-between"
                                    onClick={() => {
                                      setSelectedWorkoutForChat(workout);
                                      setWorkoutSelectOpen(false);
                                    }}
                                  >
                                    <div>
                                      <div className="font-medium text-gray-800">{workout.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {formatTime(workout.duration)}
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Preview Selected Workout */}
                  <AnimatePresence>
                    {selectedWorkoutForChat && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                          <div className="font-medium text-gray-800">{selectedWorkoutForChat.name}</div>
                          <button
                            onClick={() => setSelectedWorkoutForChat(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-3 text-sm">
                          <div className="text-gray-500 flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(selectedWorkoutForChat.duration)}</span>
                          </div>
                          <div className="space-y-1">
                            {selectedWorkoutForChat.exercises.map((exercise, i) => {
                              const completedSets = exercise.sets.filter(set => set.completed).length;
                              return (
                                <div key={i} className="text-gray-700">
                                  {exercise.name} ({completedSets}/{exercise.sets.length} sets)
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <textarea
                  value={quickMessage}
                  onChange={(e) => setQuickMessage(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent h-32"
                  placeholder={selectedWorkoutForChat 
                    ? "Ask about this workout..." 
                    : "Ask a question about your workout or fitness journey..."}
                />
                
                <div className="mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Quick questions Max can help with:
                  </span>
                  <ul className="ml-6 mt-2 list-disc space-y-1">
                    <li>How can I improve my {selectedWorkoutForChat ? selectedWorkoutForChat.name : "workout"} routine?</li>
                    <li>What's the right form for {selectedWorkoutForChat && selectedWorkoutForChat.exercises.length > 0 
                      ? selectedWorkoutForChat.exercises[0].name 
                      : "bench press"}?</li>
                    <li>How can I progress with this routine?</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowChatModal(false);
                    setSelectedWorkoutForChat(null);
                    setQuickMessage("");
                  }}
                  className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleChatWithMax();
                    setShowChatModal(false);
                    setSelectedWorkoutForChat(null);
                    setQuickMessage("");
                  }}
                  className="px-6 py-3 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
                  disabled={!quickMessage.trim() && !selectedWorkoutForChat}
                >
                  Chat with Max
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutPage;
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          serif: ['Playfair Display', 'serif'],
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
```

### vite.config.js

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/.netlify\/functions/, '')
      }
    }
  }
});

```
