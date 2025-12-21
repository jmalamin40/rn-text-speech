# AdMob Rewarded Ads Integration

## ✅ What Has Been Done

### 1. Package Installation
- ✅ Installed `react-native-google-mobile-ads` package

### 2. Android Configuration
- ✅ Added AdMob App ID to `AndroidManifest.xml`:
  ```xml
  <meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-8013532435881465~4450044140"/>
  ```

### 3. Rewarded Ad Service
- ✅ Created `services/RewardedAdService.ts` with:
  - Ad Unit ID: `ca-app-pub-8013532435881465/2624467717`
  - Automatic ad loading and management
  - Event listeners for ad lifecycle
  - Test ID support for development

### 4. React Hook
- ✅ Created `hooks/useRewardedAd.ts` for easy integration

### 5. UI Integration
- ✅ Added "Watch Ad for Rewards" button in `App.tsx`
- ✅ Button shows ad loading status
- ✅ Displays success/error alerts

## 📱 How It Works

1. **Ad Loading**: The rewarded ad service automatically loads ads when the app starts
2. **User Interaction**: User taps the "🎁 Watch Ad for Rewards" button
3. **Ad Display**: Full-screen rewarded ad is shown
4. **Reward**: When user completes watching the ad, they earn a reward
5. **Auto-reload**: After showing an ad, the next ad is automatically loaded

## 🎯 AdMob Configuration

- **App ID**: `ca-app-pub-8013532435881465~4450044140`
- **Rewarded Ad Unit ID**: `ca-app-pub-8013532435881465/2624467717`

## 🔧 Development vs Production

The code automatically uses:
- **Development**: Test ad unit ID (from `TestIds.REWARDED`)
- **Production**: Your actual ad unit ID (`ca-app-pub-8013532435881465/2624467717`)

This is controlled by the `__DEV__` variable in `services/RewardedAdService.ts`.

## 📝 Next Steps

1. **Rebuild the app** to include the native module:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

2. **Test in development**: The app will show test ads automatically

3. **Test in production**: When you build a release version, it will use your actual ad unit

4. **Customize reward logic**: You can modify `handleWatchAd()` in `App.tsx` to give users specific rewards after watching ads

## ⚠️ Important Notes

- New ad units may take up to an hour to start showing ads in production
- Always test with test ad units during development
- Ensure your app complies with [AdMob policies](https://support.google.com/admob/answer/6128543)

## 🎨 Customization

You can customize the reward logic in `App.tsx`:
```typescript
const handleWatchAd = async () => {
  const success = await showRewardedAd();
  if (success) {
    // Give user a reward here
    // Examples:
    // - Unlock premium features
    // - Add credits/points
    // - Remove ads for a session
    // - Unlock premium voices
  }
};
```


