# Ad Configuration Review for Play Store Release

## Current Configuration

### Ad Unit ID Logic
```typescript
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED  // Test ads in development
  : 'ca-app-pub-8013532435881465/1939608489';  // Production ads
```

### AdMob App ID
- **App ID:** `ca-app-pub-8013532435881465~4450044140`
- Configured in: `AndroidManifest.xml` and `app.json`

## How __DEV__ Works in React Native

### Development Mode (Current - Shows Test Ads)
- **When:** Running `npm run android` or with Metro bundler
- **__DEV__ value:** `true`
- **Result:** Uses `TestIds.REWARDED` (test ads)
- **Why you see test ads:** Because you're running in development mode

### Production/Release Build (Play Store - Shows Real Ads)
- **When:** Building release bundle (`./gradlew bundleRelease`)
- **__DEV__ value:** `false`
- **Result:** Uses `ca-app-pub-8013532435881465/1939608489` (real ads)
- **What happens:** React Native automatically sets `__DEV__ = false` in release builds

## ✅ Confirmation: YES, You Will See Real Ads!

When you release to Play Store:
1. ✅ The release bundle is built with `__DEV__ = false`
2. ✅ Code will use production ad unit ID: `ca-app-pub-8013532435881465/1939608489`
3. ✅ Real ads from AdMob will be displayed
4. ✅ You'll earn revenue from ad impressions

## Important Notes

1. **Ad Unit ID Verification**
   - Current production ad unit ID: `ca-app-pub-8013532435881465/1939608489`
   - Please verify this matches your AdMob console
   - If different, update `services/AdService.ts`

2. **Ad Serving Timeline**
   - After Play Store release, ads may take up to 24 hours to appear
   - New ad units can take time to start serving ads
   - Monitor your AdMob console for ad serving status

3. **Testing Before Release**
   - To test with real ads before release:
     - Build a release APK: `cd android && ./gradlew assembleRelease`
     - Install on device: `adb install app/build/outputs/apk/release/app-release.apk`
     - This will use production ad unit ID (real ads)

4. **AdMob Account Status**
   - Ensure your AdMob account is approved
   - Verify ad unit is active in AdMob console
   - Check app status in AdMob

## Verification Steps

1. ✅ Code uses `__DEV__` to switch between test/production
2. ✅ Production ad unit ID is configured
3. ✅ AdMob App ID is set correctly
4. ⚠️ **Action Required:** Verify ad unit ID `1939608489` is correct in your AdMob console

## Summary

**Question:** Will I see real ads when released to Play Store?
**Answer:** ✅ **YES!** The code is correctly configured. Release builds automatically use production ad unit ID and will show real ads.

