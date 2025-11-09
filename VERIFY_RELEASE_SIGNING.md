# Verify Release Signing Setup

## Current Configuration Status

✅ **Keystore File**: `android/app/my-release-key.keystore` (exists)
✅ **Properties File**: `android/keystore.properties` (exists)
✅ **Password**: Configured in properties file

## Important: Rebuild Required!

If you built the AAB **before** setting up the keystore, it will still be signed in debug mode. You **MUST rebuild** after configuring the keystore.

## Steps to Build Release AAB

### 1. Clean Previous Builds
```bash
cd android
./gradlew clean
```

### 2. Build Release AAB
```bash
./gradlew bundleRelease
```

**This will take a few minutes. Wait for it to complete.**

### 3. Verify the AAB is Release-Signed

Check the output - you should see:
- ✅ "BUILD SUCCESSFUL"
- ✅ No warnings about debug signing

### 4. Verify Signing (Optional)

```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab | head -20
```

You should see certificate information (not debug certificate).

## Common Issues

### Issue: Still shows "signed in debug mode"

**Solution:**
1. Make sure you ran `./gradlew clean` first
2. Make sure `android/keystore.properties` exists and has correct password
3. Make sure `android/app/my-release-key.keystore` exists
4. Rebuild: `./gradlew bundleRelease`

### Issue: "keystore.properties not found"

**Check:**
- File must be at: `android/keystore.properties` (not `android/app/keystore.properties`)
- File must be readable

### Issue: "Wrong password"

**Check:**
- Password in `keystore.properties` must match the password you used when creating the keystore
- No extra spaces or quotes in the password

## Next Steps After Successful Build

1. Upload the NEW AAB file to Play Store
2. The file location: `android/app/build/outputs/bundle/release/app-release.aab`
3. Delete the old debug-signed AAB from Play Console if you uploaded one

---

**Remember:** You must rebuild after configuring the keystore!


