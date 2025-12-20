# Fix NDK and Permission Issues

## Step 1: Fix Android Cache Permissions

Run this command in your terminal:

```bash
sudo chown -R $USER:$USER ~/.android
```

## Step 2: Install Required NDK Version

React Native 0.83.1 requires NDK version 27.0.12077973. Install it using one of these methods:

### Option A: Using SDK Manager (Recommended)

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk

# Accept licenses first
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses

# Install the NDK
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "ndk;27.0.12077973"
```

### Option B: Using Android Studio

1. Open Android Studio
2. Go to Tools → SDK Manager
3. Click on "SDK Tools" tab
4. Check "Show Package Details"
5. Expand "NDK (Side by side)"
6. Check version 27.0.12077973
7. Click "Apply" to install

## Step 3: Verify Installation

```bash
ls -d $HOME/Android/Sdk/ndk/27.0.12077973
```

If the directory exists, you're good to go!

## Step 4: Build Again

```bash
cd /home/solalamin/test/rn-text-speech
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
npm run android
```

## Alternative: Use Available NDK Version

If NDK 27.0.12077973 is not available, you can try using an available version by updating `android/build.gradle`:

```gradle
ndkVersion = "21.4.7075529"  // or any available version
```

However, React Native 0.83.1 may require the specific NDK version for compatibility.

