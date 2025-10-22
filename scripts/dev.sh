#!/bin/bash

# Development setup script
echo "🐳 Starting Ubuntu Project Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start development environment
echo "📦 Starting PostgreSQL and Backend..."
docker-compose -f docker-compose.dev.yml up --build

echo "✅ Development environment started!"
echo "🌐 Backend API: http://localhost:3001"
echo "🗄️  PostgreSQL: localhost:5432"
echo "📊 pgAdmin: http://localhost:5050 (admin@ubuntu-project.com / admin)"