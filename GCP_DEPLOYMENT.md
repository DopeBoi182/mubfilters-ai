# Google Cloud Platform Deployment Guide

Complete guide to deploy MubAI Bot on Google Cloud Platform with Docker.

## Prerequisites

- Google Cloud Platform account
- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed
- Docker installed locally (for testing)
- Project created in GCP

## Deployment Options

### Option 1: Cloud Run (Recommended - Serverless)
- ✅ Automatic scaling
- ✅ Pay per use
- ✅ Easy deployment
- ⚠️ May have cold starts

### Option 2: Compute Engine (VM)
- ✅ Always-on
- ✅ More control
- ✅ Better for long-running bots
- ⚠️ Fixed cost

---

## Option 1: Deploy to Cloud Run (Recommended)

### Step 1: Prepare Your Project

```bash
# Set your GCP project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Step 2: Build and Push Docker Image

```bash
# Navigate to project directory
cd GigRadar

# Build the image
docker build -t gcr.io/YOUR_PROJECT_ID/mubai-bot:latest .

# Test locally (optional)
docker run -p 3000:3000 --env-file .env gcr.io/YOUR_PROJECT_ID/mubai-bot:latest

# Push to Google Container Registry
docker push gcr.io/YOUR_PROJECT_ID/mubai-bot:latest
```

### Step 3: Deploy to Cloud Run

```bash
# Deploy with environment variables
gcloud run deploy mubai-bot \
  --image gcr.io/YOUR_PROJECT_ID/mubai-bot:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --cpu 1 \
  --timeout 3600 \
  --set-env-vars TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_TOKEN" \
  --set-env-vars OPENAI_API_KEY="YOUR_OPENAI_KEY" \
  --min-instances 1 \
  --max-instances 1
```

**Important Notes for Cloud Run:**
- Set `--min-instances 1` to keep the container warm (prevents cold starts)
- WhatsApp session persistence requires persistent storage (see Volume Mounting below)

### Step 4: Access Your Bot

```bash
# Get the service URL
gcloud run services describe mubai-bot --region us-central1 --format 'value(status.url)'

# Your QR code will be at: https://YOUR-SERVICE-URL/
```

---

## Option 2: Deploy to Compute Engine (VM)

### Step 1: Create a VM Instance

```bash
# Create VM with Container-Optimized OS
gcloud compute instances create-with-container mubai-bot-vm \
  --container-image gcr.io/YOUR_PROJECT_ID/mubai-bot:latest \
  --machine-type e2-medium \
  --boot-disk-size 20GB \
  --zone us-central1-a \
  --tags http-server,https-server \
  --container-env TELEGRAM_BOT_TOKEN="YOUR_TELEGRAM_TOKEN" \
  --container-env OPENAI_API_KEY="YOUR_OPENAI_KEY" \
  --container-restart-policy always \
  --container-mount-host-path mount-path=/app/tokens,host-path=/home/tokens,mode=rw
```

### Step 2: Configure Firewall

```bash
# Allow traffic on port 3000
gcloud compute firewall-rules create allow-mubai-web \
  --allow tcp:3000 \
  --target-tags http-server \
  --description "Allow incoming traffic on port 3000"
```

### Step 3: Get VM IP Address

```bash
# Get external IP
gcloud compute instances describe mubai-bot-vm \
  --zone us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'

# Access your bot at: http://YOUR_VM_IP:3000
```

---

## Persistent Session Storage

### For Cloud Run (Using Google Cloud Storage)

Since Cloud Run is stateless, you need to store WhatsApp sessions in Cloud Storage:

1. Create a bucket:
```bash
gcloud storage buckets create gs://YOUR_PROJECT_ID-mubai-sessions \
  --location=us-central1
```

2. Update your code to sync sessions with GCS (requires modification)

### For Compute Engine (Using Persistent Disk)

Sessions are automatically persisted on the VM's disk. To add more storage:

```bash
# Create a persistent disk
gcloud compute disks create mubai-data \
  --size 10GB \
  --zone us-central1-a

# Attach to VM
gcloud compute instances attach-disk mubai-bot-vm \
  --disk mubai-data \
  --zone us-central1-a
```

---

## Using Docker Compose (Local or VM)

### Step 1: Create .env File

```bash
# Copy example
cat > .env << 'EOF'
TELEGRAM_BOT_TOKEN=your_telegram_token_here
OPENAI_API_KEY=your_openai_key_here
EOF
```

### Step 2: Build and Run

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Telegram bot token from BotFather | `123456789:ABCdef...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `NODE_ENV` | Environment (production/development) | `production` |

