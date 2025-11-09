# Build Release AAB - Commands

## ✅ Step 1: Clean (Already Done!)
```bash
cd android
./gradlew clean
```
✅ **Status: COMPLETED**

## 🔨 Step 2: Build Release AAB
Run this command:

```bash
./gradlew bundleRelease
```

This will:
- Build the release version of your app
- Sign it with your release keystore
- Create an AAB file ready for Play Store

**Expected output:**
- "BUILD SUCCESSFUL"
- AAB file created at: `app/build/outputs/bundle/release/app-release.aab`

**Time:** This may take 5-10 minutes depending on your system.

## 📤 Step 3: Upload to Play Store

After build completes, upload:
```
app/build/outputs/bundle/release/app-release.aab
```

This AAB will be properly signed in **release mode** (not debug mode).

---

**Run the build command now:**
```bash
./gradlew bundleRelease
```


