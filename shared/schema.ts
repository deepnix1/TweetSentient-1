import { z } from "zod";

// Local storage types (no database tables needed)
export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Tweet {
  id: string;
  userId?: string;
  prompt: string;
  content: string;
  style: TweetStyle;
  characterCount: number;
  createdAt: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface InsertTweet {
  userId?: string;
  prompt: string;
  content: string;
  style: TweetStyle;
  characterCount: number;
}

export const tweetStyleSchema = z.object({
  tone: z.enum(["professional", "autonomous"]),
  length: z.enum(["concise", "expanded"]),
  includeEmojis: z.boolean(),
});

export const generateTweetSchema = z.object({
  prompt: z.string().min(1).max(500),
  style: tweetStyleSchema,
});

export type TweetStyle = z.infer<typeof tweetStyleSchema>;
export type GenerateTweetRequest = z.infer<typeof generateTweetSchema>;
