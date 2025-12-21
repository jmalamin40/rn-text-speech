#!/bin/bash

# Script to check keystore fingerprint
# This will help verify if my-release-key.keystore matches Play Store requirements

echo "=========================================="
echo "Keystore Fingerprint Checker"
echo "=========================================="
echo ""
echo "Expected SHA1 (from Play Store):"
echo "3D:72:65:07:5F:A8:F8:15:76:89:99:FA:89:6B:10:98:A3:BC:78:A1"
echo ""
echo "Checking: android/app/my-release-key.keystore"
echo ""
echo "You will be prompted for the keystore password."
echo ""

keytool -list -v -keystore android/app/my-release-key.keystore

echo ""
echo "=========================================="
echo "Look for 'SHA1:' in the output above"
echo "It should match the expected SHA1 shown above"
echo "=========================================="

