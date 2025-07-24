import { 
  users, characters, conversations, messages, achievements,
  type User, type InsertUser,
  type Character, type InsertCharacter,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Achievement, type InsertAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Characters
  getCharacters(): Promise<Character[]>;
  getCharacter(id: number): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;

  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getUserConversations(userId: number): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined>;

  // Messages
  getConversationMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  // Achievements
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getCharacters(): Promise<Character[]> {
    return await db.select().from(characters).where(eq(characters.isActive, true));
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    const [character] = await db.select().from(characters).where(eq(characters.id, id));
    return character || undefined;
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const [character] = await db
      .insert(characters)
      .values(insertCharacter)
      .returning();
    return character;
  }

  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return await db.select().from(conversations).where(eq(conversations.userId, userId));
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set(updates)
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.conversationId, conversationId));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private characters: Map<number, Character>;
  private conversations: Map<number, Conversation>;
  private messages: Map<number, Message>;
  private achievements: Map<number, Achievement>;
  private currentUserId: number;
  private currentCharacterId: number;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentAchievementId: number;

  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.achievements = new Map();
    this.currentUserId = 1;
    this.currentCharacterId = 1;
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentAchievementId = 1;

    // Initialize with default data
    this.initializeData();
  }

  private initializeData() {
    // Create a mock user
    this.createUser({
      username: "learner",
      password: "password123"
    });

    // Initialize Ghanaian characters for persuasion game
    const defaultCharacters: InsertCharacter[] = [
      {
        name: "Kwame",
        role: "Traditional Elder",
        location: "Kumasi, Ghana",
        language: "Twi",
        personality: "Wise, traditional, values cultural customs, somewhat skeptical of modern ideas",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Kwame is a respected elder in Kumasi who deeply values Akan traditions. He often has strong opinions about modern vs traditional ways of life.",
        culturalTips: [
          "In Akan culture, respect for elders is paramount",
          "Traditional greetings involve asking about one's health and family",
          "Indirect communication is often preferred to maintain harmony"
        ] as string[],
        persuasionResistance: 70,
        currentStance: "Traditional ways are always better than modern approaches",
        isActive: true,
      },
      {
        name: "Ama",
        role: "University Student",
        location: "Accra, Ghana", 
        language: "Ga",
        personality: "Progressive, open-minded, environmentally conscious, eager to debate",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Ama studies environmental science at the University of Ghana. She's passionate about climate action but sometimes has controversial opinions.",
        culturalTips: [
          "Ga people value directness more than other Ghanaian cultures",
          "Academic discussions are highly valued in university settings",
          "Environmental consciousness is growing among young Ghanaians"
        ] as string[],
        persuasionResistance: 40,
        currentStance: "Technology will solve all environmental problems",
        isActive: true,
      },
      {
        name: "Togbe",
        role: "Chief",
        location: "Ho, Ghana",
        language: "Ewe",
        personality: "Diplomatic, thoughtful, believes in community consensus, moderate views",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Togbe is a traditional chief in the Volta Region who balances modern governance with traditional leadership. He values thoughtful discussion.",
        culturalTips: [
          "Ewe culture emphasizes community decision-making",
          "Chiefs are mediators who seek consensus",
          "Patience and careful listening are highly valued"
        ] as string[],
        persuasionResistance: 55,
        currentStance: "All important decisions should be made by community consensus",
        isActive: true,
      }
    ];

    defaultCharacters.forEach(char => this.createCharacter(char));
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      streak: 0,
      hearts: 5,
      totalXp: 0,
      level: 1,
      avatar: null,
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Characters
  async getCharacters(): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(char => char.isActive);
  }

  async getCharacter(id: number): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = this.currentCharacterId++;
    const character: Character = { 
      ...insertCharacter, 
      id,
      avatar: insertCharacter.avatar || null,
      culturalTips: Array.isArray(insertCharacter.culturalTips) ? insertCharacter.culturalTips : [],
      persuasionResistance: insertCharacter.persuasionResistance || 50,
      currentStance: insertCharacter.currentStance || null,
      isActive: insertCharacter.isActive ?? true
    };
    this.characters.set(id, character);
    return character;
  }

  // Conversations
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getUserConversations(userId: number): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(conv => conv.userId === userId);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const conversation: Conversation = { 
      ...insertConversation, 
      id, 
      progress: 0,
      totalRounds: insertConversation.totalRounds || 5,
      persuasionScore: 0,
      xpEarned: 0,
      isCompleted: false,
      createdAt: new Date() 
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: number, updates: Partial<Conversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;
    
    const updatedConversation = { ...conversation, ...updates };
    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }

  // Messages
  async getConversationMessages(conversationId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(msg => msg.conversationId === conversationId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      translation: insertMessage.translation || null,
      originalLanguage: insertMessage.originalLanguage || null,
      targetLanguage: insertMessage.targetLanguage || null,
      tone: insertMessage.tone || null,
      persuasionStrength: insertMessage.persuasionStrength || null,
      translationAccuracy: insertMessage.translationAccuracy || null,
      culturalAppropriateness: insertMessage.culturalAppropriateness || null,
      aiResponse: insertMessage.aiResponse || null,
      xpAwarded: insertMessage.xpAwarded || 0
    };
    this.messages.set(id, message);
    return message;
  }

  // Achievements
  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(ach => ach.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { 
      ...insertAchievement, 
      id, 
      unlockedAt: new Date(),
      xpReward: insertAchievement.xpReward || 0
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new DatabaseStorage();
