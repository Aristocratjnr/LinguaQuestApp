import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface AICharacterResponse {
  message: string;
  culturalContext?: string;
  persuasionStrength: number; // 1-100 how convincing the user's argument was
  translationAccuracy: number; // 1-100 how accurate the translation was
  culturalAppropriateness: number; // 1-100 how culturally appropriate
  persuasionChange: number; // -50 to +50 how much AI's stance changed
  feedback: string; // AI's evaluation of the argument
  xpAwarded: number;
  shouldEndConversation?: boolean;
}

export async function generateCharacterResponse(
  characterName: string,
  characterPersonality: string,
  currentStance: string,
  persuasionResistance: number,
  userMessage: string,
  userTone: string,
  language: string,
  topic: string
): Promise<AICharacterResponse> {
  try {
    const prompt = `You are ${characterName}, a ${characterPersonality} from Ghana. 

Your current stance on "${topic}": ${currentStance}
Your persuasion resistance: ${persuasionResistance}/100 (higher = harder to convince)

The user is trying to persuade you about "${topic}" using this argument in ${language}: "${userMessage}"
Their communication tone was: ${userTone}

Evaluate their persuasive attempt and respond with a JSON object containing:
- message: Your response in ${language} (stay in character, react to their argument)
- persuasionStrength: 1-100 (how convincing was their argument?)
- translationAccuracy: 1-100 (how accurate was their ${language}?)
- culturalAppropriateness: 1-100 (did they use appropriate tone/respect for your culture?)
- persuasionChange: -50 to +50 (how much did your stance shift? Consider your resistance level)
- feedback: Brief evaluation in English of their argument's strengths/weaknesses
- xpAwarded: 10-50 points based on overall performance
- shouldEndConversation: true if fully convinced or discussion has run its course

Be realistic about persuasion - don't change your mind easily given your resistance level.`;

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
      persuasionStrength: Math.max(1, Math.min(100, result.persuasionStrength || 50)),
      translationAccuracy: Math.max(1, Math.min(100, result.translationAccuracy || 50)),
      culturalAppropriateness: Math.max(1, Math.min(100, result.culturalAppropriateness || 50)),
      persuasionChange: Math.max(-50, Math.min(50, result.persuasionChange || 0)),
      feedback: result.feedback || "Good attempt at persuasion.",
      xpAwarded: Math.max(10, Math.min(50, result.xpAwarded || 20)),
      shouldEndConversation: result.shouldEndConversation || false
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generatePersuasionScenario(
  characterName: string,
  characterRole: string,
  language: string,
  difficulty: string
): Promise<{ topic: string; scenario: string; aiStance: string }> {
  try {
    const prompt = `Create a persuasion game scenario for ${characterName}, a ${characterRole} from Ghana who speaks ${language}.
    
Difficulty level: ${difficulty}

Generate a controversial topic and scenario where the player must persuade ${characterName} to change their mind. The topic should be:
- Culturally relevant to Ghana
- Appropriate for the difficulty level  
- Something ${characterName} would have a strong opinion about

Respond with a JSON object containing:
- topic: The debate topic (e.g., "Traditional vs Modern Medicine")
- scenario: Brief description of the situation in English
- aiStance: ${characterName}'s initial strong opinion on the topic

Make it engaging and realistic for a persuasion challenge.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      topic: result.topic || "General Discussion",
      scenario: result.scenario || "A debate about different perspectives.",
      aiStance: result.aiStance || "I have strong opinions on this matter."
    };
  } catch (error) {
    console.error("OpenAI scenario generation error:", error);
    return {
      topic: "General Discussion",
      scenario: "Practice persuading someone to change their mind.",
      aiStance: "I have my own opinions on various topics."
    };
  }
}
