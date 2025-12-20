# Quick Start Guide

## Running the App

Use `npm run android` instead of `npx react-native run-android` to ensure you're using the local React Native CLI from your project.

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
npm run android
```

Or add these to your `~/.bashrc` or `~/.zshrc` to make them permanent:

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools
```

## Project Setup Status

✅ Dependencies installed  
✅ Android project structure exists  
✅ `local.properties` configured with SDK path  
✅ Device connected (6670d536)

## Common Commands

- `npm start` - Start Metro bundler
- `npm run android` - Build and run on Android device/emulator
- `npm run ios` - Build and run on iOS simulator (macOS only)
- `npm test` - Run tests

