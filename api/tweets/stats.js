// In-memory stats for demo purposes (resets on each deployment)
let stats = {
  generated: 0,
  copied: 0
};

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
    // Increment generated count if we're fetching stats after generation
    const userAgent = req.headers['user-agent'] || '';
    
    res.json({
      success: true,
      stats: {
        generated: Math.floor(Math.random() * 50) + 10, // Demo stats
        copied: Math.floor(Math.random() * 25) + 5,     // Demo stats
      }
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({
      success: false,
      stats: { generated: 0, copied: 0 }
    });
  }
}