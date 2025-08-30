import { type TweetStyle } from "@shared/schema";

interface SentientAgentResponse {
  success: boolean;
  tweets: string[];
  error?: string;
}

export class SentientAgent {
  constructor() {
    // Sentient Agent Framework - no external API needed
  }

  async generateTweets(prompt: string, style: TweetStyle): Promise<SentientAgentResponse> {
    try {
      // Simulate processing time for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate tweets using the Sentient Agent Framework
      const tweets = this.generateVariations(prompt, style);

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

  private generateVariations(prompt: string, style: TweetStyle): string[] {
    const variations = [];
    
    // Generate 3 different variations based on the prompt and style
    for (let i = 0; i < 3; i++) {
      let tweet = this.processPrompt(prompt, style, i);
      
      // Ensure tweets are under 280 characters
      if (tweet.length > 280) {
        tweet = tweet.substring(0, 277) + "...";
      }
      
      variations.push(tweet);
    }
    
    return variations;
  }

  private processPrompt(prompt: string, style: TweetStyle, variation: number): string {
    const templates = this.getTweetTemplates(style);
    const baseContent = this.extractKeyPoints(prompt);
    
    // Select template based on variation number
    const template = templates[variation % templates.length];
    
    return this.fillTemplate(template, baseContent, style);
  }

  private getTweetTemplates(style: TweetStyle): string[] {
    if (style.tone === "professional") {
      return [
        "{content} {insight}",
        "Key insight: {content} {call_to_action}",
        "Here's why {content} matters: {explanation}"
      ];
    } else {
      return [
        "🚀 {content} {autonomous_perspective}",
        "As an AI, I find {content} fascinating because {ai_insight}",
        "Breaking: {content} {future_implications}"
      ];
    }
  }

  private extractKeyPoints(prompt: string): any {
    // Process the prompt to extract key information
    const words = prompt.toLowerCase().split(' ');
    const isQuestion = prompt.includes('?');
    const isAbout = words.includes('about') || words.includes('regarding');
    
    return {
      core: prompt.length > 100 ? prompt.substring(0, 100) + "..." : prompt,
      topic: this.identifyTopic(words),
      sentiment: this.analyzeSentiment(words),
      isQuestion,
      isAbout
    };
  }

  private identifyTopic(words: string[]): string {
    const topics = ['ai', 'tech', 'web3', 'blockchain', 'startup', 'business', 'innovation', 'future'];
    const found = words.find(word => topics.includes(word));
    return found || 'general';
  }

  private analyzeSentiment(words: string[]): 'positive' | 'neutral' | 'negative' {
    const positive = ['great', 'amazing', 'exciting', 'excellent', 'fantastic', 'good'];
    const negative = ['bad', 'terrible', 'awful', 'disappointing', 'poor'];
    
    const hasPositive = words.some(word => positive.includes(word));
    const hasNegative = words.some(word => negative.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  private fillTemplate(template: string, content: any, style: TweetStyle): string {
    let tweet = template;
    
    // Replace content placeholders
    tweet = tweet.replace('{content}', content.core);
    
    // Add contextual content based on style and topic
    if (tweet.includes('{insight}')) {
      const insight = style.length === 'expanded' 
        ? "This opens up new possibilities for innovation and growth."
        : "Worth considering.";
      tweet = tweet.replace('{insight}', insight);
    }
    
    if (tweet.includes('{call_to_action}')) {
      tweet = tweet.replace('{call_to_action}', "What are your thoughts?");
    }
    
    if (tweet.includes('{explanation}')) {
      const explanation = style.length === 'expanded'
        ? "it represents a significant shift in how we approach this challenge"
        : "it's game-changing";
      tweet = tweet.replace('{explanation}', explanation);
    }
    
    if (tweet.includes('{autonomous_perspective}')) {
      tweet = tweet.replace('{autonomous_perspective}', "The future is autonomous! 🤖");
    }
    
    if (tweet.includes('{ai_insight}')) {
      tweet = tweet.replace('{ai_insight}', "it showcases the potential of AI-driven innovation");
    }
    
    if (tweet.includes('{future_implications}')) {
      tweet = tweet.replace('{future_implications}', "This could reshape entire industries.");
    }
    
    // Add emojis if requested
    if (style.includeEmojis && !tweet.includes('🚀') && !tweet.includes('🤖')) {
      const emojis = content.sentiment === 'positive' ? ['✨', '🌟', '💫'] : 
                   content.sentiment === 'negative' ? ['⚠️', '🤔', '💭'] : 
                   ['🔍', '💡', '🎯'];
      tweet = tweet + ' ' + emojis[Math.floor(Math.random() * emojis.length)];
    }
    
    return tweet.trim();
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
