#!/bin/bash

# Test Docker build and run locally before deploying to GCP

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         MubAI Bot - Local Docker Test            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cat > .env << 'EOF'
TELEGRAM_BOT_TOKEN=your_telegram_token_here
OPENAI_API_KEY=your_openai_key_here
EOF
    echo -e "${YELLOW}⚠️  Please edit .env with your actual credentials${NC}"
    exit 1
fi

echo -e "${YELLOW}🔨 Building Docker image...${NC}"
docker build -t mubai-bot:test .

echo -e "${GREEN}✓ Build successful!${NC}"
echo ""

echo -e "${YELLOW}🚀 Starting container...${NC}"
docker run -d \
  --name mubai-bot-test \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/tokens:/app/tokens \
  -v $(pwd)/downloads:/app/downloads \
  mubai-bot:test

echo ""
echo -e "${GREEN}✅ Container started!${NC}"
echo -e "${GREEN}🌐 Access at: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}📝 Useful commands:${NC}"
echo "  View logs:    docker logs -f mubai-bot-test"
echo "  Stop:         docker stop mubai-bot-test"
echo "  Remove:       docker rm -f mubai-bot-test"
echo "  Shell access: docker exec -it mubai-bot-test /bin/bash"
echo ""

# Follow logs
echo -e "${YELLOW}📋 Following logs (Ctrl+C to exit)...${NC}"
docker logs -f mubai-bot-test

