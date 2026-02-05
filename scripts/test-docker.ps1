# Test Docker build and run locally before deploying to GCP (PowerShell)

Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         MubAI Bot - Local Docker Test            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (!(Test-Path .env)) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    @"
TELEGRAM_BOT_TOKEN=your_telegram_token_here
OPENAI_API_KEY=your_openai_key_here
"@ | Out-File -FilePath .env -Encoding ASCII
    Write-Host "⚠️  Please edit .env with your actual credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host "🔨 Building Docker image..." -ForegroundColor Yellow
docker build -t mubai-bot:test .

Write-Host "✓ Build successful!" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 Starting container..." -ForegroundColor Yellow
docker run -d `
  --name mubai-bot-test `
  -p 3000:3000 `
  --env-file .env `
  -v "${PWD}/tokens:/app/tokens" `
  -v "${PWD}/downloads:/app/downloads" `
  mubai-bot:test

Write-Host ""
Write-Host "✅ Container started!" -ForegroundColor Green
Write-Host "🌐 Access at: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Useful commands:" -ForegroundColor Yellow
Write-Host "  View logs:    docker logs -f mubai-bot-test"
Write-Host "  Stop:         docker stop mubai-bot-test"
Write-Host "  Remove:       docker rm -f mubai-bot-test"
Write-Host "  Shell access: docker exec -it mubai-bot-test /bin/bash"
Write-Host ""

# Follow logs
Write-Host "📋 Following logs (Ctrl+C to exit)..." -ForegroundColor Yellow
docker logs -f mubai-bot-test

