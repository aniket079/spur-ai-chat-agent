#!/bin/bash

# Quick Start Guide for SwiftCart AI Chat
# This script helps you get started with the full application stack

set -e

echo "🚀 SwiftCart AI Chat - Quick Start"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd backend
echo "Installing backend dependencies..."
npm install --quiet

echo "✅ Backend ready!"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend
echo "Installing frontend dependencies..."
npm install --quiet

echo "Building frontend..."
npm run build

echo "✅ Frontend ready!"
echo ""

# Summary
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo ""
echo "1️⃣  Start PostgreSQL (if not running):"
echo "   docker-compose up -d postgres"
echo ""
echo "2️⃣  Start the Backend (in another terminal):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3️⃣  Start the Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4️⃣  Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "Or use Docker for everything:"
echo "   docker-compose up"
echo ""
