# Deployment Guide for Render

This guide will help you deploy your TweetSentient project to Render.

## Prerequisites

1. A Render account (sign up at [render.com](https://render.com))
2. A Neon database (PostgreSQL) - you can create one at [neon.tech](https://neon.tech)

## Step 1: Prepare Your Database

1. Create a Neon database at [neon.tech](https://neon.tech)
2. Get your database connection string from the Neon dashboard
3. The connection string should look like: `postgresql://username:password@host:port/database`

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. Push your code to GitHub (if not already done)
2. In Render dashboard, click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Set the `DATABASE_URL` environment variable with your Neon database connection string
6. Click "Create New Resources"

### Option B: Manual Setup

1. In Render dashboard, click "New +" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `tweetsentient` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (or your preferred plan)

4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon database connection string

5. Click "Create Web Service"

## Step 3: Environment Variables

Make sure to set these environment variables in Render:

- `NODE_ENV`: `production`
- `DATABASE_URL`: Your Neon database connection string from Step 1

## Step 4: Database Setup

After deployment, you may need to run database migrations:

1. In Render dashboard, go to your service
2. Click on "Shell" tab
3. Run: `npm run db:push`

## Step 5: Verify Deployment

1. Wait for the build to complete
2. Click on your service URL to verify it's working
3. Check the logs for any errors

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **Port Issues**: Render automatically sets the `PORT` environment variable
4. **Memory Issues**: Consider upgrading to a higher plan if you encounter memory limits

### Logs:

- Check the logs in Render dashboard under your service
- Look for any error messages during build or runtime

## Support

If you encounter issues:
1. Check the Render documentation
2. Review the service logs
3. Ensure all environment variables are set correctly
4. Verify your database is accessible from Render's servers
