# B1-R2 — illustrated core Mode Select computed CSS cascade repair

**2026-11-25 — first R1-triggered cleanup slice.** New visual-only review, stacked on [B1-R1 audit #159](https://github.com/EdenP-Development/Ricochet-Rumble/pull/159) and its four still-draft B1-03-A/B/C/D parent reviews. **Not owner accepted, merged or public Beta 1.**

## Verified source cause and targeted repair

The illustrated core Mode Select styles added in B1-03-B intended a darker blue card gradient and crisp cream/blue-green labels, but the original base stylesheet had **more specific selectors**. The earlier `#menu #panel .mode-grid .mode-mission` (two IDs) declared card `background` and `box-shadow`, and `#menu #panel .mode-grid .mode-mission strong/small` similarly declared text colors. Later B1-03-B's selector `#menu .mode-screen .mode-grid .mode-mission` only had one ID, so source order alone could not make its new background/color declarations win. The original SVG `::before` artwork itself was already working.

**R2 fixes exactly three selectors** in the original B1-03-B CSS section, raising specificity narrowly through `#panel`, and scopes text to the four core button `.mode-copy` elements. Everything else, including all M13 SVGs, hue tokens, button geometry, responsive rules and artwork crop, stays byte-identical. No `!important` added. Web and Android CSS mirrors are exact.

**No code changes** to gameplay, Solo/HUD, tank/pilot/mech rotation, AI/ballistics, 10/10/15 KO targets, score rules, camera, save, LAN, native app, signing, startup, or content unlocks. This is a real CSS correctness adjustment, not a speculative redesign or bulk stylesheet cleanup.

## Verification gates

- `tests/beta1-r2-mode-cascade-contract.mjs`: strict source-path allowlist compared to R1 audit branch; byte-for-byte all pre/post-card CSS, matched Web and Android and unchanged runtime JS/HTML/score/saves.
- `tests/beta1-r2-mode-cascade-browser-qa.mjs`: serves the **actual parent CSS** from Git as baseline and current CSS as candidate to real Chromium at **568×320, 640×360, 740×360, 915×412, 1280×720**. Checks all four real buttons' computed CSS backgrounds and foreground colors, unchanged click actions and bounding boxes, pointer-safe original illustration, keyboard focus and Back. Captures actual parent/current screenshots + JSON A/B receipt.
- Dedicated Android Actions `beta1-r2-mode-cascade-qa.yml` reruns score/smoke/save/LAN/signer, all four preceding visual Chromium suites, current five-viewport layout geometry diagnostic, offline Pixi build and disposable `.spudacusqa` Android debug APK with **real output APK SHA** receipt.
- A CI pass can prove computed stylesheet and nonregression on tested viewports, not prove owner physical look/feel acceptance. Actual owner screenshot comparison and beta-signing/real Wi-Fi multiplayer are still separate gates.

## Next after successful CI

Review actual R2 before/after screenshots and owner phone feedback. If visibly better, move to **Home visual hierarchy/cascade specificity** next (several `.premium-menu-title` generations), then Hangar depth/contrast. Do **not** blindly remove older responsive rules or all `!important`; keep one root cause per reversible PR.

**Source of truth:** [R1 102-scene baseline + PR inventory](BETA1_R1_CURRENT_HEAD_SCREEN_AUDIT_2026-11-25.md), [main handoff](../CONTINUE_HERE.md). The `docs/` link from this file to R1 is `BETA1_R1_CURRENT_HEAD_SCREEN_AUDIT_2026-11-25.md`. 
