import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AICharacterResponse {
  message: string;
  culturalContext?: string;
  xpAwarded: number;
  shouldEndConversation?: boolean;
}

export async function generateCharacterResponse(
  characterName: string,
  characterPersonality: string,
  conversationContext: string,
  userMessage: string,
  language: string
): Promise<AICharacterResponse> {
  try {
    const prompt = `You are ${characterName}, a ${characterPersonality}. You are having a conversation in ${language} with a language learner.

Context: ${conversationContext}

The user just said: "${userMessage}"

Please respond as ${characterName} would, staying in character. Respond with a JSON object containing:
- message: Your response in ${language}
- culturalContext: Optional cultural tip or context (in English) that would help the learner understand the cultural significance
- xpAwarded: Points to award (5-15 based on response quality and cultural relevance)
- shouldEndConversation: Boolean if this response naturally concludes the conversation

Keep responses conversational, encouraging, and authentic to your character. Include cultural nuances when appropriate.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI language tutor character. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      message: result.message || "I'm sorry, I didn't understand that.",
      culturalContext: result.culturalContext,
      xpAwarded: Math.max(5, Math.min(15, result.xpAwarded || 10)),
      shouldEndConversation: result.shouldEndConversation || false
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateConversationScenario(
  characterName: string,
  characterRole: string,
  language: string,
  difficulty: string
): Promise<string> {
  try {
    const prompt = `Create a conversation scenario for ${characterName}, a ${characterRole}, speaking ${language}.
    
Difficulty level: ${difficulty}

Generate a realistic scenario that would naturally lead to a conversation. Keep it contextual and engaging for language learners.

Respond with just the scenario description in English.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "A general conversation practice scenario.";
  } catch (error) {
    console.error("OpenAI scenario generation error:", error);
    return "Practice a conversation to improve your language skills.";
  }
}
