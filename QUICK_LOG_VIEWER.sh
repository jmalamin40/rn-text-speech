#!/bin/bash
# Quick log viewer for React Native and AdMob

echo "=========================================="
echo "React Native AdMob Log Viewer"
echo "=========================================="
echo ""
echo "Watching logs (Press Ctrl+C to stop)..."
echo ""

adb logcat -c
adb logcat | grep -iE "ReactNativeJS|mobileAds|Rewarded|Ad.*load|Error.*Ads|Initializing.*Ads"


