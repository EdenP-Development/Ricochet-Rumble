# M13-F paired Android comparison — exact-source 30/5 vs 40/6

**Date:** 2026-11-24. **Type:** test-only Android APK packaging and fair-comparison infrastructure; NO gameplay or save changes.

## Why this is needed

The original M13-C baseline artifact expired while the M13-F comparator was refreshed after transferring to EdenP-Development. Comparing an outdated 30-KO Android APK against a fresh 40-KO APK risks accidentally attributing art/UI/source differences to match pacing. The updated `.github/workflows/m13-f-tdm-comparator-apk.yml` deliberately builds **both APKs from the same exact Git SHA, same Pixi output, same approved 12 SVG art assets and byte-identical game assets**.

| Test | Baseline | Candidate |
| --- | --- | --- |
| APK | `SR-M13-Unified-30KO-Baseline-Test.apk` | `SR-M13-Compare-Test.apk` |
| Launcher | SR M13 Unified | SR M13 Compare |
| Package | `com.playereden.ricochetrumble.m13fusion` | `com.playereden.ricochetrumble.m13compare` |
| Solo TDM | **30 team KOs, maximum 5:00** | **40 team KOs, maximum 6:00** |
| Game source, visuals | Identical | Identical |
| Other modes | Same CQC, FFA, Survival and AI | Same |
| LAN TDM | Host-selected 15/30 KOs, 5:00 | Same |
| Signature | Same disposable runner debug key in a single build | Same |
| Owner-preview save access | None (separate package) | None |

No `web/game.js`, Android native runtime, Gradle project, saved game files, camera, combat physics, AI, LAN authority or org signing credentials were modified. The workflow first tests real Chromium gameplay, builds/verifies the 40-KO app, then builds the 30-KO app with `gradle clean` so a prior package cannot be reused accidentally.

## Automated proof required

- All original M13-F five-size Chromium gameplay/art/leaderboard/spectator/saves QA and LAN freshness checks remain green.
- Both APKs have distinct `aapt`-verified package IDs and launcher labels; normal production and owner `.preview` identities are excluded.
- `apksigner` verifies both debug signatures; the two certificates match within this run.
- `web/` and APK-bundled `game.js`, `index.html`, `style.css`, score, Dossier and backup scripts compare byte-for-byte; the art SVG bundles match exactly.
- Android DEX holds the same conditional launch routing for M13-C and M13-F; actual package suffix chooses the route. The dedicated Chromium tests verify the real 30/300 vs 40/360 behaviors.
- Artifact contains **two APKs**, existing `verification.txt`, new `paired-verification.txt` with exact Git source and independent APK SHA-256 hashes, and browser screenshots.
- Do not infer the beta signing key is used; both APKs are disposable debug only, unlike the separately verified `com.playereden.ricochetrumble.beta` future signer.

## Physical side-by-side test, still owner-only

Install both APKs without uninstalling your regular Sector Rebound preview. If Android rejects an *older M13 comparison* due to changed disposable debug cert, only that separate comparison package may need reinstalling; do **not** clear or uninstall regular `.preview` or `com.playereden.ricochetrumble`. Use the same phone/bot skill, alternating 30/5 and 40/6 for three rounds each. Record actual seconds, result (KO target/timeout), fun and whether the stage indicators help. Six minutes is a maximum, not a minimum: hitting 40 KOs ends a round early. No claims of human gameplay, performance, upgrade safety or physical LAN tests until the owner provides results.

No merge into `main`, no public beta APK or itch.io publication, no promotion of parent M13-A through M13-F draft features without explicit owner acceptance. After CI verification update central handoff/issue #142 and use the **fresh** paired artifact rather than expired builds.
