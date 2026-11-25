# Sector Rebound — itch.io Beta 1 readiness plan

**Owner direction:** 2026-11-25, after physical approval of the revised 2.5 s standalone Spudacus intro. **Goal:** a first **public Android APK beta on itch.io**, not a Google Play release or a promise that every experimental feature will ship.

## 0. Canonical references and nonnegotiable constraints

- Repo: [EdenP-Development/Ricochet-Rumble](https://github.com/EdenP-Development/Ricochet-Rumble), immutable GitHub repository ID `1434527636`. The older `PlayerEden/` URLs are historical and redirect; new links should use the organization.
- Owner work-handoff: [CONTINUE_HERE.md](../CONTINUE_HERE.md), [PROJECT_STATUS.md](PROJECT_STATUS.md) and existing M13 evidence/QA docs. Read these before changing a game.
- Central registry: [APP_REGISTRY.json](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/APP_REGISTRY.json); shared [RELEASE_POLICY.md](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/RELEASE_POLICY.md), [RELEASE_CHECKLIST.md](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/RELEASE_CHECKLIST.md), [SAVE_PRESERVATION.md](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/SAVE_PRESERVATION.md), [SIGNING_KEY_MANAGEMENT.md](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/SIGNING_KEY_MANAGEMENT.md).
- **Only Spudacus → Sector Rebound** startup (standalone game, not GridMates); no EPS/EP/EdenP company splash.
- Never change or overwrite any existing Android app identity, installed save data, APK signer or historic backup file while preparing this beta. Do not merge all historical draft PRs; stage only specifically reviewed gameplay/art slices.
- No claim of completed two-phone LAN or phone balance tests. No public release without **explicit owner go-ahead**.

## 1. Current verified state (separate from proposals)

| Area | Evidence | Honest status |
|---|---|---|
| Ownership | Repo ID `1434527636` retained; admin/write validated | **COMPLETE** |
| Historic M13 accepted mainline | current `main` for canonical game; exact HEAD changes with docs | **Existing baseline; M13 gameplay/art preview not promoted** |
| M13-F 30/5 vs 40/6 | [draft #150](https://github.com/EdenP-Development/Ricochet-Rumble/pull/150), [green same-source dual-APK CI](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45493398975) | **Automated PASS; owner Android A/B pending** |
| M13-A artwork and M13-B match flow | [draft #141](https://github.com/EdenP-Development/Ricochet-Rumble/pull/141), [#143](https://github.com/EdenP-Development/Ricochet-Rumble/pull/143), [unified #144](https://github.com/EdenP-Development/Ricochet-Rumble/pull/144) | **Owner-approved direction in experimental previews; not integrated into main** |
| Survival pacing | [draft #146](https://github.com/EdenP-Development/Ricochet-Rumble/pull/146) | **Simulated trials; phone acceptance pending** |
| Spudacus intro | [draft #151](https://github.com/EdenP-Development/Ricochet-Rumble/pull/151), [green isolated APK CI](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45555459946) | **Owner approved revised 250 ms fade-in / 2000 ms hold / 250 ms fade-out. Isolated QA app only; mainline adoption pending** |
| Exact Spudacus logo | upstream PNG SHA-256 `74773dbda822161f73a639f959e8bce5c6e0b333a94ebeb8ee27f620d4995d25` | **Exact Git blob/CI APK bytes verified; do not regenerate** |
| Dedicated beta signer | [trusted-main signing preflight PASS](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45491161871) | **Private key works in Actions; no actual beta APK signed** |
| New proposed beta app ID | `com.playereden.ricochetrumble.beta`, distinct from regular, `.preview` and M13 QA | **Reserved; no real APK/install-over proof** |
| Real two-phone LAN | local NSD/TCP code + automated tests | **Device-to-device acceptance pending; do not market as proven** |
| Existing local saves | WebView local state/backups, automated save regressions | **Real release upgrade/export/restore on phone pending** |
| itch.io listing | no verified live Sector Rebound beta | **Not published** |

### Locked creative constraints

Respect the accepted Warm Industrial Hangar, tactical/industrial arcade appearance, pilot/tank/mech distinction, slower controls and accepted camera zoom (pilot **0.94**, tank **0.73**, mech **0.69**), balanced AI, team-color readability, cosmetic-only monetization plans and offline-first play. The longer Solo TDM candidate is **not approved** yet; do not hardcode 40/360 as the release target before owner feedback. M13-C 30/300 and M13-F 40/360 are experimental choices, not both release promises. Their isolated artifacts use ephemeral debug signers and cannot be treated as upgrade-safe releases.

## 2. Beta 1 scope and priorities

### P0 — must work before publishing

1. **One reviewable gameplay baseline.** Owner chooses the current 30 KO / 5 min Solo TDM baseline or 40 KO / 6 min candidate based on the paired same-source physical phone A/B, or chooses to defer scored TDM if unsatisfactory. CQC, FFA and Survival require readable start/mid/end, correctly terminating matches and sensible AI. Keep tests for LAN authority and other modes.
2. **One approved presentation.** Integrate chosen M13 artwork/hangar/Dossier and 2.5 s Spudacus intro into a clean **single Beta 1 candidate**, not a stack of disposable experiment flags. Preserve the individual game icon and layout; show no GridMates logo.
3. **Stable Android identity + signing.** A new, separately installable `com.playereden.ricochetrumble.beta` APK using the already verified **Sector Rebound** private beta certificate SHA-256 `43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7`. Use four existing `SECTOR_REBOUND_BETA_*` org secrets, restricted to this repo. No key material in Git, artifacts, logs or user messages. No untrusted PR access to secrets.
4. **Repeatable, immutable versioned build.** Assign Beta 1 a new versionCode and human-readable prerelease versionName; pin source SHA, asset SHA, exact package ID, signer certificate SHA-256, APK SHA-256 and build receipt. Use a trustworthy main/release-tag-only workflow with explicit owner gate, not PR-branch production signing. Retain the accepted APK in owner-controlled durable storage, not only a short-lived Actions artifact.
5. **Persistence, controls and phone reliability.** Smoke test cold/warm resume, Android Back and lifecycle, immersive safe areas, landscape views, Dossier/profile, custom presets, saved stats and supported export/restore. Verify no spontaneous progress wipes; new `.beta` package does **not automatically read existing `.preview` saves**, so be transparent about import/export support.
6. **Offline safety/privacy basics.** Check network permissions, real LAN transport and privacy-policy wording against actual implemented behavior, game age/audience/content details, support/contact channel, artwork/license provenance, and initial itch listing text/screenshots. Do not invent encryption or anonymous online services.
7. **Owner's physical device acceptance** on exact signed, final beta candidate: gameplay/performance/heat/battery, controls, splash, save persistence, installation, launch, version update from that beta package to a newer beta test build without loss, and backup restore. Record exceptions clearly.
8. **Explicit owner approval** to upload/publish itch.io Beta 1. Publishing and announcement are separate from producing an internal build.

### P1 — highly desirable if proven before Beta 1

- Controlled two-phone same-Wi-Fi host/join with disconnect, rejoin, fairness and accurate status indicators. If not physically tested, release notes must label it **experimental** rather than claiming multiplayer is production-ready; critical crashes/data loss still block release.
- Better mode clarity, team identities/indicators, results screen and match pacing UI with no invented outcomes.
- Sound and impact tuning only when tested; no forced music/ads or unnecessary additional runtime dependencies.

### P2 — deliberately deferred

- Google Play Store integration, ad SDKs, economy/cosmetics storefront, online accounts/global matchmaking, new engine rewrite, new brand artwork, additional game modes, large LAN feature expansions, and rewriting accepted character art/camera.
- Any feature from old unrelated experimental draft branches unless individually justified and tested.

## 3. Development order

| Gate | Next action | Completion evidence |
|---|---|---|
| **B1-01** | Owner accepted standalone Spudacus 2.5 s; fold approved artwork/behavior into a reviewable mainline-ready integration PR | Correct asset hash; actual Android build/skip/resume QA; main/owner preview IDs unchanged; owner acceptance recorded |
| **B1-02** | Physical 30/5 vs 40/6 Solo TDM comparison (3 matches each); inspect any issue screenshots | Owner preference and gameplay-quality acceptance, or explicit defer |
| **B1-03** | Integrate approved Warm Industrial art, scoped M13 match UX and chosen rules; isolate legacy experiments | Coherent game demo; Chromium/Android regressions, no accidental gameplay flag leakage |
| **B1-04** | Build real `.beta` APK with private signer on trusted reviewed source; lock version/signer/source and save contract | `apksigner`/package/version/hash receipt, actual install-over on separate beta identity |
| **B1-05** | Android physical checklist incl. cold/warm, lifecycle, profiles/saves, all playable modes and FPS/heat | Owner device evidence + release blockers resolved |
| **B1-06** | Physical LAN two-phone test or specifically label/defer; test wrong Wi-Fi, disconnect/rejoin | Real network evidence or documented limited experimental status |
| **B1-07** | Privacy/support/license audit, itch page copy/screenshots/changelog and retained original signed APK | Accurate listing materials + final checklist with archive location |
| **B1-08** | Owner explicitly approves publication | Live itch.io version/URL/receipt; update GitHub release registry only after verified publication |

**Current next engineer tasks:** (a) integrate the approved Spudacus 2.5 s intro without making disposable `.spudacusqa` the public app; (b) keep M13 draft branch #150/test APK recoverable while requesting/using owner phone feedback for pacing; (c) prepare a separate guarded Beta 1 APK signing workflow *only after* the candidate source is reviewed. Do not sign/publicly ship the unmerged M13-F comparator.

## 4. Safe next-chat handoff

1. Read [CONTINUE_HERE.md](../CONTINUE_HERE.md) and **this** Beta 1 plan. Verify live `main` SHA, all open M13/branding PRs, the central registry, latest Actions results and artifact retention. The context summary is not a substitute for source inspection.
2. The owner **accepted** Sector Rebound's isolated Spudacus **2.5-second** visual experience after first saying the 1.5-second pilot was too fast; record visual approval separately from tests of Back, reduced motion, orientation, TalkBack and signed release APK. The shared baseline for *other games* remains 1.5 seconds.
3. M13: #141, #143, #144, #145, #146, #147 and #150 remain **draft**. #150 CI produced matched Solo TDM 30/300 and 40/360 separate debug APKs on one source; owner has not reported a preferred rule set. Do not silently adopt 40/360.
4. Spudacus splash: #151 carries exact original PNG, native Java overlay, `.spudacusqa` isolated test package, QA tests and documented acceptance; **not merged** at plan creation. Reuse assets and timing, but do not assume that simply merging the QA-only branch displays branding in the regular release.
5. New key: four `SECTOR_REBOUND_BETA_*` org secrets passed trusted-main private-key signer proof. Never regenerate or replace the certificate, never print secret values. Owner's independent backup custody not confirmed.
6. No real `.beta` APK, no physical install-over, no verified itch publication; those are still gates, not completed tasks.
7. Track decisions in the project status/handoff and org registry. Keep Spudacus personal indie identity in public copy; do not present EdenP Development as consumer game publisher.

*Status is source-backed as of 2026-11-25. This document is a release decision framework, not a statement that Beta 1 is ready to publish.*
