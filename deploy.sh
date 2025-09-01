#!/bin/bash

echo "🚀 TweetSentient Deployment Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the application
echo "🔨 Building the application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build output directory 'dist' not found"
    exit 1
fi

echo "✅ Build output directory created"

# Check if dist/public directory exists (for static files)
if [ ! -d "dist/public" ]; then
    echo "❌ Static files directory 'dist/public' not found"
    exit 1
fi

echo "✅ Static files directory created"

echo ""
echo "🎉 Your application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to [render.com](https://render.com) and create a new Web Service"
echo "3. Connect your GitHub repository"
echo "4. Set the DATABASE_URL environment variable"
echo "5. Deploy!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
