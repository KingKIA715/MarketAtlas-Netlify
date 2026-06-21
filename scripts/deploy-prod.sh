#!/bin/bash
set -e

echo "🚀 Deploying to PRODUCTION..."
read -p "Are you sure? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
  echo "❌ Cancelled."
  exit 0
fi

npm run build
npx netlify deploy --dir=dist --functions=netlify/functions --prod

echo "✅ Production deployed."
