# B1-03-A — Warm Industrial Hangar artwork on current main

**November 25, 2026 • Isolated review only, no automatic Beta 1 release.**

## Exact source and permitted change

The Warm Industrial Hangar image is owner-approved M13 direction from [draft M13-C PR #144](https://github.com/EdenP-Development/Ricochet-Rumble/pull/144), file `web/assets/m12/hangar-warm-empty-v1.svg`. Original **Git blob SHA-1 `7efe4b676141798c2a5ae77a827c79b64012bc47`**. The image is copied *byte-for-byte*, not regenerated or recolored, into both `web/assets/m12/` and `android/app/src/main/assets/assets/m12/`.

The existing Hangar `openHangar()` already sets `data-hangar-study="warm"` unless the old explicit `?hangarStudy=blueprint` QA query was requested. This slice adds a single decorative `aria-hidden` background layer immediately under the existing Hangar architecture and unit-preview canvas, and adds tightly scoped CSS to show the original Warm Industrial art when the real Hangar is open. The blue Blueprint path still uses the old procedural appearance, not this promoted warm SVG. The live tank/mech cosmetic preview stays visible and is not an illustration of a fake player unlock.

No `game.js`, rules/KO clocks, TDM 30/5 or 40/6 selection, bot AI, camera, control mapping, LAN, game modes, persistence, save schema, profile, launcher icon, Spudacus 2.5-second native startup, original package IDs or signing keys were modified. No additional vendor dependencies were introduced.

## Verification and owner review

- `tests/beta1-warm-hangar-contract.mjs` pins the original Git blob ID; ensures exact source/mirrored Android asset bytes, menu markup and CSS, actual mainline `data-hangar-study` path, existing WebView parity and an explicit *allowlist* of changed paths against `origin/main`.
- Dedicated `.github/workflows/beta1-warm-hangar-qa.yml` runs gameplay/save/room QA, real Chromium Hangar navigation and visual regression, compiles offline Pixi, then builds a separate **`com.playereden.ricochetrumble.spudacusqa`** disposable debug Android APK to verify actual image packaging. This does **not** use the private Beta 1 signer, replace the existing `.preview` APK or count as a real public Beta 1.
- CI and artifact links must be recorded **after an actual passing workflow**. Do not cite queued/in-progress/failed runs as passing.
- Physical Android acceptance **PENDING**: check the revised Hangar background, overlaid cosmetic tank/mech readability, vertical clipping and layout at phone landscape sizes, paint/insignia tabs, unlocked/locked clarity, scroll, Back navigation, Spudacus startup, and game combat unaffected. The old disposable `.spudacusqa` app may need to be uninstalled if its CI debug certificate changed; **never uninstall the regular `.preview` or player-data-bearing production app** to install this test.

## Remaining B1-03 slices

- Mode Select art cards and accessibility (exact approved M13 original SVGs, no experimental mode/rule changes).
- Dossier / actual equipped insignia visual parity (no fake collectibles/progress).
- Match HUD stages/spectator improvements with separate gameplay regression and explicit rules decision.
- User phone A/B of Solo TDM 30 KOs/5m vs 40 KOs/6m remains outstanding; don't select a target without owner verdict.

This PR should stay **draft and unmerged** until exact-head CI and phone feedback, and should not import the old M13-C `game.js` or Gradle preview flags wholesale.
