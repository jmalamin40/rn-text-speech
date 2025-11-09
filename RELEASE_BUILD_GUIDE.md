# Release Build Guide for Play Store

## Step 1: Create Production Keystore

**IMPORTANT:** Do this only once. Keep the keystore file safe - you'll need it for all future updates!

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be asked for:**
- Keystore password: (choose a strong password, remember it!)
- Re-enter password: (same password)
- Your name: (your name or company name)
- Organizational Unit: (optional)
- Organization: (your organization name)
- City: (your city)
- State: (your state/province)
- Country code: (e.g., BD for Bangladesh, IN for India)

**Example:**
```
Enter keystore password: [YourPassword123!]
Re-enter new password: [YourPassword123!]
What is your first and last name?
  [Unknown]: Your Name
What is the name of your organizational unit?
  [Unknown]: Development
What is the name of your organization?
  [Unknown]: Your Company
What is the name of your City or Locality?
  [Unknown]: Dhaka
What is the name of your State or Province?
  [Unknown]: Dhaka
What is the two-letter country code for this unit?
  [Unknown]: BD
```

## Step 2: Create keystore.properties File

Create a file `android/keystore.properties` with your keystore information:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=YourPassword123!
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=YourPassword123!
```

**⚠️ SECURITY WARNING:**
- Never commit `keystore.properties` to git (already in .gitignore)
- Never share your keystore file or passwords
- Keep backups of your keystore file in a secure location

## Step 3: Update build.gradle

The build.gradle file needs to be updated to use the release keystore. See the updated file.

## Step 4: Build Release AAB

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

**Output location:**
`android/app/build/outputs/bundle/release/app-release.aab`

## Step 5: Verify the AAB

You can verify the AAB is signed correctly:

```bash
# Check if it's signed (should show release signature)
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

## Step 6: Upload to Play Store

1. Go to Google Play Console
2. Select your app
3. Go to **Testing > Internal testing**
4. Click **Create new release**
5. Upload the `app-release.aab` file from:
   `android/app/build/outputs/bundle/release/app-release.aab`
6. Fill in release notes
7. Click **Save** then **Review release**

## Troubleshooting

### Error: "signed in debug mode"
- Make sure you created the keystore
- Make sure keystore.properties exists and has correct paths
- Make sure build.gradle is updated (see next section)
- Run `./gradlew clean` before building

### Error: "keystore.properties not found"
- Make sure the file is at `android/keystore.properties`
- Check file permissions

### Error: "Wrong password"
- Double-check passwords in keystore.properties
- Make sure passwords match what you entered when creating keystore

## Next Steps After Upload

1. Complete Data Safety section
2. Add Privacy Policy URL
3. Upload screenshots
4. Complete content rating
5. Submit for review

