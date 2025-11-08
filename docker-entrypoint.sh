#!/bin/bash

# Make the script executable
chmod +x docker-entrypoint.sh

# Wait for the package.json to be mounted
while [ ! -f /app/package.json ]
do
    echo "Waiting for package.json to be mounted..."
    sleep 1
done

# Install dependencies if node_modules doesn't exist
if [ ! -d "/app/node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Set up ADB reverse port
adb reverse tcp:8081 tcp:8081

# Start Metro bundler in the background
echo "Starting Metro bundler..."
npx react-native start &

# Wait for Metro to be ready
sleep 5

# Start the Android app
echo "Starting Android app..."
npx react-native run-android --verbose

# Keep the container running
tail -f /dev/null 