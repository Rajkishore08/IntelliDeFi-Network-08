# Fix Port-Related 404 Errors

## 🚨 Problem: Browser Loading from Wrong Port

**Error Messages:**
```
GET http://localhost:3000/_next/static/css/app/layout.css?v=1753906670691 net::ERR_ABORTED 404 (Not Found)
GET http://localhost:3000/_next/static/chunks/main-app.js?v=1753906670691 net::ERR_ABORTED 404 (Not Found)
```

**Root Cause:** Browser cache remembers the old port (3000) but server is running on different port (3001, 3002, etc.)

## ✅ Solutions

### 1. **Force Port 3000 (Recommended)**
```powershell
# Stop all Node processes
Get-Process -Name "node" | Stop-Process -Force

# Clear Next.js cache
Remove-Item -Recurse -Force .next

# Start on port 3000
npm run dev -- -p 3000
```

### 2. **Clear Browser Cache**
- **Chrome/Edge**: Press `Ctrl + Shift + R` or `Ctrl + F5`
- **Firefox**: Press `Ctrl + Shift + R`
- **Or**: Open Developer Tools → Network → Disable cache

### 3. **Use Incognito/Private Mode**
- Open browser in incognito/private mode
- Navigate to the correct port (check terminal output)

### 4. **Manual Port Check**
```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill process if needed
taskkill /PID [PID_NUMBER] /F
```

## 🎯 Quick Fix Commands

```powershell
# Complete fix in one go
Get-Process -Name "node" | Stop-Process -Force
Remove-Item -Recurse -Force .next
npm run dev -- -p 3000
```

## 🔍 Why This Happens

1. **Port Conflicts**: Multiple development servers running
2. **Browser Cache**: Browser remembers old port URLs
3. **Hot Reload**: Next.js sometimes switches ports automatically
4. **Multiple Projects**: Other projects using same ports

## 🚀 Prevention

1. **Always use port 3000**: `npm run dev -- -p 3000`
2. **Clear cache regularly**: `Remove-Item -Recurse -Force .next`
3. **Check terminal output**: Always verify the correct port
4. **Use consistent ports**: Stick to 3000 for development

## 📱 Mobile/Tablet Issues

If testing on mobile:
1. Clear browser cache
2. Use the exact URL from terminal
3. Try different browser
4. Check if device has stable connection

## 🛠️ Advanced Troubleshooting

### Check All Ports
```powershell
# Check all ports in use
netstat -ano | findstr :300
```

### Kill All Node Processes
```powershell
# Kill all Node.js processes
Get-Process -Name "node" | Stop-Process -Force
```

### Fresh Start
```powershell
# Complete fresh start
Get-Process -Name "node" | Stop-Process -Force
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev -- -p 3000
```

## 🎯 Current Status

✅ **Fixed**: Development server now running on port 3000
✅ **Cache Cleared**: Next.js cache removed
✅ **Processes Stopped**: All conflicting processes terminated

**Your app should now be accessible at:**
```
http://localhost:3000
```

## 💡 Pro Tips

1. **Bookmark the correct URL**: Always bookmark `http://localhost:3000`
2. **Check terminal first**: Always check terminal output for correct port
3. **Use consistent commands**: Always use `npm run dev -- -p 3000`
4. **Clear cache regularly**: Run the fix commands when issues occur 