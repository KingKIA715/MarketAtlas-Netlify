#!/bin/bash
set -e

echo "🔍 Validating build..."

# Check dist exists
if [ ! -d "dist" ]; then
  echo "❌ dist/ not found. Run npm run build first."
  exit 1
fi

# Check critical files
for f in "dist/index.html" "dist/_next/static" "netlify/functions/api.ts" "netlify/functions/health.ts"; do
  if [ ! -e "$f" ]; then
    echo "❌ Missing: $f"
    exit 1
  fi
done

# Check env vars
if [ ! -f .env ]; then
  echo "⚠️  .env not found. API keys may be missing."
fi

echo "✅ Validation passed."
