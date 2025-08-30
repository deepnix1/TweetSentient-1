// Sentient Agent Framework - Serverless Function Version
export class SentientAgent {
  constructor() {
    // Sentient Agent Framework - no external API needed
  }

  async generateTweets(prompt, style) {
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

  generateVariations(prompt, style) {
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

  processPrompt(prompt, style, variation) {
    const templates = this.getTweetTemplates(style);
    const baseContent = this.extractKeyPoints(prompt);
    
    // Select template based on variation number
    const template = templates[variation % templates.length];
    
    return this.fillTemplate(template, baseContent, style);
  }

  getTweetTemplates(style) {
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

  extractKeyPoints(prompt) {
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

  identifyTopic(words) {
    const topics = ['ai', 'tech', 'web3', 'blockchain', 'startup', 'business', 'innovation', 'future'];
    const found = words.find(word => topics.includes(word));
    return found || 'general';
  }

  analyzeSentiment(words) {
    const positive = ['great', 'amazing', 'exciting', 'excellent', 'fantastic', 'good'];
    const negative = ['bad', 'terrible', 'awful', 'disappointing', 'poor'];
    
    const hasPositive = words.some(word => positive.includes(word));
    const hasNegative = words.some(word => negative.includes(word));
    
    if (hasPositive && !hasNegative) return 'positive';
    if (hasNegative && !hasPositive) return 'negative';
    return 'neutral';
  }

  fillTemplate(template, content, style) {
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
}