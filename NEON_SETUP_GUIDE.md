# 🗄️ Neon Database Setup Guide for TweetSentient

This guide will walk you through setting up a Neon PostgreSQL database for your TweetSentient project deployment on Render.

## 🚀 **Step 1: Create Neon Account**

1. **Visit [neon.tech](https://neon.tech)**
2. **Click "Sign Up" or "Get Started"**
3. **Choose signup method**:
   - **GitHub** (recommended for developers)
   - **Email** (traditional signup)

## 🏗️ **Step 2: Create Your Database Project**

1. **Click "Create Project"**
2. **Project Configuration**:
   - **Project Name**: `tweetsentient` (or your preferred name)
   - **Region**: Choose closest to your Render deployment region
     - **US East (N. Virginia)** - Good for US deployments
     - **US West (Oregon)** - Good for US West Coast
     - **Europe (Frankfurt)** - Good for European deployments
     - **Asia Pacific (Singapore)** - Good for Asia deployments
   
3. **Compute & Storage**:
   - **Free Tier**: 0.5 CPU, 1GB RAM, 3GB storage
   - **Pro Tier**: 1-8 CPU, 2-16GB RAM, 10GB+ storage (paid)

4. **Click "Create Project"**

## 🔐 **Step 3: Database Configuration**

1. **Database Settings** (usually auto-generated):
   - **Database Name**: `tweetsentient` (or leave default)
   - **User**: `tweetsentient_user` (or leave default)
   - **Password**: Generate a strong password (save this!)

2. **Security Settings**:
   - **IP Restrictions**: Leave as "Allow all" for now
   - **SSL**: Always enabled (required)

## 🔗 **Step 4: Get Your Connection String**

1. **In your project dashboard, find "Connection Details"**
2. **Copy the connection string** - it looks like:
   ```
   postgresql://username:password@hostname/database?sslmode=require
   ```

3. **Save this connection string securely** - you'll need it for Render

## 🧪 **Step 5: Test Your Connection**

### **Option A: Use the Test Script**
1. **Set your DATABASE_URL**:
   ```bash
   $env:DATABASE_URL="your-neon-connection-string-here"
   ```

2. **Run the test script**:
   ```bash
   node test-db.js
   ```

### **Option B: Test with Drizzle**
1. **Set your DATABASE_URL**:
   ```bash
   $env:DATABASE_URL="your-neon-connection-string-here"
   ```

2. **Test database connection**:
   ```bash
   npm run db:push
   ```

## 🚨 **Important Security Notes**

1. **Never commit your DATABASE_URL to Git**
2. **Use environment variables in Render**
3. **Consider IP restrictions for production**
4. **Regularly rotate database passwords**

## 🔧 **Connection String Format**

Your Neon connection string should look like this:
```
postgresql://username:password@ep-something.region.aws.neon.tech/database?sslmode=require
```

**Components**:
- `username`: Your database user
- `password`: Your database password
- `ep-something.region.aws.neon.tech`: Neon's serverless endpoint
- `database`: Your database name
- `?sslmode=require`: SSL requirement (always included)

## 📊 **Neon Dashboard Features**

1. **SQL Editor**: Run queries directly in browser
2. **Connection Pooling**: Monitor active connections
3. **Logs**: View database activity
4. **Metrics**: Monitor performance
5. **Backups**: Automatic daily backups

## 🚀 **Next Steps After Neon Setup**

1. **Copy your connection string**
2. **Deploy to Render** (Web Service)
3. **Set DATABASE_URL environment variable**
4. **Run database migrations** (if needed)

## 🔍 **Troubleshooting Common Issues**

### **Connection Refused**
- Check if database is running
- Verify connection string format
- Ensure SSL is enabled

### **Authentication Failed**
- Verify username/password
- Check if user has proper permissions
- Ensure database exists

### **SSL Connection Required**
- Add `?sslmode=require` to connection string
- Neon requires SSL for security

## 📚 **Useful Neon Commands**

```sql
-- Check database version
SELECT version();

-- List all databases
SELECT datname FROM pg_database;

-- Check current user
SELECT current_user;

-- Check connection info
SELECT inet_server_addr(), inet_server_port();
```

## 🎯 **For Render Deployment**

Once your Neon database is set up:

1. **Copy the connection string**
2. **In Render dashboard, add environment variable**:
   - **Key**: `DATABASE_URL`
   - **Value**: Your Neon connection string
3. **Deploy your service**

---

🎉 **Your Neon database will be ready for TweetSentient deployment!**

## 📞 **Need Help?**

- **Neon Documentation**: [docs.neon.tech](https://docs.neon.tech)
- **Neon Community**: [community.neon.tech](https://community.neon.tech)
- **Support**: Available in Neon dashboard
