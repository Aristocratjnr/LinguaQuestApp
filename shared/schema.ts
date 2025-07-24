import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with Replit Auth support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Changed to varchar for Replit Auth
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").unique(), // Optional username
  streak: integer("streak").default(0),
  hearts: integer("hearts").default(5),
  totalXp: integer("total_xp").default(0),
  level: integer("level").default(1),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const characters = pgTable("characters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  location: text("location").notNull(),
  language: text("language").notNull(),
  personality: text("personality").notNull(),
  avatar: text("avatar"),
  backgroundContext: text("background_context").notNull(),
  culturalTips: jsonb("cultural_tips").$type<string[]>().default([]),
  persuasionResistance: integer("persuasion_resistance").default(50), // 1-100 how hard to convince
  currentStance: text("current_stance"), // their current opinion on topics
  isActive: boolean("is_active").default(true),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  characterId: integer("character_id").references(() => characters.id).notNull(),
  title: text("title").notNull(),
  scenario: text("scenario").notNull(),
  topic: text("topic").notNull(), // the topic being debated
  aiStance: text("ai_stance").notNull(), // AI's initial position
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  progress: integer("progress").default(0),
  totalRounds: integer("total_rounds").default(5),
  persuasionScore: integer("persuasion_score").default(0), // how much AI was convinced
  xpEarned: integer("xp_earned").default(0),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  sender: text("sender").notNull(), // 'user' or 'ai'
  content: text("content").notNull(),
  translation: text("translation"),
  originalLanguage: text("original_language"), // language user wrote in
  targetLanguage: text("target_language"), // language it was translated to
  tone: text("tone"), // polite, passionate, formal, etc.
  persuasionStrength: integer("persuasion_strength"), // 1-100 how convincing
  translationAccuracy: integer("translation_accuracy"), // 1-100 how accurate
  culturalAppropriateness: integer("cultural_appropriateness"), // 1-100
  aiResponse: text("ai_response"), // AI's evaluation/feedback
  xpAwarded: integer("xp_awarded").default(0),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'conversation_starter', 'cultural_expert', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").default(0),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  progress: true,
  persuasionScore: true,
  xpEarned: true,
  isCompleted: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

// Authentication types for Replit Auth
export type UpsertUser = typeof users.$inferInsert;

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
