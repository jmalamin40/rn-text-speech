# Play Store Compliance Checklist

## ✅ Configuration Updates Completed

### 1. Security & Permissions
- [x] **HTTPS Only**: Disabled cleartext traffic (`usesCleartextTraffic="false"`)
- [x] **Network Security Config**: Added XML configuration for secure connections
- [x] **Storage Permissions**: Limited to Android 10-12 only (`maxSdkVersion="32"`)
- [x] **Minimal Permissions**: Only requesting necessary permissions (Internet, Storage)

### 2. Build Configuration
- [x] **ProGuard Enabled**: Code obfuscation enabled for release builds
- [x] **ProGuard Rules**: Added rules for React Native libraries
- [x] **Target SDK**: Set to 36 (latest)
- [x] **Version Code**: Set to 1
- [x] **Version Name**: Set to 1.0.0

### 3. Privacy & Data
- [x] **Privacy Policy**: Created comprehensive privacy policy
- [x] **Data Collection Disclosure**: Documented what data is collected
- [x] **Third-Party Services**: Disclosed API usage (texttospeechfree.online)

## 📋 Play Store Console Requirements

### Required Information

#### 1. App Information
- [ ] **App Name**: TextToSpeech BD
- [ ] **Short Description** (80 chars): "Convert text to speech in Bangla, Hindi, and English"
- [ ] **Full Description**: See PLAY_STORE_GUIDE.md
- [ ] **App Icon**: 512x512 PNG
- [ ] **Feature Graphic**: 1024x500 PNG
- [ ] **Screenshots**: At least 2 phone screenshots (max 8)

#### 2. Content Rating
- [ ] Complete IARC questionnaire
- [ ] Expected rating: **Everyone** (no objectionable content)

#### 3. Privacy Policy (REQUIRED)
- [ ] **URL**: Host privacy policy online (GitHub Pages, website, etc.)
- [ ] **Content**: Use PRIVACY_POLICY.md as template
- [ ] **Accessibility**: Must be publicly accessible

#### 4. Data Safety Section (REQUIRED)
Answer these questions in Play Console:

**Data Collection:**
- ✅ **Text Input**: Collected, Not Shared, Ephemeral
  - Purpose: App functionality
  - Data Type: Personal info (text)
  - Collection: User-provided
  - Sharing: Not shared with third parties
  - Retention: Deleted immediately after processing

**Data Security:**
- ✅ **Encryption**: Data encrypted in transit (HTTPS)
- ✅ **Data Deletion**: Users can delete audio files from device

**Third-Party Sharing:**
- ⚠️ **API Service**: texttospeechfree.online
  - Purpose: Text-to-speech conversion
  - Data Shared: Text input only
  - Type: Service provider

#### 5. App Access
- [ ] Select: **"All functionality is available without restrictions"**
- [ ] No account required
- [ ] No sign-in required

#### 6. Ads
- [ ] Select: **"No, my app doesn't contain ads"**

#### 7. Target Audience
- [ ] **Age Group**: All ages
- [ ] **Content**: Educational/Tools

## 🔐 App Signing (CRITICAL)

### Current Status: ⚠️ Using Debug Keystore
**You MUST create a production keystore before release!**

### Steps to Create Production Keystore:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**Important:**
- Keep the keystore file safe and backed up
- You'll need it for ALL future updates
- If lost, you cannot update your app on Play Store

### Update build.gradle:

1. Create `android/keystore.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

2. Add to `android/app/build.gradle`:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystorePropertiesFile.getProperty("MYAPP_RELEASE_STORE_FILE"))
                storePassword keystoreProperties.getProperty("MYAPP_RELEASE_STORE_PASSWORD")
                keyAlias keystoreProperties.getProperty("MYAPP_RELEASE_KEY_ALIAS")
                keyPassword keystoreProperties.getProperty("MYAPP_RELEASE_KEY_PASSWORD")
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

## 📦 Build Release AAB

### Generate App Bundle:
```bash
cd android
./gradlew bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

### Test Release Build:
```bash
cd android
./gradlew assembleRelease
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

**Test the APK on a real device before uploading!**

## ✅ Pre-Submission Checklist

### Code & Build
- [ ] Production keystore created and configured
- [ ] Release AAB built successfully
- [ ] Release APK tested on real device
- [ ] No debug code or test data
- [ ] ProGuard rules working correctly
- [ ] App works without internet (graceful error handling)

### Content
- [ ] Privacy policy hosted and accessible
- [ ] All screenshots prepared
- [ ] App icon (512x512) ready
- [ ] Feature graphic (1024x500) ready
- [ ] Description written and proofread
- [ ] No placeholder text in app

### Legal
- [ ] Privacy policy URL added to Play Console
- [ ] Data Safety section completed accurately
- [ ] Content rating obtained
- [ ] No copyright violations
- [ ] All third-party licenses acknowledged

### Testing
- [ ] App tested on multiple Android versions
- [ ] Permissions work correctly
- [ ] Download functionality works
- [ ] Audio playback works
- [ ] Error handling works
- [ ] No crashes in testing

## 🚨 Common Rejection Reasons

### Avoid These Issues:
1. **Missing Privacy Policy** - Must be publicly accessible URL
2. **Incomplete Data Safety** - Must accurately describe data collection
3. **Debug Keystore** - Cannot use debug keystore for release
4. **Missing Permissions Justification** - All permissions must be explained
5. **Inappropriate Content** - Ensure content is appropriate for all ages
6. **Misleading Description** - Description must match app functionality
7. **Missing Screenshots** - At least 2 screenshots required
8. **Incorrect Target SDK** - Must target recent SDK (we have 36 ✅)

## 📝 Third-Party Libraries & Licenses

### Libraries Used:
1. **React Native** - MIT License
2. **react-native-sound** - MIT License
3. **react-native-fs** - MIT License
4. **react-native-safe-area-context** - MIT License

### License Compliance:
- All libraries use permissive licenses (MIT)
- No attribution required in app
- Can be listed in Play Console if requested

## 🌐 API Usage Disclosure

### External API:
- **Service**: texttospeechfree.online
- **Purpose**: Text-to-speech conversion
- **Data Sent**: User-entered text only
- **Data Received**: Audio file URL
- **Privacy**: Refer to their privacy policy

**Note**: You should verify the API provider's terms of service and privacy policy.

## 📞 Support Information

### Required in Play Console:
- **Email**: [Your support email]
- **Website**: [Optional - your website]
- **Phone**: [Optional]

## ✅ Final Steps Before Submission

1. [ ] Build release AAB with production keystore
2. [ ] Test release APK thoroughly
3. [ ] Host privacy policy online
4. [ ] Complete all Play Console sections
5. [ ] Upload AAB file
6. [ ] Review all information
7. [ ] Submit for review

## 📚 Additional Resources

- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Play Store Policy](https://play.google.com/about/developer-content-policy/)
- [Data Safety Section Guide](https://support.google.com/googleplay/android-developer/answer/10787469)

---

**Status**: ✅ Code is Play Store ready
**Action Required**: Create production keystore and complete Play Console setup

Good luck with your submission! 🚀

