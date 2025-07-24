import { 
  users, characters, conversations, messages, achievements,
  type User, type InsertUser,
  type Character, type InsertCharacter,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Achievement, type InsertAchievement
} from "@shared/schema";

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

    // Initialize characters
    const defaultCharacters: InsertCharacter[] = [
      {
        name: "Carlos",
        role: "Restaurant Owner",
        location: "Madrid, Spain",
        language: "Spanish",
        personality: "Friendly, passionate about food, patient with learners",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Carlos owns a traditional Spanish restaurant in Madrid. He loves sharing Spanish culture through food and is always eager to help people learn Spanish while they order.",
        culturalTips: [
          "Spaniards typically eat lunch between 2-4 PM and dinner after 9 PM",
          "It's polite to greet the staff when entering a restaurant", 
          "Paella is traditionally from Valencia and comes in many varieties"
        ] as string[],
        isActive: true,
      },
      {
        name: "Marie",
        role: "Café Owner",
        location: "Paris, France",
        language: "French",
        personality: "Sophisticated, artistic, enjoys discussing French culture",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80",
        backgroundContext: "Marie runs a charming café in Montmartre, Paris. She's passionate about French literature and loves introducing visitors to authentic French café culture.",
        culturalTips: [
          "French people often say 'Bonjour' when entering shops",
          "Coffee is typically served after meals, not with them",
          "Tipping is not mandatory but small change is appreciated"
        ] as string[],
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
      totalExchanges: 20,
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
      culturalContext: insertMessage.culturalContext || null,
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

export const storage = new MemStorage();
