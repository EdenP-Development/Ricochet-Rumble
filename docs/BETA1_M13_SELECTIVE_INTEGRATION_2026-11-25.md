# Sector Rebound — Beta 1 M13 selective integration map

**Prepared 2026-11-25. Status: engineering scope/audit, NOT an accepted implementation or a public beta.**

## Starting checkpoint

- New **Spudacus 2.5s native startup merged into main** via [PR #154](https://github.com/EdenP-Development/Ricochet-Rumble/pull/154), source `756b9a7a61f57b6851a7b91223ef659dbd3a1f4a`, following exact-head Android [CI pass #45556834260](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45556834260). Historical owner-installed normal app may still be older. This is not the public beta package.
- [Beta 1 roadmap](BETA1_ITCH_READINESS_2026-11-25.md) governs release gates, not the older legacy M13 research branches.
- No final owner-selected TDM 30-KO/300-second versus 40-KO/360-second rule. [Matched source dual APK pass #45493398975](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45493398975); physical A/B still pending.
- Locked camera scale pilot 0.94 / tank 0.73 / mech 0.69; current AI, player control feel, local saves, Dossier, no-account LAN remain unmodified.

## Actual M13 history and dependencies

| Draft | Purpose | Status / Beta 1 handling |
| --- | --- | --- |
| [#141 M13-A](https://github.com/EdenP-Development/Ricochet-Rumble/pull/141) | Warm Industrial Hangar, mode artwork, insignia visual studies, 12 versioned SVG runtime candidates | Owner-approved *direction* and preview assets, but remains a broad experimental art branch. Select and verify exact assets; don't blindly merge its auxiliary workflows or art-toggle tools |
| [#143 M13-B](https://github.com/EdenP-Development/Ricochet-Rumble/pull/143) | Real match stages DEPLOY/ENGAGE/FINAL PUSH, Solo watch camera and NEXT CAMERA, mode/pacing preview | Keep actual score truth, spectator controls, no input to eliminated player. Avoid pulling new 30-KO default without decision |
| [#144 M13-C](https://github.com/EdenP-Development/Ricochet-Rumble/pull/144) | Unified M13-A artwork + M13-B battle, distinct `.m13fusion` Android preview | Best **reference** for consolidated visual/UX candidate. Its preview flags and separate package are QA machinery, not a public Beta 1 runtime contract |
| [#145 M13-D](https://github.com/EdenP-Development/Ricochet-Rumble/pull/145) | Seeded balance evidence, Android trial preparation | Evidence only; no casual camera/AI changes |
| [#146 M13-E](https://github.com/EdenP-Development/Ricochet-Rumble/pull/146) | Survival 3 bots/5 lives standard and 4 bots/5 lives large studies, pacing comparison | Simulated evidence not physical approval; keep existing defaults until owner decision |
| [#147 M13-F](https://github.com/EdenP-Development/Ricochet-Rumble/pull/147) | Isolated `.m13compare` Solo 40 KOs/360s experiment | **Do not promote** 40/360 or alter host LAN 15/30-KO limits without owner decision |
| [#150 paired A/B](https://github.com/EdenP-Development/Ricochet-Rumble/pull/150) | Same-source 30/5 vs 40/6 Android debug QA artifacts | Both verified, source `73ae26903f780381b274b2b9da6e51a96461fffe`; owner device comparison required |

All these M13 PRs are draft. Some are stacked; **do not rebase/force-push/delete, bulk-merge, or import Gradle package suffixes into the future signed Beta 1 lane**.

## Code and asset collision audit

Recent [M13-A diff](https://github.com/EdenP-Development/Ricochet-Rumble/pull/141/files) adds a full set of study assets at `web/assets/m12/` and a separate Android debug-only source set `android/app/src/m12Visual/assets/assets/m12/`, along with art preview/toggle code and multiple experimental CI workflows. These files are not yet installed in main as an approved product set.

[M13-C diff](https://github.com/EdenP-Development/Ricochet-Rumble/pull/144/files) changes **`web/game.js`, `web/style.css`, `web/index.html`, their identical Android packaged mirrors, mode/Hangar/Dossier presentation, and Android startup flags**. This touches live scoring/menu/spectator code; importing complete files from the draft would overwrite the present mainline and risk startup/saves/LAN regressions. Source-level conflict with newly merged native startup must be checked carefully.

### Recommended order for B1-03 work

1. **Artwork provenance**: extract/approve the already-approved Warm Industrial, mode cards, and operator insignia assets from pinned M13-C source. Copy exact original source bytes, track source sha/checksum, include web and Android parity. Do not invent recolored alternatives. Do not ship the cool Blueprint experiments as default.
2. **UI-only integration**: adapt the desired artwork/Hangar/Mode Select/Dossier appearance onto current `main` in a focused review branch, not by replacing `game.js` wholesale. Keep normal game package, preexisting game saves and `StartupBrandingOverlay` intact. Remove QA-only art toggle from finished UX, but keep explicit feature gates during review.
3. **Gameplay presentation**: isolate genuine match stage/score clarity and Solo after-elimination follow-camera behavior from M13-B. Verify no fabricated scores or active player controls while spectating, and correct Solo-versus-LAN separation.
4. **TDM pacing owner gate**: choose 30/300, 40/360, or defer this mode based on actual phone A/B, then pin one user-facing score and clock consistently in mode card, match kernel, countdown and results. In absence of choice, **leave the currently accepted defaults**.
5. **Android evidence and publication separation**: verify actual full APK, 5-landscape-size Chromium, original asset checksums, normal Spudacus 2.5s startup, input zones, source parity, Dossier/stats/save/restore, actual package/version/signing and LAN regression gates. The separate future `com.playereden.ricochetrumble.beta` signed release needs its own trusted workflow and physical install-over; never sign untrusted draft PRs.

## What is not yet proven

- No physical owner A/B outcome for 30/5 versus 40/6.
- No M13 artworks/UX merged or real unified Beta 1 Android runtime yet.
- No real Beta 1 private-signed APK, same-package data-preserving update, two-phone LAN acceptance, or itch.io publication.
- Automated PR/browser evidence is not substitute for physical input latency, heat/FPS, accessibility and readable presentation.

## Next-chat recovery

Start with [CONTINUE_HERE.md](../CONTINUE_HERE.md), [BETA1_ITCH_READINESS](BETA1_ITCH_READINESS_2026-11-25.md), [Beta 1 tracking issue #152](https://github.com/EdenP-Development/Ricochet-Rumble/issues/152) and this file. Inspect live `main` HEAD, exact branch refs/diffs and Actions runs (artifacts expire). Preserve the approved startup and existing player identity. The next implementation should be **one isolated M13 visual slice**, followed by CI and owner review before larger gameplay promotion.
