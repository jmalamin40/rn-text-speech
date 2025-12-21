# Correct Package Name

## Important: Use the Correct Package Name

Your app's package name has been updated to match Play Store:
- **Correct:** `com.texttospeech.bangla.hindi.english`
- **Old (no longer exists):** `com.texttospeechbd`

## Commands to Use

### Launch App
```bash
adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity
```

### Stop App
```bash
adb shell am force-stop com.texttospeech.bangla.hindi.english
```

### Restart App
```bash
adb shell am force-stop com.texttospeech.bangla.hindi.english && adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity
```

### Check Installed Packages
```bash
adb shell pm list packages | grep texttospeech
```

## Current Status

✅ App installed: `com.texttospeech.bangla.hindi.english`
✅ Build successful with native module
✅ Metro bundler running on port 8081

## If You See Native Module Error

1. **Reload the app** in the running instance:
   - Shake device → Select "Reload"
   - Or press `R` in Metro bundler terminal

2. **Or restart the app** with correct package name (command above)

3. The native module should now be included in the build


