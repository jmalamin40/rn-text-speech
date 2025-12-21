# AdMob Debug Guide

## Changes Made

1. ✅ Fixed import statement (using default import for `mobileAds`)
2. ✅ Added comprehensive logging throughout the service
3. ✅ Added error handling and status checks
4. ✅ Added event listener for ad closed (to reload next ad)

## How to Debug

### Step 1: Reload the App
```bash
# Option 1: Shake device and select "Reload"
# Option 2: Press R twice in Metro terminal
# Option 3: Run command:
adb shell input text "RR"
```

### Step 2: Check Logs
```bash
# Watch logs in real-time
adb logcat | grep -iE "(ReactNativeJS|mobileAds|Rewarded|Ad.*load)"

# Or check recent logs
adb logcat -d | grep -iE "(ReactNativeJS|mobileAds|Rewarded|Ad.*load)" | tail -50
```

### Step 3: Look for These Log Messages

**Success messages:**
- ✅ `Initializing Mobile Ads SDK...`
- ✅ `Mobile Ads SDK initialized successfully`
- ✅ `Creating rewarded ad with ID: ...`
- ✅ `Starting initial ad load...`
- ✅ `Rewarded ad loaded successfully`

**Error messages to watch for:**
- ❌ `mobileAds is not available. Native module may not be linked properly.`
- ❌ `mobileAds() returned undefined`
- ❌ `Rewarded ad failed to load: ...`
- ❌ `Error initializing Mobile Ads SDK: ...`

## Common Issues

### Issue 1: `mobileAds is not a function`
**Cause:** Native module not linked or app needs rebuild
**Solution:** Rebuild the app:
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### Issue 2: Ad fails to load
**Possible causes:**
- Ad unit ID not activated yet (new ad units take time)
- No internet connection
- Test ad ID not working (should use TestIds.REWARDED in dev)

### Issue 3: Ad loads but doesn't show
**Possible causes:**
- Ad not fully loaded when trying to show
- User action required (wait for ad to be ready)
- Check if `isAdReady` is true before showing

## Testing

1. **Check button state:**
   - Button should show "⏳ Ad Loading..." initially
   - Button should change to "🎁 Watch Ad for Rewards" when ad is ready
   - Button should be disabled while loading

2. **Test ad flow:**
   - Wait for ad to load (button changes)
   - Tap the button
   - Test ad should appear
   - Complete the ad
   - Reward message should appear

## Current Configuration

- **App ID:** `ca-app-pub-8013532435881465~4450044140`
- **Ad Unit ID (Dev):** `TestIds.REWARDED` (test ad)
- **Ad Unit ID (Prod):** `ca-app-pub-8013532435881465/2624467717`

In development mode (`__DEV__ = true`), the app uses test ads which should always work.


