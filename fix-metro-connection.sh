#!/bin/bash
# Script to fix Metro bundler connection issues

echo "=========================================="
echo "Fixing Metro Bundler Connection"
echo "=========================================="
echo ""

# Step 1: Stop Metro
echo "1. Stopping Metro bundler..."
pkill -f "react-native start" 2>/dev/null
sleep 2

# Step 2: Clear cache
echo "2. Clearing Metro cache..."
rm -rf /tmp/metro-* /tmp/haste-* 2>/dev/null
rm -rf node_modules/.cache 2>/dev/null
rm -rf android/app/build 2>/dev/null
echo "   ✅ Cache cleared"

# Step 3: Reset port forwarding
echo "3. Resetting port forwarding..."
adb reverse --remove-all 2>/dev/null
adb reverse tcp:8081 tcp:8081
echo "   ✅ Port forwarding set: $(adb reverse --list)"

# Step 4: Start Metro in background
echo "4. Starting Metro bundler with reset cache..."
cd "$(dirname "$0")"
nohup npm start -- --reset-cache > /tmp/metro.log 2>&1 &
METRO_PID=$!
echo "   Metro PID: $METRO_PID"

# Step 5: Wait for Metro to be ready
echo "5. Waiting for Metro to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8081/status > /dev/null 2>&1; then
        echo "   ✅ Metro bundler is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "   ⚠️  Metro took too long to start. Check /tmp/metro.log"
        exit 1
    fi
    sleep 1
done

# Step 6: Restart app
echo "6. Restarting app..."
adb shell am force-stop com.texttospeech.bangla.hindi.english
sleep 1
adb shell am start -n com.texttospeech.bangla.hindi.english/.MainActivity

echo ""
echo "=========================================="
echo "✅ Done! App should now connect to Metro"
echo "=========================================="
echo ""
echo "To view Metro logs: tail -f /tmp/metro.log"
echo "To stop Metro: pkill -f 'react-native start'"


