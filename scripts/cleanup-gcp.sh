#!/bin/bash

# Cleanup GCP resources

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🗑️  Cleaning up GCP resources...${NC}"
echo ""

read -p "This will delete all MubAI bot resources. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

# Delete Cloud Run service
echo -e "${YELLOW}Deleting Cloud Run service...${NC}"
gcloud run services delete mubai-bot --region us-central1 --quiet || echo "Service not found"

# Delete Compute Engine VM
echo -e "${YELLOW}Deleting Compute Engine VM...${NC}"
gcloud compute instances delete mubai-bot-vm --zone us-central1-a --quiet || echo "VM not found"

# Delete firewall rule
echo -e "${YELLOW}Deleting firewall rule...${NC}"
gcloud compute firewall-rules delete allow-mubai-web --quiet || echo "Firewall rule not found"

# Delete container images
echo -e "${YELLOW}Deleting container images...${NC}"
gcloud container images delete gcr.io/${PROJECT_ID}/mubai-bot:latest --quiet || echo "Image not found"

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"

