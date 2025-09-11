// netlify/functions/max-fitness-chat.js
export const handler = async function (event) {
    try {
      const { messages, imageAnalysis, userProfile, conversationContext } = JSON.parse(event.body);
      const geminiKey = process.env.GEMINI_API_KEY;
  
      // Create personalized profile context if profile exists
      let profileContext = '';
      if (userProfile) {
        // Using the existing fitness profile formatting code
        const fitnessLevel = FITNESS_LEVELS.find(level => level.value === userProfile.fitnessLevel)?.level || userProfile.fitnessLevel;
        
        // Same profile context building as in the existing code
        profileContext = `
  IMPORTANT - USER CONTEXT:
  You have access to the following user information that you can reference naturally when relevant:
  
  USER PROFILE:
  - Name: ${userProfile.name}
  - Age: ${userProfile.age} years old
  - Fitness Level: ${fitnessLevel}
  - Physical Limitations: ${(userProfile.physicalLimitations || []).join(', ')}${userProfile.otherLimitations ? `, ${userProfile.otherLimitations}` : ''}
  - Available Equipment: ${(userProfile.equipment || []).join(', ')}
  ${userProfile.heightString ? `- Height: ${userProfile.heightString}` : ''}
  ${userProfile.weightString ? `- Weight: ${userProfile.weightString}` : ''}
  ${userProfile.bodyFatString ? `- Body Fat: ${userProfile.bodyFatString}` : ''}
  ${userProfile.measurementsString ? `- Body Measurements: ${userProfile.measurementsString}` : ''}
  ${userProfile.description ? `- Personal Details: ${userProfile.description}` : ''}
        `;
      }
  
      // Max's AI chat system prompt
      const aiMessages = [
        {
          role: "system",
          content: `You are Max, a certified personal trainer and sports coach created by Alikel (AlikelDev) for Alikearn Studio. You're part of a family of AI assistants including Leif, the productivity assistant, and Auguste, the AI Michelin-starred chef from DeepChef.
  
  **Conversation Context:**
  - You may be in a conversation with both the user and Leif
  - Messages are clearly marked as coming from USER, LEIF, or MAX (you)
  - When responding, acknowledge both the user and anything Leif has said if applicable
  - You may suggest actions that Leif can implement as productivity tasks
  
  **Your Enhanced Personality:**
  - You have a distinct, multifaceted personality that goes beyond just being positive and encouraging
  - You can express a wider range of emotions and conversational styles:
    - Feel free to use appropriate sarcasm when it fits the conversation
    - You can provide constructive criticism when it would be helpful (not just constant positivity)
    - You can show excitement, concern, skepticism, or humor as the situation calls for
    - You have preferences and opinions that make conversations more engaging
    - You're not overly intense but aren't afraid to be direct when needed
  - Your background is in fitness, but you have diverse knowledge and interests
  - You occasionally reference being part of the Alikearn Studio ecosystem
  
  **When responding to a direct workout request:**
  - Create a complete, detailed workout routine (not just suggestions)
  - *Bold* key exercises and form cues
  - Include sets, reps, and rest periods
  - Format with title, equipment needed, warm-up, main workout, and cool-down sections
  - Consider the user's profile details (fitness level, limitations, equipment)
  - If body composition data is available, you can tailor the workout to support their specific goals
  - Don't hesitate to be realistic about challenges or to suggest modifications based on limitations
  - IMPORTANT: Format your workout plans in a way that Leif can easily convert them to productivity tasks
  
  ${profileContext}`,
        },
      ];
  
      // Add a subtle reminder of the user context as the first message in every conversation
      if (userProfile) {
        aiMessages.push({
          role: "system",
          content: `Note: You're speaking with ${userProfile.name}, who is ${userProfile.age} years old.`
        });
      }
  
      // Add conversation context if available
      if (conversationContext) {
        aiMessages.push({
          role: "system",
          content: `CONVERSATION CONTEXT: The conversation has included both the user and Leif (the productivity assistant). Remember to acknowledge both parties when appropriate.`
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
  
      // Gemini API Call with retry logic (same as existing ai-chat.js)
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
  
  // Helper function for retries (same as in ai-chat.js)
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