#!/bin/bash
set -e

echo "🔧 MarketAtlas Setup"

# Check Node version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 20 ]; then
  echo "❌ Node 20+ required. Current: $(node -v)"
  exit 1
fi

echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

echo "📝 Creating .env from template..."
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ .env created. Edit it with your API keys."
else
  echo "⚠️  .env already exists. Skipping."
fi

echo "🔍 Running type check..."
npx tsc --noEmit

echo "🧪 Running tests..."
npm run test -- --run

echo "🏗️  Building..."
npm run build

echo "✅ Setup complete. Run: npm run dev"
