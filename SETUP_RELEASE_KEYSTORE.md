# Setup Release Keystore for Play Store

## ✅ Found Keystore File

Found keystore file: `android/app/my-release-key.keystore`

## Step 1: Verify the Keystore Fingerprint

Run this command to check if this keystore matches Play Store requirements:

```bash
./check-keystore.sh
```

Or manually:
```bash
keytool -list -v -keystore android/app/my-release-key.keystore
```

**Expected SHA1:** `3D:72:65:07:5F:A8:F8:15:76:89:99:FA:89:6B:10:98:A3:BC:78:A1`

If the SHA1 matches → This is the correct keystore! ✅  
If it doesn't match → This is not the right keystore ❌

## Step 2: Set Up keystore.properties

Once you confirm the keystore is correct, create `android/keystore.properties`:

```properties
storeFile=../app/my-release-key.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=YOUR_KEY_ALIAS
keyPassword=YOUR_KEY_PASSWORD
```

**Replace:**
- `YOUR_KEYSTORE_PASSWORD` - The password you used when creating the keystore
- `YOUR_KEY_ALIAS` - The alias name (often "my-key-alias" or similar)
- `YOUR_KEY_PASSWORD` - Usually the same as keystore password

## Step 3: Rebuild Release Bundle

After setting up `keystore.properties`, rebuild:

```bash
./build-release.sh
```

The new bundle will be signed with the correct keystore and should be accepted by Play Store.

## Important Notes

1. **Keep keystore.properties secure** - Don't commit it to git
2. **Backup your keystore** - Store it in a safe place
3. **Use the same keystore** for all future updates

## If This Keystore Doesn't Match

If `my-release-key.keystore` doesn't have the correct fingerprint, you need to find the original keystore that was used to publish the first version. Check:
- Backups
- Other computers
- Cloud storage (Google Drive, Dropbox, etc.)
- Team members (if it's a shared project)

