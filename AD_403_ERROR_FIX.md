# Fix for AdMob 403 Error

## Problem
Your app is receiving HTTP 403 error when trying to load ads. This means the ad unit ID is either:
1. **Invalid** - Doesn't exist in AdMob
2. **Not Active** - Exists but not approved/activated
3. **Wrong App** - Belongs to a different app
4. **Not created yet** - You need to create the ad unit

## Solution Steps

### Step 1: Check AdMob Console
1. Go to https://apps.admob.com/
2. Sign in with your Google account
3. Click on **Apps** in left menu
4. Find **Text to Speech BD** (or your app name)
5. Click on your app

### Step 2: Check Ad Units
1. Click on **Ad units** tab
2. Look for a **Rewarded** ad unit
3. **VERIFY the ad unit ID** - Does it match `1939608489`?
4. **Check the status** - Should be **Active** (green)

### Step 3: If Ad Unit Doesn't Exist or ID is Different

**Option A: Ad Unit Doesn't Exist**
1. Click **Add ad unit** button
2. Select **Rewarded** format
3. Give it a name (e.g., "Rewarded Ad")
4. Copy the new ad unit ID
5. Update `services/AdService.ts` with the new ID
6. Rebuild and release

**Option B: Ad Unit ID is Different**
1. Copy the correct ad unit ID from AdMob Console
2. Update `services/AdService.ts` line 13:
   ```typescript
   const REWARDED_AD_UNIT_ID = 'ca-app-pub-8013532435881465/YOUR_CORRECT_ID_HERE';
   ```
3. Rebuild: `cd android && ./gradlew bundleRelease`
4. Release new version

### Step 4: If Ad Unit Exists But Not Active
1. Wait 24-48 hours for approval
2. Check AdMob Console for any policy violations
3. Ensure your AdMob account is fully set up

## Current Configuration

**Code uses:** `ca-app-pub-8013532435881465/1939608489`  
**You need to verify:** This ID exists and is Active in AdMob Console

## After Fixing

1. Update the ad unit ID in code (if different)
2. Rebuild the release bundle
3. Test again
4. The 403 error should be resolved

