# 📱 Access from Your Phone

## Step 1: Find Your Computer's IP Address

**Windows:**
1. Open Command Prompt or PowerShell
2. Run: `ipconfig`
3. Look for "IPv4 Address" under your active network adapter
4. It will look like: `192.168.1.xxx` or `10.0.0.xxx`

**Or run this PowerShell command:**
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"}
```

## Step 2: Make Sure Both Devices Are on Same WiFi

- Your phone and computer must be on the **same WiFi network**
- They cannot be on different networks

## Step 3: Restart the Servers

The servers have been updated to accept connections from your phone. Restart both:

**Backend:**
```powershell
cd "c:\Users\abdel\go travel\backend"
npm run dev
```

**Frontend:**
```powershell
cd "c:\Users\abdel\go travel\frontend"
npm run dev
```

## Step 4: Access from Your Phone

Once you have your IP address (e.g., `192.168.1.100`), open your phone's browser and go to:

**Frontend:** `http://YOUR_IP:3000`
- Example: `http://192.168.1.100:3000`

**Backend API:** `http://YOUR_IP:5000/api/health`
- Example: `http://192.168.1.100:5000/api/health`

## Step 5: Update Frontend API Calls (If Needed)

The frontend is configured to proxy API calls, so it should work automatically. However, if you have issues, you may need to update the axios base URL.

## 🔒 Important Notes

1. **Firewall:** Windows Firewall might block connections. You may see a popup asking to allow Node.js through the firewall - click "Allow Access"

2. **Camera Access:** When accessing from your phone, the QR scanner will use your phone's camera (which is perfect!)

3. **HTTPS for Camera:** Some browsers require HTTPS for camera access. If the camera doesn't work:
   - Use Chrome on Android (usually works with HTTP)
   - Or use HTTPS tunnel service (ngrok, localtunnel)

4. **Find IP Address Quickly:**
   - Check the backend console - it will show your IP
   - Or run: `ipconfig | findstr IPv4`

## 🚀 Quick Test

1. Make sure servers are running
2. Find your IP (from backend console or `ipconfig`)
3. On your phone, open browser
4. Go to: `http://YOUR_IP:3000`
5. You should see the login page!

## 📝 Example

If your computer's IP is `192.168.1.50`:
- Phone browser: `http://192.168.1.50:3000`
- Login page should appear
- Works exactly like localhost but from your phone!

---

**Troubleshooting:**
- **Can't connect?** Make sure both devices are on same WiFi
- **Firewall blocking?** Allow Node.js through Windows Firewall
- **Still not working?** Check that ports 3000 and 5000 aren't blocked by router


