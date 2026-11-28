#!/usr/bin/env bash
# Main-only, explicit owner approval; signs an independently identified staged APK.
set -euo pipefail
umask 077
[[ "${GITHUB_REPOSITORY:-}" == EdenP-Development/Ricochet-Rumble && "${GITHUB_REF:-}" == refs/heads/main && "${GITHUB_EVENT_NAME:-}" == workflow_dispatch ]] || { echo 'Trusted main manual dispatch required'; exit 1; }
[[ "${SR_OWNER_APPROVED:-}" == true && "${SR_RECOVERY_CONFIRMED:-}" == true ]] || { echo 'Owner acceptance and recovery attestation required'; exit 1; }
# Explicit canonical version contract; no implicit default or downgrade acceptance.
[[ "${SR_VERSION_CODE:-}" =~ ^[1-9][0-9]{0,9}$ && "${SR_PREVIOUS_VERSION_CODE:-}" =~ ^(0|[1-9][0-9]{0,9})$ ]] || { echo 'Invalid version contract'; exit 1; }
(( SR_VERSION_CODE <= 2100000000 && SR_VERSION_CODE == SR_PREVIOUS_VERSION_CODE + 1 )) || { echo 'Version must increment approved baseline'; exit 1; }
[[ "${SR_VERSION_NAME:-}" == "0.9.80-beta.$SR_VERSION_CODE" ]] || { echo 'Version name mismatch'; exit 1; }
expected_cert=43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7
apk="$1"; output="$2"
[[ "${SR_EXPECTED_UNSIGNED_SHA:-}" =~ ^[0-9a-f]{64}$ ]]
[[ "$(sha256sum "$apk" | cut -d ' ' -f1)" == "$SR_EXPECTED_UNSIGNED_SHA" ]]
sdk="$ANDROID_HOME/build-tools/35.0.0"
for name in SECTOR_REBOUND_BETA_KEYSTORE_BASE64 SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD SECTOR_REBOUND_BETA_KEY_ALIAS SECTOR_REBOUND_BETA_KEY_PASSWORD; do
  [[ -n "${!name:-}" ]] || { echo "Missing required secret name: $name"; exit 1; }
done
private="$(mktemp -d)"
trap 'rm -rf "$private"' EXIT
"$sdk/aapt" dump badging "$apk" > "$private/badging"
grep -F "name='com.playereden.ricochetrumble.beta' versionCode='${SR_VERSION_CODE}' versionName='${SR_VERSION_NAME}'" "$private/badging"
if grep -q application-debuggable "$private/badging"; then echo "Refusing debuggable APK"; exit 1; fi
if "$sdk/apksigner" verify "$apk" > /dev/null 2>&1; then echo 'Refusing already signed input'; exit 1; fi
printf '%s' "$SECTOR_REBOUND_BETA_KEYSTORE_BASE64" | base64 --decode > "$private/key.p12"
keytool -exportcert -storetype PKCS12 -keystore "$private/key.p12" -storepass:env SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD -alias "$SECTOR_REBOUND_BETA_KEY_ALIAS" > "$private/cert.der" 2>"$private/keytool.log"
[[ "$(sha256sum "$private/cert.der" | cut -d ' ' -f1)" == "$expected_cert" ]] || { echo 'Certificate mismatch; stop'; exit 1; }
"$sdk/zipalign" -c -P 16 4 "$apk" > /dev/null
"$sdk/apksigner" sign --ks "$private/key.p12" --ks-type PKCS12 --ks-key-alias "$SECTOR_REBOUND_BETA_KEY_ALIAS" --ks-pass env:SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD --key-pass env:SECTOR_REBOUND_BETA_KEY_PASSWORD --out "$private/signed.apk" "$apk" > "$private/sign.log" 2>&1
"$sdk/apksigner" verify --min-sdk-version 26 --print-certs "$private/signed.apk" > "$private/verify"
[[ "$(grep -c '^Signer #[0-9]* certificate SHA-256 digest:' "$private/verify")" == 1 ]]
grep -Fx "Signer #1 certificate SHA-256 digest: $expected_cert" "$private/verify"
"$sdk/aapt" dump badging "$private/signed.apk" > "$private/signed-badging"
cmp "$private/badging" "$private/signed-badging"
"$sdk/zipalign" -c -P 16 4 "$private/signed.apk" > /dev/null
python3 - "$apk" "$private/signed.apk" <<'PY'
import sys,zipfile,hashlib
def members(path):
    with zipfile.ZipFile(path) as z:
        names=z.namelist()
        if len(names)!=len(set(names)): raise ValueError("duplicate ZIP names")
        return {n:hashlib.sha256(z.read(n)).hexdigest() for n in names if not n.startswith("META-INF/")}
if members(sys.argv[1])!=members(sys.argv[2]): raise ValueError("non-signature payload changed")
PY
mkdir -p "$output"
cp "$private/signed.apk" "$output/Sector-Rebound-Beta-INTERNAL-REVIEW.apk"
cp "$private/signed-badging" "$output/badging.txt"
printf 'SOURCE_SHA=%s\nUNSIGNED_SHA256=%s\nCERTIFICATE_SHA256=%s\nAPK_SHA256=%s\nVERSION_CODE=%s\nVERSION_NAME=%s\nPREVIOUS_VERSION_CODE=%s\nCHANNEL=private-beta-review\nPUBLICATION=NOT_AUTHORIZED\n' "$GITHUB_SHA" "$SR_EXPECTED_UNSIGNED_SHA" "$expected_cert" "$(sha256sum "$output/Sector-Rebound-Beta-INTERNAL-REVIEW.apk" | cut -d ' ' -f1)" "$SR_VERSION_CODE" "$SR_VERSION_NAME" "$SR_PREVIOUS_VERSION_CODE" > "$output/verification.txt"
