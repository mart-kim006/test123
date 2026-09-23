#!/usr/bin/env bash
# Builds GolfScore.app for the iOS simulator and zips it for Appetize.
# Requires macOS with Xcode, and web/dist/inline.html (npm run build:inline).
set -euo pipefail
cd "$(dirname "$0")"

rm -rf build
mkdir -p build/GolfScore.app
SDK="$(xcrun --sdk iphonesimulator --show-sdk-path)"

for arch in arm64 x86_64; do
  xcrun --sdk iphonesimulator swiftc -parse-as-library -O \
    -target "$arch-apple-ios16.0-simulator" -sdk "$SDK" \
    GolfScore/*.swift -o "build/GolfScore-$arch"
done

lipo -create build/GolfScore-arm64 build/GolfScore-x86_64 -output build/GolfScore.app/GolfScore
cp GolfScore/Info.plist build/GolfScore.app/Info.plist
cp ../web/dist/inline.html build/GolfScore.app/index.html
codesign --force --sign - build/GolfScore.app

(cd build && zip -qry GolfScore.zip GolfScore.app)
echo "Built ios/build/GolfScore.zip"
