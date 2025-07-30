# Fix Next.js Development Server Issues
Write-Host "🔧 Fixing Next.js development server issues..." -ForegroundColor Yellow

# Stop any running processes on port 3000 and 3001
Write-Host "Stopping existing processes..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear Next.js cache
Write-Host "Clearing Next.js cache..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Cleared .next directory" -ForegroundColor Green
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Cyan
npm cache clean --force
Write-Host "✓ Cleared npm cache" -ForegroundColor Green

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Cyan
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
npm install
Write-Host "✓ Reinstalled dependencies" -ForegroundColor Green

# Build the project
Write-Host "Building project..." -ForegroundColor Cyan
npm run build
Write-Host "✓ Build completed" -ForegroundColor Green

# Start development server
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "🚀 Development server should now be running on http://localhost:3000" -ForegroundColor Green
Write-Host "💡 If you still see 404 errors, try:" -ForegroundColor Yellow
Write-Host "   1. Hard refresh your browser (Ctrl+F5)" -ForegroundColor White
Write-Host "   2. Clear browser cache" -ForegroundColor White
Write-Host "   3. Try incognito/private browsing mode" -ForegroundColor White

npm run dev 