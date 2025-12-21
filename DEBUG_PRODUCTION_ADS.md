# Debugging Ads in Production Build

## Quick Debugging Steps

### 1. Check Device Logs
Since this is a production build, check logs using adb:

```bash
# Filter for ad-related logs
adb logcat | grep -i "ads\|admob\|adservice\|rewarded"

# Or view all React Native logs
adb logcat | grep -i "reactnativejs"
```

Look for:
- `🎯 AdService: Running in PRODUCTION mode`
- `🎯 AdService: Using ad unit ID: ca-app-pub-8013532435881465/1939608489`
- Any error messages about ad initialization or loading

### 2. Verify Ad Unit ID in AdMob Console
1. Go to https://apps.admob.com/
2. Select your app
3. Go to Ad units
4. **VERIFY** the ad unit ID matches: `1939608489`
5. Check if status is **Active** (green)

### 3. Common Issues

#### Issue 1: Ad Unit ID Mismatch
- **Symptom**: Ads never load, no errors in logs
- **Solution**: Check AdMob Console and update code if different

#### Issue 2: Ad Unit Not Active
- **Symptom**: Errors in logs about ad unit not found
- **Solution**: Ensure ad unit status is "Active" in AdMob Console

#### Issue 3: AdMob Not Initialized
- **Symptom**: "MobileAds not available" or initialization errors
- **Solution**: Check AndroidManifest.xml has correct App ID

#### Issue 4: Low Fill Rate / No Ads Available
- **Symptom**: Ad loads but doesn't show (fill rate = 0%)
- **Solution**: Normal behavior sometimes, check AdMob console stats

### 4. Check AdMob App ID
Verify in AndroidManifest.xml:
```xml
<meta-data
  android:name="com.google.android.gms.ads.APPLICATION_ID"
  android:value="ca-app-pub-8013532435881465~4450044140"
/>
```

### 5. Test Ad Unit ID
If you want to temporarily test with test ads in production (for debugging):
- Change `__DEV__` check to always use `TestIds.REWARDED`
- This will show test ads even in production build
- **REMEMBER TO REVERT** before releasing to users!

## What to Check in Logs

When you run `adb logcat`, look for these log messages:

```
🎯 AdService: Running in PRODUCTION mode
🎯 AdService: Using ad unit ID: ca-app-pub-8013532435881465/1939608489
🔄 AdService: Initializing MobileAds SDK...
✅ AdService: MobileAds SDK initialized
🔄 AdService: Creating rewarded ad with ID: ca-app-pub-8013532435881465/1939608489
🔄 Starting to load rewarded ad...
✅ Rewarded ad loaded successfully
```

If you see errors instead:
- Check the error code and message
- Look up the error in AdMob documentation
- Verify ad unit ID and App ID match AdMob Console

