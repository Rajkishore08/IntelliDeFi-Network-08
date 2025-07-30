# Troubleshooting Next.js Development Server Issues

## Common 404 Errors and Solutions

### 🔧 Quick Fix Script
Run the PowerShell script to automatically fix most issues:
```powershell
.\fix-dev-server.ps1
```

### 🚨 Error: Failed to load resource: 404 (Not Found)
**Problem**: Browser can't find JavaScript chunks or static files

**Solutions**:

1. **Clear Browser Cache**
   - Press `Ctrl + F5` for hard refresh
   - Or open Developer Tools → Network → Disable cache
   - Try incognito/private browsing mode

2. **Clear Next.js Cache**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

3. **Reinstall Dependencies**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

4. **Check Port Conflicts**
   - Make sure no other process is using port 3000
   - Try different port: `npm run dev -- -p 3002`

### 🔍 Manual Troubleshooting Steps

1. **Stop All Node Processes**
   ```powershell
   Get-Process -Name "node" | Stop-Process -Force
   ```

2. **Clear All Caches**
   ```powershell
   npm cache clean --force
   Remove-Item -Recurse -Force .next
   ```

3. **Fresh Install**
   ```powershell
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

4. **Rebuild Project**
   ```powershell
   npm run build
   npm run dev
   ```

### 🌐 Browser-Specific Solutions

**Chrome/Edge**:
- Open Developer Tools (F12)
- Right-click refresh button → "Empty Cache and Hard Reload"
- Or go to Settings → Privacy → Clear browsing data

**Firefox**:
- Press `Ctrl + Shift + R` for hard refresh
- Or go to Settings → Privacy → Clear Data

### 📱 Mobile/Tablet Issues

If testing on mobile devices:
1. Clear browser cache
2. Try different browser
3. Check if device has stable internet connection

### 🔄 Development vs Production

**Development Mode Issues**:
- Usually cache-related
- Fixed by clearing `.next` directory
- Hot reload might cause temporary 404s

**Production Build Issues**:
- Run `npm run build` first
- Check for build errors
- Ensure all imports are correct

### 🛠️ Advanced Solutions

1. **Check Network Tab**
   - Open Developer Tools → Network
   - Look for failed requests
   - Check if files exist in `.next/static/`

2. **Verify File Structure**
   ```powershell
   Get-ChildItem .next/static -Recurse
   ```

3. **Check Next.js Version**
   ```powershell
   npm list next
   ```

4. **Update Dependencies**
   ```powershell
   npm update
   ```

### 🚀 Prevention Tips

1. **Always use the fix script** when encountering issues
2. **Keep dependencies updated**
3. **Use consistent Node.js version**
4. **Clear cache regularly during development**

### 📞 Still Having Issues?

If the problem persists:
1. Check the terminal output for specific error messages
2. Try running on a different port
3. Check if your antivirus is blocking Node.js
4. Ensure you have sufficient disk space

### 🎯 Quick Commands Reference

```powershell
# Stop development server
Ctrl + C

# Clear cache and restart
Remove-Item -Recurse -Force .next
npm run dev

# Fresh start
.\fix-dev-server.ps1

# Check if port is in use
netstat -ano | findstr :3000
``` 