#!/bin/bash

# Script to debug ads in production build

echo "=========================================="
echo "AdMob Ads Debugging"
echo "=========================================="
echo ""
echo "This will show ad-related logs from your device"
echo "Make sure your device is connected via USB"
echo ""

# Clear log buffer
adb logcat -c

echo "📱 Watching for ad-related logs..."
echo "   (Open your app and try to show an ad)"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Filter for ad-related logs
adb logcat | grep -i -E "ads|admob|adservice|rewarded|🎯|🔄|✅|❌|reactnativejs|mobileads"

