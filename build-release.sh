#!/bin/bash

# Build Release Bundle for Play Store
# This script builds the release AAB bundle for uploading to Google Play Store

set -e  # Exit on error

echo "=========================================="
echo "Building Release Bundle for Play Store"
echo "=========================================="
echo ""
echo "App: Text to Speech BD"
echo "Version Code: 2"
echo "Version Name: 1.0.1"
echo "Package: com.texttospeech.bangla.hindi.english"
echo ""

# Check if keystore.properties exists
if [ ! -f "android/keystore.properties" ]; then
    echo "⚠️  WARNING: android/keystore.properties not found!"
    echo ""
    echo "For production release, you need to create keystore.properties with your release keystore info."
    echo "The build will use debug signing as fallback."
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Navigate to android directory
cd android

echo "Cleaning previous builds..."
./gradlew clean

echo ""
echo "Building release bundle (AAB)..."
./gradlew bundleRelease

echo ""
echo "✅ Build complete!"
echo ""
echo "Release bundle location:"
echo "  android/app/build/outputs/bundle/release/app-release.aab"
echo ""
echo "You can now upload this AAB file to Google Play Console."
echo ""
echo "To test the release build first, run:"
echo "  ./gradlew assembleRelease"
echo "  adb install app/build/outputs/apk/release/app-release.apk"

