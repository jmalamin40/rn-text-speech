# How to Reload the App to Connect to Metro

## Quick Reload Methods

### Method 1: Dev Menu (Easiest)
1. **Shake your device** (or press `Ctrl+M` / `Cmd+M` if using emulator)
2. Select **"Reload"** from the menu
3. Wait for the app to reload

### Method 2: Keyboard Shortcut (Metro Terminal)
- Press `R` **twice** in the Metro bundler terminal
- This will reload the app on the connected device

### Method 3: ADB Command
```bash
adb shell input text "RR"
```

### Method 4: Force Restart
```bash
adb shell am force-stop com.texttospeech.bangla.hindi.english
adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity
```

## ✅ What Should Happen

After reloading, you should see:
- ✅ The app loads normally (no red error screen)
- ✅ Metro bundler terminal shows bundle loading messages
- ✅ App functionality works correctly

## 🐛 If Still Getting Error

If you still see "Unable to load script" after reloading:

1. **Verify Metro is running:**
   ```bash
   curl http://localhost:8081/status
   ```
   Should show: `packager-status:running`

2. **Check port forwarding:**
   ```bash
   adb reverse --list
   ```
   Should show: `UsbFfs tcp:8081 tcp:8081`

3. **If not working, run the fix script:**
   ```bash
   ./fix-metro-connection.sh
   ```

## 📱 Current Setup Status

✅ Metro bundler: Running  
✅ Port forwarding: Active  
✅ App: Installed and ready  
✅ Native module: Included  

**Your app should now work!** Just reload it using one of the methods above.


