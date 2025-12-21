#!/bin/bash
# Helper script to run the app with correct package name

PACKAGE_NAME="com.texttospeech.bangla.hindi.english"
ACTIVITY_CLASS="${PACKAGE_NAME}.MainActivity"

echo "=========================================="
echo "Text to Speech BD - App Runner"
echo "=========================================="
echo ""
echo "Package: ${PACKAGE_NAME}"
echo "Activity: ${ACTIVITY_CLASS}"
echo ""

# Check if device is connected
if ! adb devices | grep -q "device$"; then
    echo "❌ No Android device connected!"
    echo "Please connect your device via USB and enable USB debugging."
    exit 1
fi

echo "✅ Device connected"
echo ""

# Setup port forwarding
echo "Setting up port forwarding..."
adb reverse tcp:8081 tcp:8081

# Check if Metro bundler is running
if ! curl -s http://localhost:8081/status > /dev/null 2>&1; then
    echo "⚠️  Metro bundler not running on port 8081"
    echo "Please start it in another terminal with: npm start"
    echo ""
fi

# Stop the app
echo "Stopping app..."
adb shell am force-stop "${PACKAGE_NAME}" 2>/dev/null

# Start the app - use package/.ActivityName format
echo "Starting app..."
adb shell am start -n "${PACKAGE_NAME}/.MainActivity"

echo ""
echo "✅ App launched!"
echo ""
echo "To reload the app:"
echo "  - Shake device and select 'Reload'"
echo "  - Or press 'R' in Metro bundler terminal"
echo "  - Or run: adb shell input text 'RR'"
echo ""

