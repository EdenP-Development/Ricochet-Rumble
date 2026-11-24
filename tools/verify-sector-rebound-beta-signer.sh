#!/usr/bin/env bash
# Sector Rebound: non-publishing CI preflight for a dedicated private itch.io beta signer.
# NEVER echo/print/read back secret values or upload the keystore or signed probe.
set -euo pipefail
umask 077
expected_cert='43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7'
secret_names=(
  SECTOR_REBOUND_BETA_KEYSTORE_BASE64
  SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD
  SECTOR_REBOUND_BETA_KEY_ALIAS
  SECTOR_REBOUND_BETA_KEY_PASSWORD
)
for secret_name in "${secret_names[@]}"; do
  if [[ -z "${!secret_name:-}" ]]; then
    echo "::error::Missing signing secret: $secret_name (check organization secret repository scope)"
    exit 1
  fi
done
if [[ "${GITHUB_ACTIONS:-}" == 'true' ]]; then
  [[ "${GITHUB_REPOSITORY:-}" == 'EdenP-Development/Ricochet-Rumble' && "${GITHUB_REF:-}" == 'refs/heads/main' ]] || {
    echo "::error::Signing preflight is restricted to trusted organization main"
    exit 1
  }
fi
private_dir="$(mktemp -d)"
trap 'rm -rf "$private_dir"' EXIT
store="$private_dir/sector-rebound-beta.p12"
printf '%s' "$SECTOR_REBOUND_BETA_KEYSTORE_BASE64" | base64 --decode > "$store" || {
  echo "::error::Keystore secret is not valid base64"
  exit 1
}
[[ -s "$store" ]] || { echo "::error::Keystore secret is empty"; exit 1; }
keytool -exportcert -storetype PKCS12 -keystore "$store" \
  -storepass:env SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD \
  -alias "$SECTOR_REBOUND_BETA_KEY_ALIAS" > "$private_dir/cert.der" 2> "$private_dir/keytool.log" || {
    echo "::error::Keystore password or alias invalid"
    exit 1
  }
actual_cert="$(sha256sum "$private_dir/cert.der" | awk '{print $1}')"
if [[ "$actual_cert" != "$expected_cert" ]]; then
  echo "::error::Signing certificate mismatch: refusing unknown/replacement keystore"
  exit 1
fi
printf 'Sector Rebound dedicated beta original signing key - internal CI probe only\n' > "$private_dir/probe.txt"
jar --create --file "$private_dir/unsigned.jar" -C "$private_dir" probe.txt
jarsigner -keystore "$store" -storetype PKCS12 \
  -storepass:env SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD \
  -keypass:env SECTOR_REBOUND_BETA_KEY_PASSWORD \
  -signedjar "$private_dir/signed.jar" "$private_dir/unsigned.jar" \
  "$SECTOR_REBOUND_BETA_KEY_ALIAS" > "$private_dir/jarsigner.log" 2>&1 || {
    echo "::error::Original private key could not sign (check key password)"
    exit 1
  }
jarsigner -verify "$private_dir/signed.jar" > "$private_dir/verify.log" 2>&1 || {
  echo "::error::Signed proof did not verify"
  exit 1
}
grep -Eiq 'jar verified' "$private_dir/verify.log" || {
  echo "::error::Signer verification did not confirm a valid signature"
  exit 1
}
# Only public non-secret facts may appear in the Actions log or summary.
printf 'SECTOR_REBOUND_BETA_SIGNING_PREFLIGHT_PASS cert_sha256=%s\n' "$actual_cert"
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  {
    echo '## Sector Rebound — dedicated beta signer'
    echo ''
    echo '**Original certificate and actual private-key signing:** PASS'
    echo ''
    printf 'Certificate SHA-256: `%s`\n' "$actual_cert"
    echo ''
    echo 'Secrets remain in restricted GitHub Actions env. No key bytes, passwords or signed distributable APK uploaded.'
    echo ''
    echo 'This is a signing preflight only: beta gameplay, APK/package identity, save migration and publication are **not** approved or tested by this job.'
  } >> "$GITHUB_STEP_SUMMARY"
fi
