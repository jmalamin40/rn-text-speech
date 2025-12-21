# How to View Logs

## Method 1: Metro Bundler Console (Easiest for JavaScript logs)

The Metro bundler terminal where you ran `npm start` shows JavaScript console logs.

**Look for:**
- `console.log()` messages
- `console.error()` messages
- Ad initialization messages
- Ad loading status

**What you'll see:**
```
Initializing Mobile Ads SDK...
Mobile Ads SDK initialized successfully
Creating rewarded ad with ID: ca-app-pub-3940256099942544/5224354917
Starting initial ad load...
✅ Rewarded ad loaded successfully
```

## Method 2: ADB Logcat (For Native/Android logs)

### View all React Native logs:
```bash
adb logcat | grep -iE "ReactNativeJS"
```

### View AdMob related logs:
```bash
adb logcat | grep -iE "ReactNativeJS|mobileAds|Rewarded|Ad.*load"
```

### View recent logs (last 100 lines):
```bash
adb logcat -d | grep -iE "ReactNativeJS|mobileAds|Rewarded" | tail -100
```

### View only errors:
```bash
adb logcat *:E | grep -iE "ReactNativeJS|mobileAds"
```

### Clear logs and watch fresh:
```bash
adb logcat -c && adb logcat | grep -iE "ReactNativeJS|mobileAds|Rewarded"
```

## Method 3: React Native Log Android (Convenient wrapper)

```bash
npx react-native log-android
```

This shows logs in a filtered, readable format.

## Method 4: Filter specific messages

### Only see AdMob initialization:
```bash
adb logcat | grep -i "Initializing Mobile Ads\|Mobile Ads SDK initialized\|Rewarded ad"
```

### Only see errors:
```bash
adb logcat *:E ReactNativeJS:V | grep -iE "Error|Exception|Failed"
```

## Quick Test Command

Run this to see logs in real-time:
```bash
adb logcat -c && echo "Logs cleared. Please interact with the app (tap Watch Ad button)..." && adb logcat | grep -iE "ReactNativeJS"
```

---

## 📱 Recommended: Use Metro Console + ADB Logcat

**Terminal 1 (Metro):**
```bash
npm start
```
- Shows JavaScript console.log() messages

**Terminal 2 (Logs):**
```bash
adb logcat | grep -iE "ReactNativeJS|mobileAds|Rewarded"
```
- Shows native Android logs filtered for React Native and AdMob


