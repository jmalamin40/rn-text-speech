# Quick Start Guide - Text to Speech BD

## ✅ Use the Helper Script (Easiest)

```bash
./run-app.sh
```

This script will:
- Check device connection
- Setup port forwarding
- Stop and restart the app with correct package name

## 📱 Manual Commands

### Start Metro Bundler
```bash
npm start
```

### Build and Run App
```bash
npm run android
```

### Restart App Manually
```bash
# Stop app
adb shell am force-stop com.texttospeech.bangla.hindi.english

# Start app
adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity

# Setup port forwarding
adb reverse tcp:8081 tcp:8081
```

### Reload App (when Metro is running)
- **Option 1:** Shake device → Select "Reload"
- **Option 2:** Press `R` in Metro bundler terminal
- **Option 3:** Run: `adb shell input text "RR"`

## ⚠️ Important Package Name

**Always use:** `com.texttospeech.bangla.hindi.english`

**Never use:** `com.texttospeechbd` (this doesn't exist!)

## 🎁 Testing Rewarded Ads

1. Open the app
2. Look for the **"🎁 Watch Ad for Rewards"** button
3. Wait a few seconds for the ad to load (button will show "⏳ Ad Loading..." initially)
4. When button shows "🎁 Watch Ad for Rewards", tap it
5. A test ad should appear (in development mode)

## 🐛 Troubleshooting

### App won't start
- Check device is connected: `adb devices`
- Verify package is installed: `adb shell pm list packages | grep texttospeech`
- Use correct package name: `com.texttospeech.bangla.hindi.english`

### Metro bundler not connecting
- Ensure port forwarding: `adb reverse tcp:8081 tcp:8081`
- Check Metro is running: `curl http://localhost:8081/status`

### Ad not loading
- Wait a few seconds after app starts (SDK initialization)
- Check device has internet connection
- In development, test ads should always work
