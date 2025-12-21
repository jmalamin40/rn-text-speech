# Verify Your Ad Unit ID

## Current Ad Unit ID in Code
**Production:** `ca-app-pub-8013532435881465/1939608489`

⚠️ **IMPORTANT:** I noticed in some documentation files there's a reference to a different ad unit ID: `2624467717`. Please verify which one is correct in your AdMob console.

## Steps to Verify in AdMob Console

1. **Go to AdMob Console**
   - Visit: https://apps.admob.com/
   - Sign in with your Google account

2. **Navigate to Your App**
   - Click on "Apps" in the left menu
   - Find "Text to Speech BD" (or your app name)
   - Click on it

3. **Check Ad Units**
   - Click on "Ad units" tab
   - Look for your rewarded ad unit
   - **Verify the ad unit ID matches:** `ca-app-pub-8013532435881465/1939608489`

4. **Check Ad Unit Status**
   - Status should be "Active" (green)
   - If it says "Ready" but not serving, it may need time to activate
   - If there are errors, fix them in the console

5. **Check for Multiple Ad Units**
   - If you see multiple rewarded ad units, check which one was created for this app
   - Note: Some docs mention `2624467717` - verify if this is the correct one

## If Ad Unit ID is Different

If your AdMob console shows a different ad unit ID, update it in `services/AdService.ts`:

```typescript
const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-8013532435881465/YOUR_CORRECT_AD_UNIT_ID';  // Update this
```

Then rebuild and release a new version.

## Common Issues

1. **Ad Unit Not Created Yet**
   - If you don't see a rewarded ad unit, create one in AdMob console
   - Copy the ad unit ID and update the code

2. **Ad Unit Inactive**
   - Check if ad unit status is "Active"
   - Some ad units need time to activate (24-48 hours)

3. **Ad Unit ID Typo**
   - Double-check the ad unit ID matches exactly
   - Even one character difference will prevent ads from loading

