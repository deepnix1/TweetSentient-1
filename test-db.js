import { Pool } from '@neondatabase/serverless';

// Replace this with your actual Neon connection string
const DATABASE_URL = process.env.DATABASE_URL || 'your-neon-connection-string-here';

async function testConnection() {
  try {
    console.log('🔌 Testing Neon database connection...');
    
    const pool = new Pool({ connectionString: DATABASE_URL });
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Successfully connected to Neon database!');
    
    // Test simple query
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database query successful:', result.rows[0]);
    
    // Test database version
    const versionResult = await client.query('SELECT version()');
    console.log('✅ Database version:', versionResult.rows[0].version.split(' ')[0]);
    
    client.release();
    await pool.end();
    
    console.log('🎉 Database connection test completed successfully!');
    console.log('Your Neon database is ready for deployment.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if DATABASE_URL is set correctly');
    console.log('2. Verify your Neon database is running');
    console.log('3. Check if your IP is allowed (if using IP restrictions)');
    console.log('4. Ensure the connection string format is correct');
  }
}

testConnection();
