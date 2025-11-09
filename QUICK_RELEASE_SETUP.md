# Quick Release Setup for Play Store

## ⚠️ Error: "signed in debug mode"

Your app bundle is currently signed with a debug keystore. Play Store requires a release-signed bundle.

## ✅ Solution: 3 Steps

### Step 1: Create Production Keystore (5 minutes)

Run this command in your terminal:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**When prompted, enter:**
- **Password**: Choose a strong password (remember it!)
- **Name**: Your name or company
- **Organization**: Your organization name
- **City**: Your city
- **State**: Your state/province  
- **Country**: BD (for Bangladesh) or IN (for India)

**Example:**
```
Enter keystore password: MySecurePass123!
Re-enter password: MySecurePass123!
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
Is CN=Your Name, OU=Development, O=Your Company, L=Dhaka, ST=Dhaka, C=BD correct?
  [no]: yes
```

### Step 2: Create keystore.properties File

Create a new file: `android/keystore.properties`

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=MySecurePass123!
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=MySecurePass123!
```

**Replace `MySecurePass123!` with the password you used in Step 1.**

### Step 3: Build Release AAB

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

**Your release AAB will be at:**
`android/app/build/outputs/bundle/release/app-release.aab`

## 📤 Upload to Play Store

1. Go to **Play Console > Your App > Testing > Internal testing**
2. Click **Create new release**
3. Upload: `android/app/build/outputs/bundle/release/app-release.aab`
4. Add release notes (e.g., "Initial release")
5. Click **Save** then **Review release**

## 🔒 Security Notes

- ✅ `keystore.properties` is already in `.gitignore` (won't be committed)
- ✅ Keep your keystore file safe - you'll need it for ALL future updates
- ✅ Back up your keystore file to a secure location
- ❌ Never share your keystore or passwords

## ❌ If You Lose Your Keystore

**You CANNOT update your app on Play Store if you lose the keystore!**
- You'll have to create a new app listing
- All existing users will need to uninstall and reinstall
- You'll lose all reviews and ratings

**Solution:** Keep multiple secure backups!

## ✅ Verification

After building, verify it's release-signed:

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

You should see "jar verified" if it's correctly signed.

---

**That's it!** Your app is now ready for Play Store. 🚀

