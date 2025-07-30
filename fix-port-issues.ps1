# Fix Next.js Port and Cache Issues
Write-Host "🔧 Fixing Next.js development server issues..." -ForegroundColor Yellow

# Stop all Node.js processes
Write-Host "Stopping Node.js processes..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✓ Cache cleared" -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force

# Wait for ports to be released
Write-Host "Waiting for ports to be released..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

# Check if port 3000 is available
$portCheck = netstat -ano | findstr ":3000"
if ($portCheck) {
    Write-Host "⚠️  Port 3000 still in use. Trying alternative port..." -ForegroundColor Yellow
    $env:PORT=3001
} else {
    Write-Host "✓ Port 3000 is available" -ForegroundColor Green
    $env:PORT=3000
}

# Start development server
Write-Host "Starting development server on port $env:PORT..." -ForegroundColor Cyan
npm run dev

Write-Host "✅ Server should now be running without 404 errors!" -ForegroundColor Green
Write-Host "🌐 Access your app at: http://localhost:$env:PORT" -ForegroundColor Green 