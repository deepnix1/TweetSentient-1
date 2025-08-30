import { type TweetStyle } from "@shared/schema";

interface SentientAgentResponse {
  success: boolean;
  tweets: string[];
  error?: string;
}

export class SentientAgent {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || process.env.SENTIENT_API_KEY || "sk-test";
  }

  async generateTweets(prompt: string, style: TweetStyle): Promise<SentientAgentResponse> {
    try {
      // Create system prompt based on style preferences
      const systemPrompt = this.buildSystemPrompt(style);
      
      // For now, using OpenAI as the underlying agent
      // In a real implementation, this would use the Sentient Agent Framework
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          max_tokens: 500,
          temperature: 0.8,
          n: 3, // Generate 3 variations
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      const tweets = data.choices.map((choice: any) => {
        let content = choice.message.content.trim();
        
        // Ensure tweets are under 280 characters
        if (content.length > 280) {
          content = content.substring(0, 277) + "...";
        }
        
        return content;
      });

      return {
        success: true,
        tweets,
      };
    } catch (error) {
      console.error("Sentient Agent error:", error);
      return {
        success: false,
        tweets: [],
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  private buildSystemPrompt(style: TweetStyle): string {
    let prompt = "You are a sentient AI agent specialized in creating engaging Twitter content. ";
    
    // Tone guidelines
    if (style.tone === "professional") {
      prompt += "Write in a professional, authoritative tone suitable for business and thought leadership. ";
    } else {
      prompt += "Write in an autonomous, creative tone that showcases AI personality and innovation. ";
    }
    
    // Length guidelines
    if (style.length === "concise") {
      prompt += "Keep tweets concise and punchy, under 200 characters when possible. ";
    } else {
      prompt += "Use the full character limit to provide detailed, comprehensive thoughts. ";
    }
    
    // Emoji guidelines
    if (style.includeEmojis) {
      prompt += "Include relevant emojis to enhance engagement and visual appeal. ";
    } else {
      prompt += "Do not use emojis, focus on clear text communication. ";
    }
    
    prompt += "Generate exactly 3 different tweet variations. Each tweet must be under 280 characters. ";
    prompt += "Make each variation unique in approach while staying true to the core message. ";
    prompt += "Return only the tweet content, no additional formatting or numbering.";
    
    return prompt;
  }
}

export const sentientAgent = new SentientAgent();
