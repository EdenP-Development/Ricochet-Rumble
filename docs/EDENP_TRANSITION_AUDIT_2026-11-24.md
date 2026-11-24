# EdenP Development transition audit — Sector Rebound

> **Verified update 2026-11-24:** Ownership transfer now **COMPLETE**; the same repository ID `1434527636` is owned by `EdenP-Development` and GitHub connector read/write/admin verified. Historical pre-transfer inventory below is preserved as a timestamped audit, not the current transfer status. The owner authorized a **new separate private beta key**, locally certificate/signing/recovery verified; organization Secrets and trusted CI preflight still await completion. See [beta signer setup](SECTOR_REBOUND_BETA_SIGNING_SETUP_2026-11-24.md) and [live handoff](../CONTINUE_HERE.md).

**Audit date:** 2026-11-24. **Scope:** live GitHub repository, M13-F development head, public standards hub and current signing/configuration. **This is an organizational handoff; it does not promote game code or publish an APK.**

## Ownership and continuity

| Evidence | Audited fact |
|---|---|
| Existing repository | [PlayerEden/Ricochet-Rumble](https://github.com/PlayerEden/Ricochet-Rumble), **ID 1434527636**, public, default `main` |
| Desired owner | [EdenP-Development](https://github.com/EdenP-Development); **no org-side Ricochet-Rumble repo found** |
| Transfer action | [Owner's repository settings](https://github.com/PlayerEden/Ricochet-Rumble/settings) → General → Danger Zone → Transfer ownership → existing organization |
| Hub | [EdenP-Development/Eden-Development-Standards](https://github.com/EdenP-Development/Eden-Development-Standards), verified connector read/write |
| Pre-transfer `main` | `355ef1761ea658e949d807e55d5ac022229711ee` before this documentation branch |
| M13-F tested source | `9e52730485c1b9455f5796a2b318e227fbdb456d` — **draft PR #147, not main** |
| Migration state | **Owner transfer pending**, no claim of post-transfer access or Actions verification |

Do **not** push a blank new repository, cherry-pick away history, delete an earlier PR or force-move `main`. GitHub ownership transfer should retain repository ID and git history, branches, issues and PRs; after transfer, **verify** rather than assuming every integration/webhook/secrets permission survived.

## Actual branch, PR and issue inventory

As audited, the open M13 development chain is:
- Visual work **#141** `feature/m12-asset-lab-and-render-efficiency-2026-11-04` (base `main`, draft).
- Gameplay/match stages/spectator **#143** `feature/m13-b-match-arc-and-pacing-2026-11-05` (base `main`, draft).
- Unified M13-C **#144**, source `d230227bf4028bb28d73609c16521d6287ef9671` (base `main`, draft).
- Extended synthetic QA M13-D **#145** → #144.
- Survival/TDM tuning studies M13-E **#146** → #145.
- Solo-only Android TDM 40/360 compare M13-F **#147** → #146, exact tested source above.

Older experimental Pixi and D3 feature PRs also remain open. Many older stacked PRs are historical; preserve them instead of merging/closing in bulk. Confirm current PRs through [GitHub pull requests](https://github.com/PlayerEden/Ricochet-Rumble/pulls). Open tracked questions include [M13 match pacing #142](https://github.com/PlayerEden/Ricochet-Rumble/issues/142), [Android/device quality #64](https://github.com/PlayerEden/Ricochet-Rumble/issues/64), [release execution #76](https://github.com/PlayerEden/Ricochet-Rumble/issues/76), [signing #20](https://github.com/PlayerEden/Ricochet-Rumble/issues/20), [save contract #29](https://github.com/PlayerEden/Ricochet-Rumble/issues/29), and [two-phone acceptance #22](https://github.com/PlayerEden/Ricochet-Rumble/issues/22).

Stable recovery branches exist, including:
- `checkpoint/m13-c-unified-art-battle-ci-green-2026-11-05`
- `checkpoint/m13-f-tdm-40ko-android-browser-qa-green-2026-11-06`
- `archive/legacy-main-v063-before-sector-rebound` and the pre-November `main` checkpoint.

These are **one evolving game**, not divergent maintenance products. Preserve source histories/visual studies during transfer.

## Latest verification and distribution inventory

| Source/channel | Package | Version | Verification / release status |
|---|---|---|---|
| Normal Android application identity | `com.playereden.ricochetrumble` | Gradle default **50**, `0.9.54-lan-timeout-test` in currently audited `main` | Default debug/release build identity, **not a verified public/prod release**; original private signer unknown |
| Owner internal compatible preview | `com.playereden.ricochetrumble.preview` | **420001**, `0.9.80-main.1` | [CI #41721309696](https://github.com/PlayerEden/Ricochet-Rumble/actions/runs/41721309696) previously passed; user physical install-over not confirmed. Public AOSP test certificate, not a private signer's trust boundary |
| M13-C Unified | `com.playereden.ricochetrumble.m13fusion` | default 50 / `0.9.54-lan-timeout-test` | [M13-C CI](https://github.com/PlayerEden/Ricochet-Rumble/actions/runs/42097017237) PASS; disposable isolated debugger app |
| M13-F Compare | `com.playereden.ricochetrumble.m13compare` | default 50 / `0.9.54-lan-timeout-test` | [CI #42293103785](https://github.com/PlayerEden/Ricochet-Rumble/actions/runs/42293103785) PASS, five-size Chromium and Android offline-build/signature package validation; **not a phone acceptance or public beta** |

Owner preview's verified certificate SHA-256 is `a40da80a59d170caa950cf15c18c454d47a39b26989d8b640ecd745ba71bf5dc`, obtained from a pinned **public AOSP test key**. Last verified APK SHA-256 is `1bc0aaed1b7557ff2b894b6e25441a4181e7f6a7440d9fcad7b14c5ceed35f36`. Source `50401f71a63a8375f1b7a7230617acb1167682af`. This is **not** proof that a privately held test/production keystore is available or that a real phone upgrade succeeded.

M13-F uses an ordinary disposable CI debug signer; its certificate fingerprint is **not pinned** to a durable release identity. CI verified `.m13compare` package, warm art (12 approved SVG studies), WebView flags, source parity, score targets, spectators, LAN behavior, backup contracts. M13-F [checkpoint branch](https://github.com/PlayerEden/Ricochet-Rumble/tree/checkpoint/m13-f-tdm-40ko-android-browser-qa-green-2026-11-06) remains recoverable. The GitHub Actions **artifact had expired when checked November 24**, so rebuild and reverify before giving an APK link; never relabel old ZIP data as a new signed asset.

The most recent *published GitHub prerelease visible in the repository's releases listing* is experimental **v0.9.54** (October 31, 2026), not M13-F and not an itch.io public beta. The owner reports that only Sudoku has appeared on itch.io. There is **no confirmed public Sector Rebound beta**. Google Play is deferred.

## Signing/key-management audit

The actual Gradle project has external signing inputs:
- **Private/internal-test:** `SR_TEST_STORE_FILE`, `SR_TEST_STORE_PASSWORD`, `SR_TEST_KEY_ALIAS`, `SR_TEST_KEY_PASSWORD`.
- **Release/upload:** `SR_UPLOAD_STORE_FILE`, `SR_UPLOAD_STORE_PASSWORD`, `SR_UPLOAD_KEY_ALIAS`, `SR_UPLOAD_KEY_PASSWORD`.
- Test-package selectors are guarded (`srPreviewPackage`, `srM13FusionPackage`, `srM13FComparePackage` on relevant source branches). Do not mix package selectors or break app data.

**Current finding:** `signing/ricochet-release.p12.gpg.b64` is a historical encrypted artifact present in this **public** repo. This neither verifies private key custody nor automatically proves compromise. **Do not download/decrypt/print the key or replace it** merely for migration. Document issue #20 remains open. The owner must privately confirm whether the original signing material and independent encrypted backup are recoverable before claiming any existing signer has been preserved. The connector does not permit reading GitHub Actions secret values or establishing their existence by browsing an organization settings page.

**Organization secrets:** https://github.com/organizations/EdenP-Development/settings/secrets/actions. Restrict any future **Sector Rebound-specific** secrets to the transferred `Ricochet-Rumble` repo. Suggested **future, not configured or credential-backed** beta secret names: `SECTOR_REBOUND_BETA_KEYSTORE_BASE64`, `SECTOR_REBOUND_BETA_KEYSTORE_PASSWORD`, `SECTOR_REBOUND_BETA_KEY_ALIAS`, `SECTOR_REBOUND_BETA_KEY_PASSWORD`. Do **not** reuse Sudoku's signing certificate or declare a new private beta signer already established. Before authoring a signed beta workflow, identify old installed/public APK signatures, decide if a new public-beta channel is actually required, securely prepare owner-recoverable backups, then run pinned certificate preflight in a trusted **manual** workflow. Never let untrusted PR code access secrets. If no beta is being published now, **no beta key generation is warranted today**.

When needed, use the hub's [signing management](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/SIGNING_KEY_MANAGEMENT.md), [save preservation](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/SAVE_PRESERVATION.md), [release checklist](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/RELEASE_CHECKLIST.md) and [disaster recovery](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/DISASTER_RECOVERY.md) requirements. Existing workflow `solo-practice-owner-preview-410001.yml` pins the public test signer; do not repurpose it as a private-beta or Google Play release workflow.

## Runtime, design, privacy, assets and release infrastructure

- **Canonical runtime:** `web/` and `android/app/src/main/assets/` must stay byte-identical for shared JS/HTML/CSS/config. Real Chromium UI/phone-size tests, Node simulations, Gradle Android builds, APK/bundle verification and source parity are in numerous existing workflows. The last M13-F pass was on an isolated branch, **not post-transfer**.
- **Artwork:** preserve the owner-approved Warm Industrial Hangar and M13 illustrated mode cards/Dossier/insignias. There are 12 source SVG studies added to comparator APKs via debug-only source sets. Do not blindly share this game's industrial designs with GridMates; document source/licensing before reuse. Existing [FIELDGRID identity](SECTOR_REBOUND_IDENTITY.md) and art/design documentation remain authoritative.
- **Game feel:** approved zoom values are **pilot 0.94 / tank 0.73 / mech 0.69**; owner accepts existing AI as sufficiently fair. Do not retune AI/camera without targeted feedback. M13 match timings are experimental: M13-C TDM 30/300 vs M13-F Solo TDM 40/360, CQC 15, FFA 10, Survival candidate settings from M13-E. Existing real LAN two-phone verification is pending.
- **Privacy:** local WebView progress, optional clipboard/share text backups, local Wi-Fi host/guest TCP and direct state/input communication; no login, forced cloud, built-in ad/analytics SDK or hosted matchmaking verified in the reviewed code. Nearby connection is **not documented as encrypted**. Developer privacy/contact placeholders remain unresolved in [privacy draft](PRIVACY_POLICY_DRAFT.md). Re-check the current Android manifest/SDK and networking before any public app-specific policy or itch listing.
- **Existing project docs:** [README](../README.md), [project status](PROJECT_STATUS.md), [master plan](MASTER_DEVELOPMENT_PLAN.md), [handoff protocol](DEVELOPMENT_PROTOCOL.md), [archive history](ARCHIVE_INDEX.md), [identity](SECTOR_REBOUND_IDENTITY.md), [signing](SIGNING.md). Do not rewrite historical GitHub links as that would damage audit provenance; GitHub should redirect them after transfer. Update canonical *current* links after verified transfer.

## Post-transfer verification gate (developer responsibilities)

- [ ] Confirm new repository owner **EdenP-Development** and same repo ID **1434527636**.
- [ ] Verify direct read/write permissions with a small **documentation-only** edit and read-back in the transferred repo; preserve all source.
- [ ] Confirm live `main`, M13-C/F checkpoints, branch history, open PRs #141/#143/#144/#145/#146/#147, open issues, all Actions workflow files.
- [ ] Run genuine **post-transfer** smoke/source-parity and Android build test on the intended branch using existing trusted CI (not merely old cached green checks). Record source SHA, run URL, APK package, signer and digest. **Do not auto-publish or merge M13 drafts.**
- [ ] Verify org secrets *scoping/names* via owner-accessible GitHub settings; perform original certificate/fingerprint preflight only if real credentials exist. Report failure or absence; no substitutions.
- [ ] Update `EdenP-Development/Eden-Development-Standards/APP_REGISTRY.json` using fresh SHA and targeted Sector Rebound field edits, preserving other projects; change repository to new path and migrate status only **after** actual evidence.
- [ ] Update current README and project handoff's primary repository links and record fresh run. Leave historical citations to old PR/release source intact.
- [ ] Resume M13-F A/B physical phone testing before M13 design changes. Keep real two-device LAN, FPS/thermals, save install-over and beta signing as distinctly open gates.

**No transfer has been performed by this documentation change. No secret values have been read, generated, committed or tested. No new game binary has been published.**
