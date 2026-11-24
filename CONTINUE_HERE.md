# Sector Rebound — CONTINUE HERE

**Checked against live GitHub: 2026-11-24.** This is the short durable handoff for a new developer, Codex session or ChatGPT conversation. Read it before deciding that an old draft or temporary artifact is a current public release.

## Canonical ownership and source

- Public name: **Sector Rebound**. Technical repository name stays **Ricochet-Rumble**. The in-app FIELDGRID name is worldbuilding, not another installable game.
- **Migration in progress:** GitHub repository **`PlayerEden/Ricochet-Rumble`** (stable repository ID **1434527636**) is **not yet transferred**; intended destination is **`EdenP-Development/Ricochet-Rumble`**. Do not initialize a new repo or change Android application IDs during transfer.
- **Current canonical `main` before migration docs:** `355ef1761ea658e949d807e55d5ac022229711ee`. This is the accepted combined gameplay source; it does **not** include M13 draft experiments. Verify live `main` again after any docs merge.
- **Shared hub:** https://github.com/EdenP-Development/Eden-Development-Standards; see its `APP_REGISTRY.json`, release/signing/save/recovery policies and `templates/PROJECT_HANDOFF.md`. The registry lists the repository under its **current** owner until the transfer is verified.
- **Current draft/review milestone:** [M13-F PR #147](https://github.com/PlayerEden/Ricochet-Rumble/pull/147), branch `feature/m13-f-tdm-40ko-six-minute-phone-comparator-2026-11-06`, exact verified head **`9e52730485c1b9455f5796a2b318e227fbdb456d`**. Parent M13-E #146 → D #145 → C #144. The original art A #141 and battle gameplay B #143 are also **draft and unmerged**. Do not merge, force-push, delete or rewrite this chain without owner review.
- Other historical experiment PRs are retained for traceability. See [archive](docs/ARCHIVE_INDEX.md), [branch register](docs/BRANCH_REGISTER.md), [canonical plan](docs/MASTER_DEVELOPMENT_PLAN.md) and [development protocol](docs/DEVELOPMENT_PROTOCOL.md). Avoid treating old `v0.9.21` handoffs as a current baseline.

## What is actually verified

**Merged `main`:** offline Android Solo survival/team survival; Quick Play, Close Quarters, scored FFA/TDM, customizable matches, procedural mazes; tank/mech/pilot combat; local Dossier/Hangar cosmetics and stats, user-initiated backup/share/restore, solo practice; browser/JVM-tested same-Wi-Fi host/guest, spectating, JOIN NEXT/recovery. These features have been developed and automated-tested, **but two physical Android phones have not been tested together**.

**Approved game feel (protect unless new owner feedback):** camera pilot **0.94**, tank **0.73**, mech **0.69**. Preserve fair movement/AI and pilot vs vehicle balance. Gameplay design: original overhead FIELDGRID tactical/industrial aesthetic, real ricochet projectile physics, simple offline-friendly UX, new maze per match, cosmetic-only progression. No accounts, mandatory cloud services, current ad SDKs or developer-hosted matchmaking.

**M13-A/B/C candidate** (unmerged): owner-approved **Warm Industrial Hangar**, illustrated game-mode cards, insignias and equipped Dossier art; live DEPLOY/ENGAGE/FINAL PUSH stages; Solo Survival post-elimination WATCH FIGHT with NEXT CAMERA. M13-C Solo preview targets **CQC 15 KOs**, **FFA 10 KOs**, **TDM 30 KOs / 300s**. [M13-C QA](docs/M13_C_UNIFIED_ART_BATTLE_2026-11-05.md), [M13-C green source checkpoint](https://github.com/PlayerEden/Ricochet-Rumble/tree/checkpoint/m13-c-unified-art-battle-ci-green-2026-11-05).

**M13-D/E** (unmerged): 300 then 280 additional seeded synthetic natural-engine/target-clock observations; AI-proxy is **not** human-phone experience. Notable Survival candidates **3 bots/5 lives/standard**, **4 bots/5 lives/large**. Test-only M13-E CI [PASS](https://github.com/PlayerEden/Ricochet-Rumble/actions/runs/42288214769).

**M13-F** (unmerged, **latest tested**): compares **Solo-only TDM 40 KOs / 360s** against M13-C **30 KOs / 300s** using separate `SR M13 Compare` debug package; CQC, FFA, Survival and **LAN host-selected 15/30 KOs / 300s** are unchanged. [M13-F Chromium + Android PASS](https://github.com/PlayerEden/Ricochet-Rumble/actions/runs/42293103785) at five landscape sizes, including HUD art, lobby input safety, Solo spectator camera, package/asset/source parity, score kernel and debug signature. Exact [M13-F rollback checkpoint](https://github.com/PlayerEden/Ricochet-Rumble/tree/checkpoint/m13-f-tdm-40ko-android-browser-qa-green-2026-11-06); [phone comparison guide](docs/M13_F_ISOLATED_TDM_40KO_PHONE_COMPARISON_2026-11-06.md) exists on the **M13-F branch**, not on `main`.

**Artifacts:** M13-F `SR-M13-Compare-APK-42293103785` had a passing GitHub Actions artifact in November; by **November 24 the artifact listing was empty** (expired). The earlier M13-C and owner preview Actions artifacts also had short retention. **Do not advertise old expiring URLs as live downloads.** Rebuild from pinned source and verify fresh signer/package/hash before handing out a new APK.

## Signing, installs and publication

- Existing internal owner-preview channel `com.playereden.ricochetrumble.preview`, **v0.9.80-main.1**, **versionCode 420001**, exact verified source `50401f71a63a8375f1b7a7230617acb1167682af`, APK SHA-256 `1bc0aaed1b7557ff2b894b6e25441a4181e7f6a7440d9fcad7b14c5ceed35f36`. Certificate SHA-256 `a40da80a59d170caa950cf15c18c454d47a39b26989d8b640ecd745ba71bf5dc` is the **public Android AOSP test key**, not a private commercial/beta credential. [CI build evidence](https://github.com/PlayerEden/Ricochet-Rumble/actions/runs/41721309696). An accepted physical install-over/saved-progress check is still missing.
- Default Android ID `com.playereden.ricochetrumble`: production signer and historical encrypted-key custody **unverified**; production publication is **not** established. `signing/ricochet-release.p12.gpg.b64` is a historical encrypted blob in this public repository; **do not read/decrypt it in CI or infer original-key access**. Do not generate a substitute merely for consistency.
- `com.playereden.ricochetrumble.m13fusion` (M13-C) and `...m13compare` (M13-F) have **disposable CI debug certificates** and **cannot be update-safe** across different CI builds. Their separate package IDs protect regular progress. Neither is a new public beta identity.
- The owner reports that **only GridMates: Sudoku** has been publicly distributed on itch.io. **Sector Rebound has not been published to itch.io.** A distinct private-key-signed public beta is a possible later channel, *after* existing signing inventory and owner choice. Google Play remains long-term only.
- Never uninstall/clear existing owner-preview or ordinary app to fix an Android signature conflict; use backed-up noncritical data for any upgrade rehearsal. Signing credentials and private recoverable archives stay in restricted GitHub Actions Secrets and owner's private encrypted backups; never in the public GitHub hub.
- [Sector Rebound migration and signing audit](docs/EDENP_TRANSITION_AUDIT_2026-11-24.md) documents the distinction between confirmed, proposed and blocked items. See hub policies for detailed channel and release requirements.

## Immediate ordered next actions

1. **Owner** transfers current repository using https://github.com/PlayerEden/Ricochet-Rumble/settings (General → Danger Zone → Transfer ownership) to `EdenP-Development`. Do not reinitialize, rename the Android package, or mass-close draft PRs.
2. **Developer** confirms same repository ID, org read/write, intact `main`, draft PR #147 and parent chain, all issues/checkpoints; verifies a fresh **post-transfer Actions run** against the same source without promoting game code. Update canonical non-historical links and `APP_REGISTRY.json` with the confirmed org location and verification evidence.
3. **Developer/owner as necessary** inventories original preview/public beta signing and available organization-level secret **names/scope**, not values. Do not reuse Sudoku credentials. Existing public test key and unknown historical production signer must not be silently replaced. Do not sign untrusted pull request code with secrets.
4. **Return to M13-F A/B phone playtest**: compare three Solo TDM matches on 30/300 vs 40/360, then test Survival 3/5/standard vs 4/5/large; record time, real KO or timer end, engagement, AI fairness, heat/FPS, menu and spectator camera. Rebuild dedicated *isolated* test APKs if expired; distinguish disposable debug build from upgradeable owner-preview. Preserve accepted camera/AI settings.
5. Real two-phone LAN, compatible saved-progress install-over and physical performance remain outstanding. Do **not** promote M13 drafts or publish to itch.io without explicit owner approval.

## Working relationship and safeguards

The human owner is design director; ChatGPT implements, tests, audits and documents. Favor usable, reliable game mechanics over feature bloat and paperwork. No mandatory new accounts, monetization, new releases, sweeping art changes or premature Play infrastructure. Keep project-specific design decisions here; the shared hub records only organization-wide principles and public registry metadata. Read live source and CI each session; this handoff is a checkpoint, not a replacement for verifying current state.
