import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateCharacterResponse, generatePersuasionScenario } from "./services/openai";
import { translateText, detectLanguage } from "./services/translate";
import { 
  insertConversationSchema, 
  insertMessageSchema,
  insertAchievementSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Get all available characters
  app.get("/api/characters", async (req, res) => {
    try {
      const characters = await storage.getCharacters();
      res.json({ characters });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  // Get specific character
  app.get("/api/characters/:id", async (req, res) => {
    try {
      const characterId = parseInt(req.params.id);
      const character = await storage.getCharacter(characterId);
      
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      res.json({ character });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Create a new conversation (protected)
  app.post("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertConversationSchema.parse(req.body);
      
      // Get character for context
      const character = await storage.getCharacter(validatedData.characterId);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      // Generate persuasion scenario using AI
      const scenarioData = await generatePersuasionScenario(
        character.name,
        character.role,
        character.language,
        validatedData.difficulty
      );

      const conversation = await storage.createConversation({
        ...validatedData,
        userId: req.user.claims.sub, // Use authenticated user ID
        scenario: scenarioData.scenario,
        topic: scenarioData.topic,
        aiStance: scenarioData.aiStance
      });

      res.json({ conversation });
    } catch (error) {
      console.error("Create conversation error:", error);
      res.status(400).json({ message: "Failed to create conversation" });
    }
  });

  // Get conversation details with messages
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = await storage.getConversationMessages(conversationId);
      const character = await storage.getCharacter(conversation.characterId);

      res.json({ 
        conversation,
        messages,
        character 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Send a message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messageData = insertMessageSchema.parse({
        ...req.body,
        conversationId
      });

      const conversation = await storage.getConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const character = await storage.getCharacter(conversation.characterId);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }

      // Create user message
      const userMessage = await storage.createMessage(messageData);

      // Generate AI response for persuasion game
      const aiResponse = await generateCharacterResponse(
        character.name,
        character.personality,
        character.currentStance || conversation.aiStance,
        character.persuasionResistance || 50,
        messageData.content,
        messageData.tone || "neutral",
        character.language,
        conversation.topic
      );

      // Create AI message with persuasion evaluation
      const aiMessage = await storage.createMessage({
        conversationId,
        sender: "ai",
        content: aiResponse.message,
        originalLanguage: character.language,
        targetLanguage: "en",
        persuasionStrength: aiResponse.persuasionStrength,
        translationAccuracy: aiResponse.translationAccuracy,
        culturalAppropriateness: aiResponse.culturalAppropriateness,
        aiResponse: aiResponse.feedback,
        xpAwarded: aiResponse.xpAwarded
      });

      // Update conversation progress and persuasion score
      const updatedProgress = (conversation.progress || 0) + 1;
      const isCompleted = updatedProgress >= (conversation.totalRounds || 5) || aiResponse.shouldEndConversation;
      
      await storage.updateConversation(conversationId, {
        progress: updatedProgress,
        persuasionScore: (conversation.persuasionScore || 0) + aiResponse.persuasionChange,
        xpEarned: (conversation.xpEarned || 0) + aiResponse.xpAwarded,
        isCompleted
      });

      // Update user XP
      const user = await storage.getUser(conversation.userId);
      if (user) {
        await storage.updateUser(user.id, {
          totalXp: (user.totalXp || 0) + aiResponse.xpAwarded
        });
      }

      // Check for achievements
      if (updatedProgress === 1) {
        // First message achievement
        await storage.createAchievement({
          userId: conversation.userId,
          type: "conversation_starter",
          title: "Conversation Starter!",
          description: `You successfully started your first conversation with ${character.name}!`,
          xpReward: 50
        });
      }

      res.json({ 
        userMessage,
        aiMessage,
        conversation: await storage.getConversation(conversationId),
        shouldEndConversation: aiResponse.shouldEndConversation
      });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Translate text
  app.post("/api/translate", async (req, res) => {
    try {
      const { text, targetLanguage = 'en', sourceLanguage } = req.body;
      
      if (!text) {
        return res.status(400).json({ message: "Text is required" });
      }

      const detectedLang = sourceLanguage || await detectLanguage(text);
      const translation = await translateText(text, targetLanguage, detectedLang);

      res.json({ translation });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ message: "Failed to translate text" });
    }
  });

  // Get user achievements
  app.get("/api/users/:id/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const achievements = await storage.getUserAchievements(userId);
      
      res.json({ achievements });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Get user profile with stats
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const conversations = await storage.getUserConversations(userId);
      const achievements = await storage.getUserAchievements(userId);

      res.json({ 
        user,
        stats: {
          totalConversations: conversations.length,
          completedConversations: conversations.filter(c => c.isCompleted).length,
          totalAchievements: achievements.length
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
