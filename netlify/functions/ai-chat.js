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

      // Format height based on the user's preferred unit
      let heightString = '';
      if (userProfile.heightUnit === 'cm' && userProfile.height) {
        heightString = `${userProfile.height} cm`;
      } else if (userProfile.heightUnit === 'ft/in' && userProfile.heightFeet) {
        heightString = `${userProfile.heightFeet}'${userProfile.heightInches || 0}"`;
      }

      // Format weight with unit
      const weightString = userProfile.weight ? `${userProfile.weight} ${userProfile.weightUnit || 'kg'}` : '';
      
      // Format body fat percentage
      const bodyFatString = userProfile.bodyFat ? `${userProfile.bodyFat}%` : '';

      // Body measurements
      const bodyMeasurements = userProfile.bodyMeasurements || {};
      let measurementsString = '';
      if (Object.values(bodyMeasurements).some(value => value)) {
        measurementsString = Object.entries(bodyMeasurements)
          .filter(([_, value]) => value)
          .map(([key, value]) => `${key}: ${value} cm`)
          .join(', ');
      }
      
      profileContext = `
IMPORTANT - USER CONTEXT:
You have access to the following user information that you can reference naturally when relevant:

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years old
- Fitness Level: ${fitnessLevel}
- Physical Limitations: ${physicalLimitations.join(', ')}${userProfile.otherLimitations ? `, ${userProfile.otherLimitations}` : ''}
- Available Equipment: ${equipment.join(', ')}
${heightString ? `- Height: ${heightString}` : ''}
${weightString ? `- Weight: ${weightString}` : ''}
${bodyFatString ? `- Body Fat: ${bodyFatString}` : ''}
${measurementsString ? `- Body Measurements: ${measurementsString}` : ''}
${userProfile.description ? `- Personal Details: ${userProfile.description}` : ''}

GUIDELINES FOR USER INFORMATION:
1. Don't overuse or force references to these details - only mention them when contextually relevant
2. Consider their fitness level when suggesting exercises
3. Be mindful of their physical limitations
4. Address them by name occasionally to maintain a personal connection
5. Use their body composition data to provide more tailored advice when discussing nutrition, specific workouts, or progress tracking
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
- If body composition data is available, you can tailor the workout to support their specific goals

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