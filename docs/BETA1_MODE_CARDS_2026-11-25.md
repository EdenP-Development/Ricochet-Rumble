# B1-03-B — exact M13 illustrated core Mode Select, stacked review

**November 25, 2026. Development preview only, not public Beta 1 or approval to merge.**

## Branch dependency and scope

- Stacked **on [B1-03-A Warm Industrial Hangar PR #155](https://github.com/EdenP-Development/Ricochet-Rumble/pull/155)**, pinned parent head `20f66b52ddf97a7d7bf56d5a5bbbc77d98ac4a4d`. The parent Hangar is owner-visual-review pending. Do not merge the child before the parent.
- Four **original, untouched M13-C SVGs** from [preview PR #144](https://github.com/EdenP-Development/Ricochet-Rumble/pull/144), each copied to `web/assets/m12/` and its exact Android `android/app/src/main/assets/assets/m12/` mirror:
  - `mode-cqc-study-v1.svg` blob `2a2e1913b8c5eae2548866b9bb300b7a4b90a7aa`
  - `mode-ffa-study-v1.svg` blob `01b600fe48a1d5c4ff7b994aa323cda42bad9f8b`
  - `mode-tdm-study-v1.svg` blob `e9f4ee39002bac2072a5f4bb8d107ee6ffbef6cf`
  - `mode-custom-study-v1.svg` blob `d085dee30f92ead686aac2c9c22e3188a4092423`
- **Only CSS and art change** in the live app. Existing actual button markup, focus/tab semantics, actions `cqc`/`scored_ffa`/`scored_tdm`/`custom`, and labels remain unchanged; CSS decorative `::before` art is pointer-transparent and behind foreground text and icons. No hidden developer art toggle or new menu code.
- Current rules still **CQC 10, FFA 10, Solo TDM 15 KOs**. The M13 physical TDM 30/300 vs 40/360 A/B decision is separate and remains owner-pending. **Never imply these cards represent the experimental 30/40 modes.**
- The prior B1-03-A exact warm Hangar backdrop, Spudacus 2.5s startup, tank/mech preview, cameras, input, bot AI, match scoring, save/profile storage, LAN protocols, version and signer stay unmodified.
- Experimental CTF and Forward Bays artwork intentionally deferred: keep those controls and descriptions unchanged rather than accidentally advertising a new official mode.

## Dedicated verification

- `tests/beta1-mode-cards-contract.mjs`: pins all four original Git blob hashes; Android art and JavaScript/HTML/CSS mirror equality; checks real mode button action/label; verifies a strict source-path allowlist against the parent B1-03-A branch so gameplay, signing and persistent data cannot creep in.
- `tests/beta1-mode-cards-browser-qa.mjs`: actual headless Chromium on 568×320, 740×360 and 915×412; opens **CHOOSE MODE**, verifies four local SVGs load at 512×288, checks real hitboxes, pointer-safe pseudo art, correct focus and Back, archives screenshots and browser QA JSON.
- `.github/workflows/beta1-mode-cards-qa.yml`: exact-source/smoke/scored/save/LAN/signer regressions, actual browser checks for both Mode Select and existing Warm Hangar, offline Pixi and separate `.spudacusqa` debug APK with native signer/package/art/source parity, hash receipt and 14-day downloadable artifact.
- Record an exact **PASS** result and direct artifact link after CI. Until then this is **implemented for review, not verified or merged**. Other current-repo workflows may independently run.
- Owner real-Android review remains necessary: screen readability, four mode cards fitting small landscape, tap targets, contrast, focus, Back, Hangar/splash, actual button actions, controls and game frame pacing. Test build is **disposable debug**; never use it to upgrade/remove installed regular `.preview` or future `.beta` player data.

## Next

After owner confirms B1-03-A Hangar and B1-03-B cards, selectively integrate actual equipped Dossier insignia without fake unlocks or data changes, then truthful match-stage/after-elimination presentation. Revisit score pacing after owner comparison. Future release must be private-signed `com.playereden.ricochetrumble.beta` with verified APK/update/save/phone and itch listing gates.
