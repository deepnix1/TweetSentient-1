import { SentientAgent } from '../sentientAgent.js';
import { z } from 'zod';

// Tweet style schema for validation
const tweetStyleSchema = z.object({
  tone: z.enum(["professional", "autonomous"]),
  length: z.enum(["concise", "expanded"]),
  includeEmojis: z.boolean(),
});

const generateTweetSchema = z.object({
  prompt: z.string().min(1).max(500),
  style: tweetStyleSchema,
});

const sentientAgent = new SentientAgent();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const result = generateTweetSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid request data" 
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

    res.json({
      success: true,
      tweets: agentResponse.tweets.map((content, index) => ({
        id: `temp-${Date.now()}-${index}`,
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
}