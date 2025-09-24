#!/bin/bash

echo "🚀 Starting API Data Fetcher..."
echo "📍 Base URL: http://103.161.119.206:25087"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed! Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies!"
        exit 1
    fi
fi

echo "🔄 Running data fetcher..."
node fetchData.js

echo ""
echo "✅ Data fetching completed!"
echo "📁 Check the JSON files: health.json, leaderboards.json, players.json, skills.json"
echo ""

