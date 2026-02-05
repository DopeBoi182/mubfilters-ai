# Docker Quick Start Guide

## Test Locally (Before GCP)

### Windows (PowerShell)

```powershell
# Test the Docker build
.\scripts\test-docker.ps1

# Or manually
docker build -t mubai-bot .
docker run -p 3000:3000 --env-file .env mubai-bot

# Access at http://localhost:3000
```

### Linux/Mac (Bash)

```bash
# Test the Docker build
chmod +x scripts/test-docker.sh
./scripts/test-docker.sh

# Or manually
docker build -t mubai-bot .
docker run -p 3000:3000 --env-file .env mubai-bot

# Access at http://localhost:3000
```

---

## Deploy to Google Cloud Platform

### Option 1: Cloud Run (Serverless)

**Windows:**
```powershell
.\scripts\deploy-gcp.ps1 -DeployType CloudRun
```

**Linux/Mac:**
```bash
chmod +x scripts/deploy-gcp.sh
./scripts/deploy-gcp.sh cloud-run
```

### Option 2: Compute Engine (VM)

**Windows:**
```powershell
.\scripts\deploy-gcp.ps1 -DeployType ComputeEngine
```

**Linux/Mac:**
```bash
./scripts/deploy-gcp.sh compute-engine
```

---

## Using Docker Compose

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## Manual Docker Commands

### Build
```bash
docker build -t mubai-bot .
```

### Run
```bash
docker run -d \
  --name mubai-bot \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/tokens:/app/tokens \
  -v $(pwd)/downloads:/app/downloads \
  --restart unless-stopped \
  mubai-bot
```

### Manage
```bash
# View logs
docker logs -f mubai-bot

# Stop
docker stop mubai-bot

# Start
docker start mubai-bot

# Remove
docker rm -f mubai-bot

# Shell access
docker exec -it mubai-bot /bin/bash
```

---

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs mubai-bot

# Check if port is in use
netstat -ano | findstr :3000  # Windows
lsof -i :3000                  # Linux/Mac
```

### Out of memory
```bash
# Increase memory limit
docker run --memory="2g" ...
```

### Chrome/Puppeteer issues
```bash
# Check if Chrome is installed in container
docker exec -it mubai-bot google-chrome --version

# Check environment variables
docker exec -it mubai-bot env | grep CHROME
```

---

## Environment Variables in .env

```env
# Required
TELEGRAM_BOT_TOKEN=123456789:ABCdef...
OPENAI_API_KEY=sk-proj-...

# Optional
NODE_ENV=production
PORT=3000
```

---

## Quick Reference

| Command | Description |
|---------|-------------|
| `docker build -t mubai-bot .` | Build image |
| `docker run -p 3000:3000 --env-file .env mubai-bot` | Run container |
| `docker ps` | List running containers |
| `docker logs -f mubai-bot` | View logs |
| `docker stop mubai-bot` | Stop container |
| `docker rm mubai-bot` | Remove container |
| `docker-compose up -d` | Start with compose |
| `docker-compose down` | Stop compose |

---

## Next Steps

1. ✅ Test locally with Docker
2. ✅ Verify QR code appears at http://localhost:3000
3. ✅ Scan QR code with WhatsApp
4. ✅ Test Telegram bot
5. ✅ Deploy to GCP when ready

🚀 **Ready to deploy!**

