import { tweets, users, type User, type InsertUser, type Tweet, type InsertTweet } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTweet(tweet: InsertTweet): Promise<Tweet>;
  getTweetsByUser(userId: string, limit?: number): Promise<Tweet[]>;
  getRecentTweets(userId: string, limit?: number): Promise<Tweet[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
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

  async createTweet(insertTweet: InsertTweet): Promise<Tweet> {
    const [tweet] = await db
      .insert(tweets)
      .values(insertTweet)
      .returning();
    return tweet;
  }

  async getTweetsByUser(userId: string, limit = 50): Promise<Tweet[]> {
    return await db
      .select()
      .from(tweets)
      .where(eq(tweets.userId, userId))
      .orderBy(desc(tweets.createdAt))
      .limit(limit);
  }

  async getRecentTweets(userId: string, limit = 10): Promise<Tweet[]> {
    return await db
      .select()
      .from(tweets)
      .where(eq(tweets.userId, userId))
      .orderBy(desc(tweets.createdAt))
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
