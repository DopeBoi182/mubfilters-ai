#!/bin/bash

# MubAI Bot - GCP Deployment Script
# Usage: ./scripts/deploy-gcp.sh [cloud-run|compute-engine]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      MubAI Bot - GCP Deployment Script           ║${NC}"
echo -e "${GREEN}╔════════════════════════════════════════════════════╗${NC}"
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI not found. Please install it first.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get GCP project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Using project: ${PROJECT_ID}${NC}"
echo ""

# Get deployment type
DEPLOY_TYPE=${1:-cloud-run}

if [ "$DEPLOY_TYPE" != "cloud-run" ] && [ "$DEPLOY_TYPE" != "compute-engine" ]; then
    echo -e "${RED}❌ Invalid deployment type. Use: cloud-run or compute-engine${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t gcr.io/${PROJECT_ID}/mubai-bot:latest .

echo -e "${YELLOW}☁️  Pushing to Google Container Registry...${NC}"
docker push gcr.io/${PROJECT_ID}/mubai-bot:latest

if [ "$DEPLOY_TYPE" = "cloud-run" ]; then
    echo -e "${YELLOW}🚀 Deploying to Cloud Run...${NC}"
    
    gcloud run deploy mubai-bot \
      --image gcr.io/${PROJECT_ID}/mubai-bot:latest \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated \
      --port 3000 \
      --memory 2Gi \
      --cpu 1 \
      --timeout 3600 \
      --min-instances 1 \
      --max-instances 1
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe mubai-bot --region us-central1 --format 'value(status.url)')
    
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your bot is running at: ${SERVICE_URL}${NC}"
    echo -e "${GREEN}📱 QR Code available at: ${SERVICE_URL}${NC}"
    
elif [ "$DEPLOY_TYPE" = "compute-engine" ]; then
    echo -e "${YELLOW}🖥️  Deploying to Compute Engine...${NC}"
    
    gcloud compute instances create-with-container mubai-bot-vm \
      --container-image gcr.io/${PROJECT_ID}/mubai-bot:latest \
      --machine-type e2-medium \
      --boot-disk-size 20GB \
      --zone us-central1-a \
      --tags http-server,https-server \
      --container-restart-policy always
    
    # Configure firewall
    gcloud compute firewall-rules create allow-mubai-web \
      --allow tcp:3000 \
      --target-tags http-server \
      --description "Allow incoming traffic on port 3000" \
      || echo "Firewall rule already exists"
    
    # Get VM IP
    VM_IP=$(gcloud compute instances describe mubai-bot-vm \
      --zone us-central1-a \
      --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
    
    echo ""
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your bot is running at: http://${VM_IP}:3000${NC}"
    echo -e "${GREEN}📱 QR Code available at: http://${VM_IP}:3000${NC}"
fi

echo ""
echo -e "${YELLOW}⏳ Note: It may take 1-2 minutes for the service to fully start.${NC}"
echo -e "${GREEN}📝 Check logs with: gcloud logging read \"resource.type=cloud_run_revision AND resource.labels.service_name=mubai-bot\" --limit 50${NC}"
echo ""

