# AdMob Runtime Error Fix

## Issue
The app was crashing with: "Cannot read property 'rewardedAdService' of undefined"

## Root Cause
The Google Mobile Ads SDK needs to be initialized before creating ad instances. The service was trying to create ads in the constructor before the SDK was ready.

## Fixes Applied

### 1. Added SDK Initialization
- Added `mobileAds().initialize()` before creating ad instances
- Made initialization async to wait for SDK to be ready

### 2. Added Safety Checks
- Added null checks throughout the service
- Added initialization state tracking
- Added error handling for failed initialization

### 3. Updated Hook
- Added type checks before calling service methods
- Added delay for initial ad status check (2 seconds) to allow SDK initialization
- Added error handling in the hook

## Changes Made

### services/RewardedAdService.ts
- Added `mobileAds()` import and initialization
- Made `rewarded` nullable and checked before use
- Added `isInitialized` flag
- Added error handling in singleton creation

### hooks/useRewardedAd.ts
- Added type checks before calling methods
- Added 2-second delay for initial status check
- Added try-catch blocks around service calls

## Next Steps

1. **Reload the app** - The Metro bundler should pick up the changes automatically
2. **Check console logs** - Look for initialization messages
3. **Test the ad button** - Should now work without crashing

## Expected Behavior

- App should start without crashing
- Ad button should show "⏳ Ad Loading..." initially
- After 2-3 seconds, it should update to "🎁 Watch Ad for Rewards" when ready
- Clicking the button should show a rewarded ad


