# Sector Rebound B1-03-C — real equipped Dossier and Hangar insignias

**November 25, 2026.** Selective visual-only review, stacked on B1-03-B mode cards and B1-03-A Warm Industrial Hangar; not main, not public release.

## Exact code and data behavior

- Copy four **original M13-C** SVGs, unchanged, from the developer's [draft M13-C preview #144](https://github.com/EdenP-Development/Ricochet-Rumble/pull/144) into local browser and Android bundled paths: `insignia-field` blob `5443b63d2c3acd4a81f165d607a96845df8d47e8`, `insignia-vector` blob `6de10eccc3d34bcbb5aa6dc470868ea625f1637e`, `insignia-ace` blob `708f7a07753d6025b2027b6d1a76bf87cb119514`, `insignia-command` blob `a68965cd619f25514978b305e0d36feaa0cb3267`.
- Apply CSS to the **existing** Hangar four insignia tiles, selected insignia detail badge, and Dossier equipped badge. No new DOM button, fake asset unlock, save key or JavaScript sync routine.
- CSS selectors `:has(use[href="#sr-mark-*"])` follow the real SVG `use` identity, which existing `refreshHangar()` and `openDossier()` update from the **real, already-saved `equippedEmblem`**. Once an earned mark is equipped, its Dossier artwork and Hangar detail artwork update automatically. SVG silhouette is hidden visually only when source matches; accessibility text, button state and the original icon markup are preserved.
- Existing disabled/locked reward items remain disabled, gray and dim. Selected items remain selected by the original game logic. The original real local stats, achievements, Solo-only unlock thresholds and persistence are authoritative.
- Only **four original SVG art files × Web+Android and two mirrored CSS files** touch live assets; new QA/docs separate. No `web/game.js`, `index.html`, `dossier.js`, scoring logic, AI, controls, camera, LAN, save format, launcher, Spudacus startup, app identity or signer modifications.
- Parent [#156 Mode Select](https://github.com/EdenP-Development/Ricochet-Rumble/pull/156) and grandparent [#155 Warm Industrial Hangar](https://github.com/EdenP-Development/Ricochet-Rumble/pull/155) remain review branches; owner said the combined visual experience **looks better**, not blanket permission to merge or publish. Keep physical acceptance open.

## Evidence and gate

- `tests/beta1-insignia-contract.mjs`: original Git blob checksum, Web/Android parity, source path allowlist **versus the direct parent PR #156**, unchanged saved-equipment behavior.
- `tests/beta1-insignia-browser-qa.mjs`: real Chrome 568×320, 740×360, 915×412; opens Hangar Insignias, checks four source images load, real default equipped FIELD vs genuinely locked VECTOR/ACE/COMMAND and selectable status, Dossier FIELD badge, focus/Back and art mapping for other three IDs. **Test-only dummy SVG reference** demonstrates CSS identity updates without writing a save or gameplay state. Archives screenshots.
- `.github/workflows/beta1-insignia-qa.yml`: full smoke/scored/save/Dossier/LAN/test-signer suite, the B1-03-A Warm Hangar and B1-03-B Mode Select browser tests, new insignia tests, offline Pixi build and disposable `com.playereden.ricochetrumble.spudacusqa` debug APK. APK verifier checks all exact art files and WebView scripts. Outputs APK, Chromium screenshots, QA JSON and SHA receipt for 14 days.
- **Never interpret a queued/in-progress/failed run as PASS.** Verify exact test head and artifact ID before issuing download link. Still require physical phone review for visual legibility and navigation.
- Parent branch stacking order is **#155 → #156 → B1-03-C**; do not force-merge a child ahead of unaccepted parents. No real signed `.beta` APK or itch.io publication.

## After B1-03-C

Truthful Solo match HUD stages and post-elimination spectator camera are separate gameplay/UI work, not part of this insignia slice. The 30/300 vs 40/360 TDM pacing owner-device A/B remains unresolved. Later actual Beta 1 signing, upgrade/save tests, two-phone LAN and itch.io copy/release authorization remain required.
