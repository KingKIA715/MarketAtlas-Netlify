#!/bin/bash
set -e

echo "🚀 Deploying preview to Netlify..."

# Build first
npm run build

# Deploy preview
npx netlify deploy --dir=dist --functions=netlify/functions

echo "✅ Preview deployed. Check URL above."
