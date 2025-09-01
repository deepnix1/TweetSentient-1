import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sentientAgent } from "./services/sentientAgent";
import { generateTweetSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Generate tweets endpoint
  app.post("/api/tweets/generate", async (req, res) => {
    try {
      const result = generateTweetSchema.safeParse(req.body);
      
      if (!result.success) {
        const error = fromZodError(result.error);
        return res.status(400).json({ 
          success: false, 
          error: error.message 
        });
      }

      const { prompt, style } = result.data;
      
      // Generate tweets using Sentient Agent
      const agentResponse = await sentientAgent.generateTweets(prompt, style);
      
      if (!agentResponse.success) {
        return res.status(500).json({
          success: false,
          error: agentResponse.error || "Failed to generate tweets"
        });
      }

      // Store tweets in local storage (using a mock user for now)
      const mockUserId = "demo-user-id";
      const savedTweets: any[] = [];
      
      for (const tweetContent of agentResponse.tweets) {
        try {
          const tweetId = `tweet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const tweetData = {
            id: tweetId,
            userId: mockUserId,
            prompt,
            content: tweetContent,
            style,
            characterCount: tweetContent.length,
            createdAt: new Date().toISOString(),
            sentiment: 'neutral' // Default sentiment
          };
          
          await storage.set(tweetId, tweetData);
          savedTweets.push(tweetData);
        } catch (error) {
          console.error("Failed to save tweet:", error);
          // Continue with other tweets even if one fails to save
        }
      }

      res.json({
        success: true,
        tweets: agentResponse.tweets.map((content, index) => ({
          id: savedTweets[index]?.id || `temp-${index}`,
          content,
          characterCount: content.length,
          style,
          createdAt: new Date().toISOString(),
        }))
      });

    } catch (error) {
      console.error("Tweet generation error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error during tweet generation"
      });
    }
  });

  // Get recent tweets for history
  app.get("/api/tweets/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Get all tweets and sort by creation date
      const allTweets = await storage.getAllTweets();
      const recentTweets = allTweets
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
      
      res.json({
        success: true,
        tweets: recentTweets
      });
    } catch (error) {
      console.error("Failed to fetch tweet history:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch tweet history"
      });
    }
  });

  // Get generation stats
  app.get("/api/tweets/stats", async (req, res) => {
    try {
      const allTweets = await storage.getAllTweets();
      
      res.json({
        success: true,
        stats: {
          generated: allTweets.length,
          copied: Math.floor(allTweets.length * 0.3), // Mock copied count
        }
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      res.status(500).json({
        success: false,
        stats: { generated: 0, copied: 0 }
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
