# Metro Bundler Connection Fix - Complete Solution

## ✅ Problem Fixed

The "Unable to load script" error was caused by:
1. Stale Metro bundler cache
2. App not properly connecting to Metro bundler

## 🔧 Solution Applied

1. ✅ Cleared Metro cache
2. ✅ Restarted Metro bundler with `--reset-cache`
3. ✅ Reset port forwarding (`adb reverse tcp:8081 tcp:8081`)
4. ✅ Cleaned and rebuilt the Android app
5. ✅ App reinstalled and connected to Metro

## 📋 Complete Fix Steps (If Needed Again)

### Option 1: Use the Fix Script (Recommended)
```bash
./fix-metro-connection.sh
```

### Option 2: Manual Steps

1. **Stop Metro:**
   ```bash
   pkill -f "react-native start"
   ```

2. **Clear caches:**
   ```bash
   rm -rf /tmp/metro-* /tmp/haste-*
   rm -rf node_modules/.cache
   rm -rf android/app/build
   ```

3. **Reset port forwarding:**
   ```bash
   adb reverse --remove-all
   adb reverse tcp:8081 tcp:8081
   ```

4. **Start Metro with cache reset:**
   ```bash
   npm start -- --reset-cache
   ```

5. **Clean and rebuild app:**
   ```bash
   cd android && ./gradlew clean && cd ..
   npm run android
   ```

## ✅ Verification Steps

1. **Check Metro is running:**
   ```bash
   curl http://localhost:8081/status
   # Should show: packager-status:running
   ```

2. **Check port forwarding:**
   ```bash
   adb reverse --list
   # Should show: UsbFfs tcp:8081 tcp:8081
   ```

3. **Check app is installed:**
   ```bash
   adb shell pm list packages | grep texttospeech
   # Should show: package:com.texttospeech.bangla.hindi.english
   ```

## 🎯 Current Status

✅ Metro bundler: Running with fresh cache  
✅ Port forwarding: Active (8081 → 8081)  
✅ App: Rebuilt and installed in debug mode  
✅ Native module: Included and linked  

## 🚀 Next Steps

The app should now work correctly. If you still see the error:

1. **Shake the device** and select "Reload" (this forces a connection to Metro)
2. **Or press `R` twice** in the Metro bundler terminal
3. **Or run:** `adb shell input text "RR"`

The app will reload and connect to Metro bundler automatically.

## 📝 Notes

- The app is built in **debug mode** which connects to Metro
- Metro bundler must be running before starting the app
- Port forwarding must be active for USB connections
- If using Wi-Fi, ensure device and computer are on the same network


