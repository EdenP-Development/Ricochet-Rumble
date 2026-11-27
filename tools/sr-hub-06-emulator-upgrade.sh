#!/usr/bin/env bash
# Tests Android package upgrade with real emulator; NOT a physical phone save acceptance.
set -euo pipefail
PKG=com.playereden.ricochetrumble.upgradeqa
ACTIVITY=com.playereden.ricochetrumble.MainActivity
BASE_APK=qa-results/sr-hub-06-upgrade/baseline-1.apk
NEXT_APK=qa-results/sr-hub-06-upgrade/current-2.apk
OUT=qa-results/sr-hub-06-upgrade
AAPT="$ANDROID_HOME/build-tools/35.0.0/aapt"
SIGNER="$ANDROID_HOME/build-tools/35.0.0/apksigner"
mkdir -p "$OUT"
# CDP listens on localhost on the GitHub runner, forwarded through ADB to
# a debug-only WebView in the emulator. Any failure aborts this rehearsal.
webview_storage_probe() {
  local stage="$1"
  local pid
  pid="$(adb shell pidof "$PKG" | tr -d '\r' | awk '{print $1}')"
  [[ "$pid" =~ ^[0-9]+$ ]]
  adb forward tcp:9222 "localabstract:webview_devtools_remote_$pid" >/dev/null
  node qa/sr-hub-06-webview-upgrade-probe.mjs "$stage"
  adb forward --remove tcp:9222 >/dev/null
}
test -s "$BASE_APK"
test -s "$NEXT_APK"
"$SIGNER" verify --min-sdk-version 26 --print-certs "$BASE_APK" > "$OUT/baseline-signer.txt"
"$SIGNER" verify --min-sdk-version 26 --print-certs "$NEXT_APK" > "$OUT/current-signer.txt"
base_cert="$(sed -nE 's/.*Signer #1 certificate SHA-256 digest: ([a-fA-F0-9:]+).*$/\1/p' "$OUT/baseline-signer.txt" | tr -d ':' | tr '[:upper:]' '[:lower:]')"
next_cert="$(sed -nE 's/.*Signer #1 certificate SHA-256 digest: ([a-fA-F0-9:]+).*$/\1/p' "$OUT/current-signer.txt" | tr -d ':' | tr '[:upper:]' '[:lower:]')"
test -n "$base_cert"
test "$base_cert" = "$SR_FIXTURE_CERT_SHA256"
sha256sum "$BASE_APK" "$NEXT_APK" > "$OUT/apk-sha256.txt"
test "$base_cert" = "$next_cert"
"$AAPT" dump badging "$BASE_APK" | head -1 > "$OUT/baseline-badging.txt"
"$AAPT" dump badging "$NEXT_APK" | head -1 > "$OUT/current-badging.txt"
grep -F "name='$PKG'" "$OUT/baseline-badging.txt"
grep -F "versionCode='1'" "$OUT/baseline-badging.txt"
grep -F "name='$PKG'" "$OUT/current-badging.txt"
grep -F "versionCode='2'" "$OUT/current-badging.txt"

[[ "${GITHUB_ACTIONS:-}" == true ]] || { echo 'Disposable CI emulator only'; exit 1; }
serial="$(adb devices | awk '/^emulator-[0-9]+[[:space:]]+device$/ {print $1}')"
[[ "$serial" =~ ^emulator-[0-9]+$ ]] || { echo 'Exactly one running emulator required'; exit 1; }
export ANDROID_SERIAL="$serial"
[[ "$(adb shell getprop ro.kernel.qemu | tr -d '\r')" == 1 ]]
if adb shell pm path "$PKG" | grep -q '^package:'; then echo 'Fresh emulator package required'; exit 1; fi
adb wait-for-device
test "$(adb shell getprop sys.boot_completed | tr -d '\r')" = 1
adb install "$BASE_APK" | tee "$OUT/baseline-install.txt"
grep -qx Success "$OUT/baseline-install.txt"
adb shell am start -W -n "$PKG/$ACTIVITY" | tee "$OUT/baseline-launch.txt"
sleep 9
adb shell pidof "$PKG" >/dev/null
adb shell "run-as $PKG sh -c 'mkdir -p files; printf SECTOR_REBOUND_UPGRADE_CANARY_v1 > files/android-update-canary.txt'"
before="$(adb shell "run-as $PKG cat files/android-update-canary.txt" | tr -d '\r')"
test "$before" = SECTOR_REBOUND_UPGRADE_CANARY_v1
before_profile=0
if adb shell "run-as $PKG ls app_webview" >/dev/null 2>&1; then before_profile=1; fi
adb shell screencap -p /sdcard/sector-qa-before.png
adb pull /sdcard/sector-qa-before.png "$OUT/before-update.png" >/dev/null
webview_storage_probe seed
# Give Chromium's asynchronous storage writer time to commit; go Home so the
# real WebView receives a normal pause/stop rather than sudden process kill.
sleep 4
adb shell input keyevent KEYCODE_HOME
sleep 3
adb shell am force-stop "$PKG"
# Control group: prove the *same* APK can reload five real WebView values after
# a process restart BEFORE attributing any failure to Android install-over.
adb shell am start -W -n "$PKG/$ACTIVITY" | tee "$OUT/baseline-relaunch.txt"
sleep 9
webview_storage_probe baseline
adb shell am force-stop "$PKG"

# Real Android package-manager upgrade: no uninstall, data reset, or cert change.
adb install -r "$NEXT_APK" | tee "$OUT/current-install.txt"
grep -qx Success "$OUT/current-install.txt"
after="$(adb shell "run-as $PKG cat files/android-update-canary.txt" | tr -d '\r')"
test "$after" = "$before"
adb shell am start -W -n "$PKG/$ACTIVITY" | tee "$OUT/current-launch.txt"
sleep 9
adb shell pidof "$PKG" >/dev/null
test "$(adb shell "run-as $PKG cat files/android-update-canary.txt" | tr -d '\r')" = "$before"
webview_storage_probe verify
after_profile=0
if adb shell "run-as $PKG ls app_webview" >/dev/null 2>&1; then after_profile=1; fi
adb shell screencap -p /sdcard/sector-qa-after.png
adb pull /sdcard/sector-qa-after.png "$OUT/after-update.png" >/dev/null
adb shell dumpsys package "$PKG" | grep -m 1 'versionCode=2' > "$OUT/installed-version.txt"
cat > "$OUT/README.txt" <<EOF
ANDROID_EMULATOR_PACKAGE_UPGRADE_PASS
PACKAGE: $PKG
VERSION 1 -> 2
CERT SHA256 IDENTICAL: $next_cert
REAL adb install -r, no uninstall/data clearing: PASS
APP-PRIVATE CANARY PERSISTED: YES
REAL WEBVIEW 8-SAVE RECORDS + DOSSIER UI PERSISTED: YES (synthetic test fixtures)
WEBVIEW PROFILE DIRECTORY BEFORE: $before_profile
WEBVIEW PROFILE DIRECTORY AFTER: $after_profile
BOTH ACTIVITY LAUNCHES: PASS
SCOPE: Emulator Android package upgrade and app-private file persistence only.
This does NOT prove save preservation on the owner's physical phone or non-debug beta,
two physical Wi-Fi devices, or production Play bundle signing/upgrades.
EOF
cat "$OUT/README.txt"
