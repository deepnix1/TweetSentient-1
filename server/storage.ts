import { type User, type InsertUser, type Tweet, type InsertTweet } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTweet(tweet: InsertTweet): Promise<Tweet>;
  getTweetsByUser(userId: string, limit?: number): Promise<Tweet[]>;
  getRecentTweets(userId: string, limit?: number): Promise<Tweet[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private tweets: Map<string, Tweet> = new Map();
  private userIdCounter = 1;
  private tweetIdCounter = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const [_, user] of this.users) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `user-${this.userIdCounter++}`;
    const user: User = {
      id,
      ...insertUser,
    };
    this.users.set(id, user);
    return user;
  }

  async createTweet(insertTweet: InsertTweet): Promise<Tweet> {
    const id = `tweet-${this.tweetIdCounter++}`;
    const tweet: Tweet = {
      id,
      userId: insertTweet.userId || null,
      prompt: insertTweet.prompt,
      content: insertTweet.content,
      style: insertTweet.style,
      characterCount: insertTweet.characterCount,
      createdAt: new Date(),
    };
    this.tweets.set(id, tweet);
    return tweet;
  }

  async getTweetsByUser(userId: string, limit = 50): Promise<Tweet[]> {
    const userTweets = Array.from(this.tweets.values())
      .filter(tweet => tweet.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
    return userTweets;
  }

  async getRecentTweets(userId: string, limit = 10): Promise<Tweet[]> {
    return this.getTweetsByUser(userId, limit);
  }
}

export const storage = new MemStorage();
