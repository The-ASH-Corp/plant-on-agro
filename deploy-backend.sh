#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🚀 Starting PlantOn AGRO Backend Deployment"
echo "=========================================="

cd /root/plant-on-agro

# Pull latest master branch
echo "📥 [1/4] Pulling latest changes from origin/master..."
git pull origin master

# Install dependencies if package.json changed
cd /root/plant-on-agro/backend
echo "📦 [2/4] Installing backend dependencies..."
npm install

# Compile TypeScript
echo "🔨 [3/4] Compiling TypeScript build..."
npm run build

# Reload PM2 with zero downtime
echo "🔄 [4/4] Reloading PM2 process..."
pm2 reload ecosystem.config.cjs || pm2 start ecosystem.config.cjs
pm2 save

# Verify health status
sleep 2
echo "🩺 Verifying API health check..."
RESPONSE=$(curl -s http://127.0.0.1:5008/api/v1/health)
echo "Health check response: $RESPONSE"

if echo "$RESPONSE" | grep -q '"status":"UP"'; then
  echo "=========================================="
  echo "✅ Deployment Successful & Backend Healthy!"
  echo "=========================================="
  exit 0
else
  echo "=========================================="
  echo "❌ Health check failed after reload!"
  echo "=========================================="
  exit 1
fi

