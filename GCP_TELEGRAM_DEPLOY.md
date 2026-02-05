# 🚀 Quick GCP Deployment - Telegram Bot

## Fast deployment guide for the Telegram bot (no WhatsApp complexity)

---

## Option 1: Cloud Run (Easiest & Recommended)

### Step 1: Set up GCP Project

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 2: Build & Deploy

```bash
# Navigate to project
cd D:\WORKS\GigRadar

# Build for Telegram only
docker build -f Dockerfile.telegram -t gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest .

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest

# Deploy to Cloud Run
gcloud run deploy mubai-telegram \
  --image gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars TELEGRAM_BOT_TOKEN="YOUR_TOKEN" \
  --set-env-vars OPENAI_API_KEY="YOUR_KEY" \
  --min-instances 1
```

### Cost: ~$15-20/month with min-instances=1

---

## Option 2: Compute Engine (More Control)

### Step 1: Create VM

```bash
gcloud compute instances create-with-container mubai-telegram-vm \
  --container-image gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest \
  --machine-type e2-micro \
  --boot-disk-size 10GB \
  --zone us-central1-a \
  --container-env TELEGRAM_BOT_TOKEN="YOUR_TOKEN" \
  --container-env OPENAI_API_KEY="YOUR_KEY" \
  --container-restart-policy always
```

### Cost: ~$7-10/month (e2-micro)

---

## Quick Test Locally

```powershell
# Test Telegram bot only
npm run start:telegram

# Or with Docker
docker build -f Dockerfile.telegram -t mubai-telegram .
docker run --env-file .env mubai-telegram
```

---

## PowerShell Deployment Script

Create `deploy-telegram.ps1`:

```powershell
# Quick deploy script
$PROJECT_ID = "YOUR_PROJECT_ID"
$REGION = "us-central1"

# Build
docker build -f Dockerfile.telegram -t "gcr.io/$PROJECT_ID/mubai-telegram:latest" .

# Push
docker push "gcr.io/$PROJECT_ID/mubai-telegram:latest"

# Deploy
gcloud run deploy mubai-telegram `
  --image "gcr.io/$PROJECT_ID/mubai-telegram:latest" `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory 512Mi `
  --min-instances 1

# Get URL
$SERVICE_URL = gcloud run services describe mubai-telegram --region $REGION --format 'value(status.url)'
Write-Host "✅ Deployed! Service URL: $SERVICE_URL"
```

---

## Environment Variables

You need:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdef...
OPENAI_API_KEY=sk-proj-...
```

---

## Deployment Checklist

- [ ] GCP project created
- [ ] gcloud CLI installed & authenticated
- [ ] Telegram bot token ready
- [ ] OpenAI API key ready
- [ ] Docker Desktop running (for build)
- [ ] Test locally first
- [ ] Deploy to GCP
- [ ] Test bot on Telegram

---

## After Deployment

1. Find your bot on Telegram
2. Send `/start`
3. Ask questions about MUB Filters
4. Bot responds in English or Indonesian automatically!

---

## Monitoring

```bash
# View logs
gcloud run services logs read mubai-telegram --region us-central1

# Follow logs
gcloud run services logs tail mubai-telegram --region us-central1
```

---

## Update Deployment

```bash
# Build new image
docker build -f Dockerfile.telegram -t gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest .

# Push
docker push gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest

# Cloud Run auto-updates, or force:
gcloud run deploy mubai-telegram \
  --image gcr.io/YOUR_PROJECT_ID/mubai-telegram:latest \
  --region us-central1
```

---

## Simple & Fast! 🚀

No browser automation, no Chrome, no complexity. Just a clean Telegram bot ready for production!

