# Sector Rebound — Private itch.io beta signing setup

**Verified locally:** November 24, 2026. **CI sign verification:** PENDING four organization secrets and a trusted-main workflow run. **No public Sector Rebound release authorized.**

## Why a new key was created

The original Sector Rebound `com.playereden.ricochetrumble` production keystore/custody has **not** been verified. Existing `com.playereden.ricochetrumble.preview` code 420001 uses the **public AOSP test certificate**, which is not a confidential signing credential. M13-C/M13-F comparison packages use disposable debug keys. The owner explicitly requested a new, **separate future itch.io beta signing identity** after transferring this same GitHub repository to EdenP-Development.

These existing identities **must not be changed or overwritten**. The new key does not upgrade the old `.preview`, normal default, or disposable M13 preview apps.

## Proposed first public beta channel

| Field | Verified value / status |
|---|---|
| Public game | Sector Rebound |
| Repository | `EdenP-Development/Ricochet-Rumble` (same ID `1434527636`) |
| Proposed new Android package | `com.playereden.ricochetrumble.beta` |
| Signing type | PKCS#12, RSA 4096, SHA256withRSA, 10,000-day certificate |
| Alias (public identifier only) | `sector-rebound-beta` |
| Pinned signing certificate SHA-256 | `43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7` |
| Private-key material generated | **YES**, securely exported to owner-facing download, **NOT** placed in the repository |
| Local keytool certificate export | **PASS** |
| Local private-key `jarsigner` operation | **PASS** |
| Independently encrypted GPG recovery copy / round-trip | **PASS**; owner backup custody **not yet confirmed** |
| GitHub Secrets existence / scope / original key operation | **PENDING** owner entering four values, then CI |
| Beta Android app packaging / real beta APK / install-over | **NOT IMPLEMENTED, NOT VERIFIED** |
| itch.io publication | **NOT PUBLISHED** |

This package ID is deliberately separate from `com.playereden.ricochetrumble`, `com.playereden.ricochetrumble.preview`, `com.playereden.ricochetrumble.m13fusion` and `com.playereden.ricochetrumble.m13compare`. Google Play may use a different package later; **no transfer of old saves is guaranteed**. Do not change the game app's current application ID or merge M13-F just because a signing key now exists.

## Owner Actions Secrets setup

1. Use the separately delivered **private** values file and original `.p12`; **never send the values into a public GitHub issue, README, build log, or ChatGPT reply**.
2. Visit https://github.com/organizations/EdenP-Development/settings/secrets/actions and create organization-level Actions secrets with these exact names:
   - `SECTOR_REBOUND_BETA_KEYSTORE_BASE64`
   - `SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD`
   - `SECTOR_REBOUND_BETA_KEY_ALIAS`
   - `SECTOR_REBOUND_BETA_KEY_PASSWORD`
3. Each secret's repository access must be **Selected repositories → Ricochet-Rumble only**, not all EdenP repositories. This is a separate certificate from Sudoku, Grid Hunt, Crossroads and Eden Comms.
4. Keep the password-protected original PKCS#12 in an owner-controlled private encrypted vault and a second, independently recoverable offline encrypted archive. The generated GPG recovery archive has a **different recovery password**; keep the password in a password manager separate from the archive and periodically test the backup. A GitHub Secret **cannot be read back or used as a backup**.

## Actual CI verification after secret entry

Workflow: [sector-rebound-beta-signing-preflight.yml](../.github/workflows/sector-rebound-beta-signing-preflight.yml).
Audit script: [verify-sector-rebound-beta-signer.sh](../tools/verify-sector-rebound-beta-signer.sh).

The job runs **only from this repository's trusted `main`**, as `workflow_dispatch` or after a change to `docs/signing/SECTOR_REBOUND_BETA_PREFLIGHT_TRIGGER.md` on `main`. The trigger file is intentionally created **only after** the owner has set all four secrets, so the initial workflow installation never has to run with missing keys.

The job validates required variables without printing their contents; decodes the keystore in a temporary permissions-restricted directory; uses `keytool -exportcert` to compare the **actual** certificate's SHA-256 to the pinned public fingerprint; signs a tiny throwaway JAR with the private key; verifies that signature; then cleans all temporary signing files. Only **non-secret fingerprint and PASS/FAIL** appear in the Actions summary. **It neither distributes an APK nor modifies installed games.**

If the job reports a missing secret, verify repository scoping, name and whether GitHub successfully saved it. If it reports certificate mismatch, **stop** and investigate instead of silently substituting a key.

## Before the first real itch.io beta

- Review and approve one consolidated playable source and asset state; current M13-F remains a **draft comparator**.
- Select/version the beta app identity on an isolated build path; never redirect the historical production/preview package accidentally.
- Add an authenticated **beta package-specific** release-signed APK workflow using the same pinned certificate, increasing versionCode, unique versionName, exact source/asset hashes and APK `apksigner` verification; don't give untrusted PRs secret access.
- Verify release APK offline/performance, real phone UX and save continuity within the **new** beta channel. Document any unsupported migration from older preview apps.
- Obtain the owner's explicit approval before publishing. Keep a durable copy of the final APK/receipt outside expiring GitHub Actions artifacts.
- Complete application-specific privacy/license/content attribution as applicable; don't pretend unfinished Play Store infrastructure is a beta prerequisite.

## Current development continuity

Canonical `main` remains one Sector Rebound game. The latest M13-F evidence stays in [draft PR #147](https://github.com/EdenP-Development/Ricochet-Rumble/pull/147) and [CONTINUE_HERE](../CONTINUE_HERE.md). The isolated M13-C vs M13-F physical TDM comparison, Survival options and two-phone LAN tests remain **pending**. Signing preflight is an infrastructure step, **not** creative approval or a gameplay merge.
