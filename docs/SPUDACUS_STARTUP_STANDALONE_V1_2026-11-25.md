# Sector Rebound — Spudacus startup v1.0 isolated adoption

**Development slice:** November 25, 2026. **State:** isolated source and APK QA; owner physical approval **PENDING**. This is a standalone Spudacus title, **not** GridMates.

## Approved upstream material

- [Brand identity standard](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/BRAND_IDENTITY.md).
- [Shared startup timing/behavior](https://github.com/EdenP-Development/Eden-Development-Standards/blob/main/branding/game-startup/v1.0/README.md).
- **Exact original Spudacus PNG:** [pinned source](https://github.com/EdenP-Development/Eden-Development-Standards/blob/015645bffb612e0f4311ec5a2d29e9c8bad91289/branding/spudacus/v1.0/full-transparent.png), Git blob `7f64339220f851c7e36ae1b0c0662892c0ed1694`, SHA-256 **`74773dbda822161f73a639f959e8bce5c6e0b333a94ebeb8ee27f620d4995d25`**.
- The exact Git blob was copied unmodified (identical blob ID) to `android/app/src/main/assets/branding/spudacus-v1-full-transparent.png`. No redraw, resampling, palettes, logo words or GridMates asset.
- Copyright/provenance: owner-approved Spudacus game-publisher identity; no new third-party image licenses introduced.

## Existing game safeguards

Sector Rebound's native Java `MainActivity` hosts one offline WebView and LAN TCP; it is **not a Compose app**. A small native view `StartupBrandingOverlay` is adapted to this architecture rather than importing Sudoku's Compose component.

- **Standalone-only**: Spudacus → original Sector Rebound main menu. No GridMates/EP/EPS.
- Warm cream **#FAE7CD**, centered original aspect-fit PNG with transparent background, max 420dp width, 82% screen width, max 260dp height and 24dp margin, considering Android system window insets.
- Fade in **250ms**, full display **1000ms**, fade out **250ms**; nominal **1.5 seconds** total, silent.
- Tapping anywhere and Android Back skip the *entire remainder*. It consumes pointer events above the WebView. A real accessibility click also skips.
- Android disabled animators/reduced motion: skip immediately; no animation. Missing or undecodable PNG: bypass and show the game.
- **Cold launch only** (`savedInstanceState == null`); `onStop()` removes the overlay, so ordinary resume doesn't replay. Existing `configChanges` declaration prevents orientation restart; no second splash.
- The existing game WebView begins loading before the overlay starts. No startup network requests or new game/save/preferences/sound/achievement keys.
- **Isolated Android QA package `com.playereden.ricochetrumble.spudacusqa`**, selected via `-PsrSpudacusStartupQA=true`; exact original `com.playereden.ricochetrumble`, `.preview`, `.m13fusion`, `.m13compare` and future `.beta` identities remain unaffected. CI APK is a disposable debug signer, **NOT an update to any existing installation**.

## Actual verification (do not overstate)

- Exact asset identical to upstream Git blob: **PASS** (Git object SHA matched at source/destination).
- `tests/spudacus-startup-contract.mjs`: checks full PNG SHA-256, runtime asset path, standalone-only mark, fade timings, gesture/Back/lifecycle/reduced-motion behavior and web/Android game parity. **Static/source contract only**, not a device instrumentation pass.
- **PASS, actual GitHub Actions**: [Android workflow #45554448115](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45554448115), source SHA `ca46d3bcc9a8f679f1788ce736efd8a715fd3b52`. [Real isolated APK and verification receipt artifact #14994769142](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45554448115/artifacts/14994769142). The workflow built offline Pixi assets, ran game/save/LAN regressions, compiled the native Android APK, verified package/signature, the exact pinned PNG bytes inside APK, byte-identical WebView game files, and expected native class in DEX. **No native emulator or real-device interaction was executed**; skip, focus, orientation and actual timing remain owner phone gates.
- Still **PENDING on device**: exact visual scale/readability, real wall-clock 1.5-second duration, tap/Back skip while active, reduced-motion setting, TalkBack semantics/focus, offline cold startup, no replay on Home/Resume or orientation, resource failure fallback and thermal/startup overhead. Automated source checks are not substitutes for owner phone QA.
- No Google Play/itch.io release and no M13 draft promotion. Local beta private-signing certificate was separately verified in Actions, but this QA APK **does not use it**.

## Owner's next internal playtest

Install only the isolated `Sector-Rebound-Spudacus-Startup-Visual-QA.apk` from the verified workflow artifact. Leave your regular Sector Rebound and M13 A/B apps intact. Cold-start to observe Spudacus for about 1.5 seconds then existing main menu; reopen after Home/Resume and change orientation; separately force-close and reopen for another genuine cold launch. Check skip once by touch and once by Android Back. Check sound remains off during intro and existing game controls/menus, Dossier and play remain functional. Report screenshots or a video plus any crop/scale/timing issues. If Android rejects a repeated isolated debug build due to signature mismatch, only the separate `.spudacusqa` package is disposable.

After owner approval, adapt the exact same asset and component to the approved mainline Android launch at a normal milestone, then rerun identity/signer/save and existing M13 gameplay verification. Do **not** equate this isolated QA to mainline adoption or physical signoff.

## Development roadmap continuity

The currently active M13 pacing choice remains unapproved: [M13-F matched 30 vs 40 KO comparison draft PR #150](https://github.com/EdenP-Development/Ricochet-Rumble/pull/150), [green paired artifact](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45493398975/artifacts/14968430435), owner phone A/B pending. This branding slice is separate, does not change the M13 head/AI/camera/art and must not merge M13 work. Signed itch.io beta is a future owner-approved milestone.
