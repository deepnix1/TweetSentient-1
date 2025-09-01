@echo off
echo 🚀 TweetSentient Deployment Script
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

REM Build the application
echo 🔨 Building the application...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo ✅ Build completed successfully

REM Check if dist directory exists
if not exist "dist" (
    echo ❌ Build output directory 'dist' not found
    pause
    exit /b 1
)

echo ✅ Build output directory created

REM Check if dist/public directory exists (for static files)
if not exist "dist\public" (
    echo ❌ Static files directory 'dist\public' not found
    pause
    exit /b 1
)

echo ✅ Static files directory created

echo.
echo 🎉 Your application is ready for deployment!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Go to render.com and create a new Web Service
echo 3. Connect your GitHub repository
echo 4. Set the DATABASE_URL environment variable
echo 5. Deploy!
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
pause
