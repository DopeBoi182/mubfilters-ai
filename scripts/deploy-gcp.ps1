# MubAI Bot - GCP Deployment Script (PowerShell)
# Usage: .\scripts\deploy-gcp.ps1 -DeployType [CloudRun|ComputeEngine]

param(
    [ValidateSet("CloudRun", "ComputeEngine")]
    [string]$DeployType = "CloudRun"
)

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║      MubAI Bot - GCP Deployment Script           ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Check if gcloud is installed
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ gcloud CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
}

# Get GCP project ID
$PROJECT_ID = gcloud config get-value project 2>$null

if ([string]::IsNullOrEmpty($PROJECT_ID)) {
    Write-Host "❌ No GCP project set. Run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Using project: $PROJECT_ID" -ForegroundColor Green
Write-Host ""

Write-Host "📦 Building Docker image..." -ForegroundColor Yellow
docker build -t "gcr.io/$PROJECT_ID/mubai-bot:latest" .

Write-Host "☁️  Pushing to Google Container Registry..." -ForegroundColor Yellow
docker push "gcr.io/$PROJECT_ID/mubai-bot:latest"

if ($DeployType -eq "CloudRun") {
    Write-Host "🚀 Deploying to Cloud Run..." -ForegroundColor Yellow
    
    gcloud run deploy mubai-bot `
      --image "gcr.io/$PROJECT_ID/mubai-bot:latest" `
      --platform managed `
      --region us-central1 `
      --allow-unauthenticated `
      --port 3000 `
      --memory 2Gi `
      --cpu 1 `
      --timeout 3600 `
      --min-instances 1 `
      --max-instances 1
    
    # Get service URL
    $SERVICE_URL = gcloud run services describe mubai-bot --region us-central1 --format 'value(status.url)'
    
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your bot is running at: $SERVICE_URL" -ForegroundColor Green
    Write-Host "📱 QR Code available at: $SERVICE_URL" -ForegroundColor Green
    
} elseif ($DeployType -eq "ComputeEngine") {
    Write-Host "🖥️  Deploying to Compute Engine..." -ForegroundColor Yellow
    
    gcloud compute instances create-with-container mubai-bot-vm `
      --container-image "gcr.io/$PROJECT_ID/mubai-bot:latest" `
      --machine-type e2-medium `
      --boot-disk-size 20GB `
      --zone us-central1-a `
      --tags http-server,https-server `
      --container-restart-policy always
    
    # Configure firewall
    try {
        gcloud compute firewall-rules create allow-mubai-web `
          --allow tcp:3000 `
          --target-tags http-server `
          --description "Allow incoming traffic on port 3000"
    } catch {
        Write-Host "Firewall rule already exists" -ForegroundColor Yellow
    }
    
    # Get VM IP
    $VM_IP = gcloud compute instances describe mubai-bot-vm `
      --zone us-central1-a `
      --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
    
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🌐 Your bot is running at: http://${VM_IP}:3000" -ForegroundColor Green
    Write-Host "📱 QR Code available at: http://${VM_IP}:3000" -ForegroundColor Green
}

Write-Host ""
Write-Host "⏳ Note: It may take 1-2 minutes for the service to fully start." -ForegroundColor Yellow
Write-Host ""