---

## Monitoring and Logs

### Cloud Run Logs

```bash
# View logs
gcloud run services logs read mubai-bot --region us-central1

# Follow logs
gcloud run services logs tail mubai-bot --region us-central1
```

### Compute Engine Logs

```bash
# SSH into VM
gcloud compute ssh mubai-bot-vm --zone us-central1-a

# View Docker logs
sudo docker logs -f $(sudo docker ps -q)
```

---

## Cost Estimation

### Cloud Run (Always-on with min-instances=1)
- Memory: 2GB
- CPU: 1 vCPU
- **Estimated cost**: ~$50-70/month

### Compute Engine (e2-medium)
- vCPUs: 2
- Memory: 4GB
- **Estimated cost**: ~$30-40/month

💡 **Recommendation**: Use Compute Engine for cost-effectiveness with always-on bots.

---

## Troubleshooting

### Chrome/Puppeteer Issues

If venom-bot can't find Chrome:

```bash
# Add to Dockerfile
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
ENV CHROME_BIN=/usr/bin/google-chrome-stable
```

### Memory Issues

Increase memory allocation:

```bash
# Cloud Run
gcloud run services update mubai-bot \
  --memory 4Gi \
  --region us-central1

# Compute Engine (change machine type)
gcloud compute instances set-machine-type mubai-bot-vm \
  --machine-type e2-standard-2 \
  --zone us-central1-a
```

### Session Persistence Issues

Verify volume mounts:

```bash
# Check mounted volumes
docker inspect $(docker ps -q) | grep -A 10 Mounts
```

---

## Security Best Practices

### 1. Use Secret Manager

```bash
# Create secrets
echo "your_telegram_token" | gcloud secrets create telegram-bot-token --data-file=-
echo "your_openai_key" | gcloud secrets create openai-api-key --data-file=-

# Grant access
gcloud secrets add-iam-policy-binding telegram-bot-token \
  --member serviceAccount:YOUR_SERVICE_ACCOUNT \
  --role roles/secretmanager.secretAccessor
```

### 2. Restrict Network Access

```bash
# Allow only specific IPs
gcloud compute firewall-rules create allow-mubai-restricted \
  --allow tcp:3000 \
  --source-ranges YOUR_IP/32 \
  --target-tags http-server
```

### 3. Enable HTTPS

For Cloud Run, HTTPS is automatic. For Compute Engine:

```bash
# Use Cloud Load Balancer with SSL certificate
# Or use Cloudflare for SSL termination
```

---

## CI/CD with Cloud Build

Create `cloudbuild.yaml`:

```yaml
steps:
  # Build the image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/mubai-bot:$SHORT_SHA', '.']
  
  # Push to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mubai-bot:$SHORT_SHA']
  
  # Deploy to Cloud Run
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - 'mubai-bot'
      - '--image=gcr.io/$PROJECT_ID/mubai-bot:$SHORT_SHA'
      - '--region=us-central1'
      - '--platform=managed'

images:
  - 'gcr.io/$PROJECT_ID/mubai-bot:$SHORT_SHA'
```

Deploy:

```bash
gcloud builds submit --config cloudbuild.yaml
```

---

## Quick Start Commands

### Local Testing

```bash
# Build
docker build -t mubai-bot .

# Run
docker run -p 3000:3000 --env-file .env mubai-bot

# Access
open http://localhost:3000
```

### Deploy to GCP (Quick)

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Build and push
docker build -t gcr.io/YOUR_PROJECT_ID/mubai-bot:latest .
docker push gcr.io/YOUR_PROJECT_ID/mubai-bot:latest

# Deploy to Cloud Run
gcloud run deploy mubai-bot \
  --image gcr.io/YOUR_PROJECT_ID/mubai-bot:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 2Gi \
  --min-instances 1
```

---

## Support

For issues:
1. Check logs in GCP Console
2. Verify environment variables
3. Test locally with Docker first
4. Check WhatsApp Web status

---

## Next Steps

1. ✅ Test locally with Docker
2. ✅ Deploy to GCP
3. ✅ Scan WhatsApp QR code at your service URL
4. ✅ Monitor logs
5. ✅ Set up automatic backups for sessions

**Your bot is now running in the cloud!** 🚀

