# Reload the App to Test AdMob Integration

## Quick Steps

1. **Make sure Metro bundler is running:**
   ```bash
   npm start
   ```

2. **Reload the app on your device:**
   - **Option A:** Shake your device → Select "Reload"
   - **Option B:** Press `R` key in the Metro bundler terminal
   - **Option C:** Run this command:
     ```bash
     adb shell input text "RR"
     ```

3. **Or restart the app completely:**
   ```bash
   adb shell am force-stop com.texttospeech.bangla.hindi.english
   adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity
   ```

## What to Look For

After reloading, the "🎁 Watch Ad for Rewards" button should:
- Show "⏳ Ad Loading..." initially (button disabled)
- Change to "🎁 Watch Ad for Rewards" when ad is ready (button enabled)
- Allow you to tap it to show the rewarded ad

## If You Still See Errors

Please share:
1. The exact error message (copy from the red screen or console)
2. What happens when you tap the "Watch Ad" button
3. Any console output from Metro bundler

## Testing

The app uses test ad IDs in development mode (`__DEV__`), so you'll see test ads that always work. This helps verify the integration is working correctly.


