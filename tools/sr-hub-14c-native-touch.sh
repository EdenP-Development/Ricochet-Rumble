#!/usr/bin/env bash
# Use the exact historical review APK, no source modification or CDP input.
set -euo pipefail
[[ "${GITHUB_ACTIONS:-}" == true ]]
serial="$(adb devices | awk '/^emulator-[0-9]+[[:space:]]+device$/ {print $1}')"
[[ "$serial" =~ ^emulator-[0-9]+$ ]]
export ANDROID_SERIAL="$serial"
[[ "$(adb shell getprop ro.kernel.qemu | tr -d '\r')" == 1 ]]
pkg=com.playereden.ricochetrumble.spudacusqa
out=qa-results/sr-hub-14c
mkdir -p "$out"
trap 'timeout 15 adb logcat -d -t 800 > "$out/final-logcat.txt" || true; timeout 15 adb shell dumpsys activity activities > "$out/final-activities.txt" || true' EXIT
timeout 60 adb install "$RUNNER_TEMP/r10.apk" | tee "$out/install.txt"
grep -qx Success "$out/install.txt"
timeout 15 adb shell am start -W -n "$pkg/com.playereden.ricochetrumble.MainActivity" | tee "$out/launch.txt"
sleep 8
timeout 15 adb shell wm size > "$out/display.txt"
timeout 15 adb shell wm density >> "$out/display.txt"
# Accessibility tree provides real native bounds. No hardcoded touch coordinates.
capture(){
 local name="$1"
 timeout 15 adb exec-out screencap -p > "$out/$name.png"
 timeout 20 adb shell uiautomator dump /sdcard/srqa-window.xml > "$out/$name-dump.txt"
 timeout 10 adb pull /sdcard/srqa-window.xml "$out/$name.xml" >/dev/null
 timeout 10 adb shell pidof "$pkg" > "$out/$name-pid.txt"
}
tap(){
 local name="$1" pattern="$2" xy
 xy="$(python3 - "$out/$name.xml" "$pattern" <<'PY'
import sys,re,xml.etree.ElementTree as ET
root=ET.parse(sys.argv[1])
matches=[]
for n in root.iter('node'):
    if n.get('enabled')!='true': continue
    if re.search(sys.argv[2], ' '.join(n.get(k,'') for k in ('text','content-desc')),re.I):
        b=list(map(int,re.findall(r'\d+',n.get('bounds',''))))
        if len(b)==4 and b[2]>b[0] and b[3]>b[1]: matches.append(((b[2]-b[0])*(b[3]-b[1]),(b[0]+b[2])//2,(b[1]+b[3])//2))
assert matches, 'no accessible control: '+sys.argv[2]
_,x,y=min(matches)
print(x,y)
PY
)"
 read -r x y <<< "$xy"
 timeout 10 adb shell input tap "$x" "$y"
 sleep 3
}
capture home
tap home 'Customize Solo paint and insignia|^HANGAR$'
capture hangar
tap hangar 'MOSS.*AVAILABLE|^MOSS$'
capture moss
grep -qi 'EQUIPPED.*MOSS\|MOSS.*PREVIEW' "$out/moss.xml"
tap moss 'BACK'
capture home-return
tap home-return 'CHOOSE MODE'
capture modes
tap modes 'PRACTICE'
capture practice
grep -qi 'PRACTICE FIELD' "$out/practice.xml"
echo 'SR_HUB_14C_NATIVE_TOUCH_PASS visible Moss and Practice labels; physical gameplay not established'
