# Step-by-Step: Create Keystore and Build Release

## Complete Process

### Step 1: Create the Keystore File

Open terminal and run:

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be asked questions - here's what to enter:**

```
Enter keystore password: [Type a strong password - remember it!]
Re-enter new password: [Type the same password again]

What is your first and last name?
  [Unknown]: Your Name or Company Name

What is the name of your organizational unit?
  [Unknown]: Development (or leave blank)

What is the name of your organization?
  [Unknown]: Your Company Name

What is the name of your City or Locality?
  [Unknown]: Dhaka (or your city)

What is the name of your State or Province?
  [Unknown]: Dhaka (or your state)

What is the two-letter country code for this unit?
  [Unknown]: BD (for Bangladesh) or IN (for India)

Is CN=Your Name, OU=Development, O=Your Company, L=Dhaka, ST=Dhaka, C=BD correct?
  [no]: yes

Enter key password for <my-key-alias>
        (RETURN if same as keystore password): [Press Enter]
```

**Important:** Remember the password you entered! You'll need it in the next step.

### Step 2: Create keystore.properties File

**Option A: Using Terminal (Linux/Mac)**

```bash
cd android
cat > keystore.properties << 'EOF'
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=YOUR_PASSWORD_HERE
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=YOUR_PASSWORD_HERE
EOF
```

Then edit the file and replace `YOUR_PASSWORD_HERE` with your actual password:

```bash
nano keystore.properties
# or
gedit keystore.properties
# or
vim keystore.properties
```

**Option B: Using File Manager**

1. Go to the `android` folder
2. Create a new file named `keystore.properties`
3. Open it in a text editor
4. Copy and paste this content:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_STORE_PASSWORD=YOUR_PASSWORD_HERE
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_KEY_PASSWORD=YOUR_PASSWORD_HERE
```

5. Replace `YOUR_PASSWORD_HERE` with the password you used in Step 1
6. Save the file

**Option C: Copy Template**

```bash
cd android
cp keystore.properties.template keystore.properties
# Then edit keystore.properties and replace YOUR_PASSWORD_HERE
```

### Step 3: Verify Files Exist

Check that both files exist:

```bash
ls -la android/app/my-release-key.keystore
ls -la android/keystore.properties
```

Both should show the files.

### Step 4: Build Release AAB

```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

**Wait for the build to complete.** It may take a few minutes.

### Step 5: Find Your Release AAB

Your release file will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Step 6: Upload to Play Store

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Go to **Testing > Internal testing**
4. Click **Create new release**
5. Under "App bundles", click **Upload**
6. Select the file: `android/app/build/outputs/bundle/release/app-release.aab`
7. Wait for upload to complete
8. Add release notes (e.g., "Initial release - Text to Speech app")
9. Click **Save**
10. Click **Review release**
11. Click **Start rollout to Internal testing**

## Troubleshooting

### Error: "keystore.properties not found"
- Make sure the file is at `android/keystore.properties` (not `android/app/keystore.properties`)
- Check the file name is exactly `keystore.properties` (no typos)

### Error: "Wrong password"
- Make sure the password in `keystore.properties` matches the password you used when creating the keystore
- Check for extra spaces or typos

### Error: "my-release-key.keystore not found"
- Make sure the keystore file is at `android/app/my-release-key.keystore`
- Or update `MYAPP_RELEASE_STORE_FILE` in `keystore.properties` to the correct path

### Build fails
- Make sure you're in the `android` directory when running `./gradlew`
- Try `./gradlew clean` first, then `./gradlew bundleRelease`

## Security Reminder

- ✅ `keystore.properties` is in `.gitignore` - it won't be committed to git
- ✅ Keep your keystore file safe - back it up!
- ✅ Never share your keystore or passwords
- ⚠️ If you lose the keystore, you cannot update your app on Play Store

---

**That's it!** Follow these steps and your app will be ready for Play Store. 🚀

