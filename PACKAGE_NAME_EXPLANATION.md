# Package Name vs Component Name - Important Explanation

## ⚠️ Critical Understanding

Your app has **TWO different names** that serve different purposes:

### 1. React Native Component Name: `textToSpeechBd`
- **Location:** `app.json` → `"name": "textToSpeechBd"`
- **Usage:** Used by React Native to register the main component
- **Where used:** `MainActivity.kt` → `getMainComponentName()` returns `"textToSpeechBd"`
- **Purpose:** JavaScript-side component identifier

### 2. Android Package Name: `com.texttospeech.bangla.hindi.english`
- **Location:** `android/app/build.gradle` → `applicationId`
- **Usage:** Android OS uses this to identify your app
- **Where used:** ADB commands, Play Store, device package manager
- **Purpose:** Native Android app identifier

## ✅ CORRECT Commands to Use

### Start the App
```bash
adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity
```

### Stop the App
```bash
adb shell am force-stop com.texttospeech.bangla.hindi.english
```

### Restart the App
```bash
adb shell am force-stop com.texttospeech.bangla.hindi.english && \
adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity
```

### Check Installed Package
```bash
adb shell pm list packages | grep texttospeech
# Should show: package:com.texttospeech.bangla.hindi.english
```

## ❌ WRONG (Don't Use These)

```bash
# ❌ WRONG - This package doesn't exist!
adb shell am start -n com.texttospeechbd/.MainActivity

# ❌ WRONG - This will fail
adb shell am force-stop com.texttospeechbd
```

## 🔧 Easy Helper Script

Use the provided script:
```bash
./run-app.sh
```

This script automatically uses the correct package name.

## 📋 Summary

| Purpose | Value | Where It's Used |
|---------|-------|-----------------|
| React Native Component | `textToSpeechBd` | JavaScript, `app.json`, `MainActivity.kt` |
| Android Package | `com.texttospeech.bangla.hindi.english` | ADB commands, device, Play Store |

**Remember:** Always use `com.texttospeech.bangla.hindi.english` in ADB commands!


