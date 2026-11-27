#!/usr/bin/env bash
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" == true ]]
serial="$(adb devices | awk '/^emulator-[0-9]+[[:space:]]+device$/ {print $1}')"
[[ "$serial" =~ ^emulator-[0-9]+$ ]]
export ANDROID_SERIAL="$serial"
[[ "$(adb shell getprop ro.kernel.qemu | tr -d '\r')" == 1 ]]
pkg=com.playereden.ricochetrumble.privacyqa
out=qa-results/sr-hub-11b
mkdir -p "$out"
trap 'adb logcat -d -t 600 > "$out/final-logcat.txt" || true; adb forward --remove tcp:9222 >/dev/null 2>&1 || true; adb shell svc wifi enable; adb shell svc data enable' EXIT
adb install android/app/build/outputs/apk/debug/app-debug.apk | tee "$out/install.txt"
grep -qx Success "$out/install.txt"
for stage in connected offline reconnected; do
  adb shell am force-stop "$pkg"
  if [[ "$stage" == offline ]]; then adb shell svc wifi disable; adb shell svc data disable; else adb shell svc wifi enable; adb shell svc data enable; fi
  sleep 8
  adb shell dumpsys connectivity > "$out/$stage-connectivity.txt"
  adb shell am start -W -n "$pkg/com.playereden.ricochetrumble.MainActivity" > "$out/$stage-launch.txt"
  sleep 9
  pid="$(adb shell pidof "$pkg" | tr -d '\r' | awk '{print $1}')"
  [[ "$pid" =~ ^[0-9]+$ ]]
  adb forward tcp:9222 "localabstract:webview_devtools_remote_$pid"
  node qa/sr-hub-11b-core-offline.mjs "$stage"
  adb forward --remove tcp:9222
done
node --input-type=module - <<'JS'
import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=s=>JSON.parse(fs.readFileSync('qa-results/sr-hub-11b/'+s+'.json'));
assert.equal(read('connected').state.online,true);
assert.equal(read('offline').state.online,false);
assert.equal(read('reconnected').state.online,true);
console.log('SR_HUB_11B_OFFLINE_TRANSITIONS_PASS');
JS
