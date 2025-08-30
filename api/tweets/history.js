// In-memory storage for demo purposes (resets on each deployment)
let tweetHistory = [];

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const limit = parseInt(req.query.limit) || 10;
    
    // Return the most recent tweets
    const recentTweets = tweetHistory.slice(-limit).reverse();
    
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
}