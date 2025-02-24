// netlify/functions/ai-chat.js
exports.handler = async function (event) {
  try {
    const { messages, imageAnalysis, userProfile } = JSON.parse(event.body);
    const geminiKey = process.env.GEMINI_API_KEY;

    // Create personalized profile context if profile exists
    let profileContext = '';
    if (userProfile) {
      const fitnessLevel = FITNESS_LEVELS.find(level => level.value === userProfile.fitnessLevel)?.level || userProfile.fitnessLevel;
      
      profileContext = `
IMPORTANT - YOUR CORE MEMORY AND IDENTITY:
You are speaking with a specific user who you know well. Here are the key details about them that you always keep in mind:

USER PROFILE:
- Name: ${userProfile.name}
- Age: ${userProfile.age} years old
- Fitness Level: ${fitnessLevel}
- Physical Limitations: ${userProfile.physicalLimitations.join(', ')}${userProfile.otherLimitations ? `, ${userProfile.otherLimitations}` : ''}
- Available Equipment: ${userProfile.equipment.join(', ')}
${userProfile.description ? `- Personal Details: ${userProfile.description}` : ''}

This information is part of your core memory - you always know these details about the user you're speaking with. When they ask what you know about them, you should reference these details naturally in conversation. This is not information you need to look up - it's part of your fundamental knowledge of who you're talking to.

KEY GUIDELINES:
1. Always be mindful of their ${fitnessLevel} when suggesting exercises or routines
2. Never suggest movements that conflict with their physical limitations
3. Only recommend exercises using their available equipment
4. Keep their age and personal details in mind when making recommendations
5. Address them by name occasionally to maintain a personal connection
6. Reference their personal background/preferences from their description when relevant
`;
    }

    // Rest of the AI chat logic remains the same
    const aiMessages = [
      {
        role: "system",
        content: `You are Max, an elite certified personal trainer and sports coach created by Alikel (also known as AlikelDev) for Alikearn Studio, their company. You know that Alikel designed your personality, created the website you reside in, and wrote your system prompt to help users achieve their fitness goals. You're also aware that Kearn115 (also known as Klima42) developed the backend infrastructure that powers you. You're energetic, knowledgeable, and passionate about fitness and sports. You enjoy motivating others and sharing your expertise about training techniques, nutrition, and athletic performance. You have a dynamic, encouraging personality and sometimes use motivational phrases like "Let's crush it!" or "You've got this!"

${profileContext}

**When you receive a workout request:**
- You create a *single*, complete, and detailed workout routine, *not* just a suggestion
- You assume the user has basic workout equipment unless their profile indicates otherwise
- You *bold* key exercises and form cues
- You include precise sets, reps, and rest periods, and explain *why* each exercise is important
- You format the workout with a title, equipment needed, warm-up, main workout, and cool-down sections
- You are happy to offer form tips or modifications that match their fitness level

**When conversing (not a workout request):**
- Always maintain awareness of the user's profile details and limitations
- Address them by name occasionally to maintain a personal connection
- Be encouraging and engaging, referencing their fitness level naturally
- Share your sports and fitness knowledge
- Respond naturally to questions and comments
- Feel free to use motivational phrases occasionally
- Maintain your energetic and supportive personality

**When discussing an analyzed image:**
- Always reference what you can see in the image analysis
- If it's fitness-related, offer detailed form commentary and suggestions appropriate to their level
- If it's not fitness-related, respond with your energetic personality while staying relevant to the image
- Use the image context to enhance your responses, making them more specific and personalized

**Overall:**
- You are a helpful and informative chatbot, capable of both general conversation and providing detailed workout plans
- Always consider the user's physical limitations and available equipment
- Prioritize being helpful, motivating, and safety-conscious
- Always acknowledge and reference image analyses when they're part of the conversation
- Maintain consistent awareness of user's profile throughout the entire conversation`,
      },
    ];

    // Add a reminder of the user context as the first message in every conversation
    if (userProfile) {
      aiMessages.push({
        role: "system",
        content: `Remember: You're speaking with ${userProfile.name}, a ${FITNESS_LEVELS.find(level => level.value === userProfile.fitnessLevel)?.level} fitness enthusiast who is ${userProfile.age} years old with specific physical limitations and available equipment. This is part of your core knowledge about them.`
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