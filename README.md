# Golf Score

A golf scoring app for Android, driven on an [Appetize](https://docs.appetize.io/agentic-flows) cloud device with live reload.

- `web/` — the app UI (Vite). Edits hot-reload on the device.
- `ios/` — a WKWebView shell for the iOS simulator, built by `.github/workflows/ios-appetize.yml` on macOS and uploaded to Appetize.
- `android/` — a thin native shell: a WebView that loads the Vite dev server over `adb reverse`, falling back to the bundled build when it is unreachable.

## Run it on Appetize

```bash
npm install -g @appetize/cli
export APPETIZE_API_TOKEN=tok_...

(cd web && npm install && npm run build)
(cd android && ./gradlew assembleDebug)
appetize build upload android/app/build/outputs/apk/debug/app-debug.apk --wait

appetize session start pixel7 <build-id> --device-os-version 14
adb connect <adbSerial>
adb -s <adbSerial> reverse tcp:5173 tcp:5173
(cd web && npm run dev)
adb -s <adbSerial> shell am start -S -n io.appetize.golf/.MainActivity
```

Edit anything in `web/src` and the device updates in place.

`android/local.properties` must point `sdk.dir` at an Android SDK with `platforms;android-34` and `build-tools;34.0.0`.

## iOS

`ios/build.sh` compiles the shell with `swiftc` (no Xcode project), bundles `web/dist/inline.html` and zips `GolfScore.app`. The workflow runs it on every push that touches `web/` or `ios/` and uploads the zip to Appetize when the `APPETIZE_API_TOKEN` repository secret is set; the build id is shown in the run summary.

```bash
appetize session start iphone16pro <build-id>
```

## Recording a demo

The terminal is recorded with [VHS](https://github.com/charmbracelet/vhs) and the device with `appetize recording start <file>` / `appetize recording stop`. The two videos are then placed side by side with ffmpeg, offset by the wall-clock time between the start of each recording.
