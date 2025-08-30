import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tweets = pgTable("tweets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  prompt: text("prompt").notNull(),
  content: text("content").notNull(),
  style: jsonb("style").$type<{
    tone: "professional" | "autonomous";
    length: "concise" | "expanded";
    includeEmojis: boolean;
  }>().notNull(),
  characterCount: integer("character_count").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTweetSchema = createInsertSchema(tweets).omit({
  id: true,
  createdAt: true,
});

export const tweetStyleSchema = z.object({
  tone: z.enum(["professional", "autonomous"]),
  length: z.enum(["concise", "expanded"]),
  includeEmojis: z.boolean(),
});

export const generateTweetSchema = z.object({
  prompt: z.string().min(1).max(500),
  style: tweetStyleSchema,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTweet = z.infer<typeof insertTweetSchema>;
export type Tweet = typeof tweets.$inferSelect;
export type TweetStyle = z.infer<typeof tweetStyleSchema>;
export type GenerateTweetRequest = z.infer<typeof generateTweetSchema>;
