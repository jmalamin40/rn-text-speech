# Play Store Release Checklist

## Version Information
- **Current Version Code:** 2
- **Current Version Name:** 1.0.1
- **Package Name:** com.texttospeech.bangla.hindi.english
- **App Name:** Text to Speech BD

## Pre-Release Steps

### 1. ✅ Version Numbers Updated
- Version code incremented to 2 (must be higher than previous release)
- Version name set to 1.0.1

### 2. ⚠️ Release Signing Setup

**IMPORTANT:** If this is the first release or you need to set up signing:

1. **Create release keystore** (if you don't have one):
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias release-key -keyalg RSA -keysize 2048 -validity 10000
   ```
   - **Store this keystore file safely!** You'll need it for all future updates.
   - **Keep the password secure!** You cannot update the app without it.

2. **Create keystore.properties file**:
   ```bash
   cd android
   cp keystore.properties.example keystore.properties
   ```
   
3. **Edit `android/keystore.properties`** with your actual keystore information:
   ```properties
   storeFile=../app/release.keystore
   storePassword=your_actual_password
   keyAlias=release-key
   keyPassword=your_actual_password
   ```

4. **Add to .gitignore** (if not already):
   ```
   android/keystore.properties
   android/app/release.keystore
   ```

**If you already have a release keystore from previous version:**
- Copy your existing `release.keystore` to `android/app/`
- Create `android/keystore.properties` with your keystore details

### 3. ✅ AdMob Configuration
- Production ad unit ID is configured: `ca-app-pub-8013532435881465/1939608489`
- Uses test ads in development, production ads in release builds
- AdMob App ID configured in AndroidManifest.xml

### 4. Build Release Bundle (AAB)

**Option 1: Using Gradle directly**
```bash
cd android
./gradlew bundleRelease
```

**Option 2: Using React Native CLI**
```bash
cd android
./gradlew clean
cd ..
npx react-native build-android --mode=release
```

The release bundle will be generated at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### 5. Test Release Build

Before uploading to Play Store, test the release build:

```bash
# Build release APK for testing
cd android
./gradlew assembleRelease

# Install on connected device
adb install app/build/outputs/apk/release/app-release.apk
```

### 6. Play Store Console Upload

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app: **Text to Speech BD**
3. Go to **Production** (or **Testing** → **Internal testing**)
4. Click **Create new release**
5. Upload the AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
6. Fill in release notes
7. Review and publish

## Important Notes

- **Version Code:** Must always be incremented for each release (currently: 2)
- **Version Name:** User-facing version string (currently: 1.0.1)
- **Signing:** Use the same keystore for all updates to the same app
- **AAB Format:** Google Play requires AAB format for new apps/updates
- **Testing:** Always test release builds before uploading

## Version History

- **v1.0.0** (versionCode: 1) - Initial release
- **v1.0.1** (versionCode: 2) - Current release
  - Added AdMob rewarded ads for play and download
  - Improved ad loading and error handling
  - Updated UI and removed standalone rewards button

