# B1-03-D — truthful Solo match arc and post-elimination spectator

**November 25, 2026. Draft stacked visual/gameplay-presentation review, NOT merged or published.**

## Exact source and adaptation

- Direct parent: [B1-03-C #157](https://github.com/EdenP-Development/Ricochet-Rumble/pull/157), with its [#156 mode illustrations](https://github.com/EdenP-Development/Ricochet-Rumble/pull/156) and [#155 Warm Hangar](https://github.com/EdenP-Development/Ricochet-Rumble/pull/155) still in draft awaiting physical acceptance.
- Adapted limited original M13-C `matchArcFor`, `refreshMatchArc`, `soloWatchActive`, `soloWatchCandidates`, `soloWatchTarget`, `updateSoloWatchUI`, `cycleSoloWatchTarget` from source branch `feature/m13-c-unified-art-and-battle-preview-2026-11-05`. Added the existing clock display integration, optional Solo spectator bar (NEXT CAMERA), listener and surviving-camera follow point, using original M13 styles for display-only elements.
- **Real, current solo state** determines stages: scored = DEPLOY / ENGAGE / FINAL PUSH based on actual elapsed seconds, visible operator KOs and real match score target/clock; Solo Survival = DEPLOY / ENGAGE / FINAL STAND (or WATCH FIGHT on elimination), based on actual elapsed time, deaths, remaining lives and living opponents. Stage messages are not fake pacing or scripted outcomes.
- **No rule/score change:** Canonical CQC 10 KOs/180 sec, FFA 10/240, Solo TDM 15/300 remain exactly as before. 30/300 versus 40/360 TDM experiment remains undecided and excluded. `scored-match.js`, win conditions, bot AI, hit/physics, controls, permanent records and LAN protocol untouched.
- The solo watch camera is **only** after the local Solo Survival human is actually eliminated with real survivors and match not over. Watch targets must be alive; NEXT CAMERA chooses another actual survivor, and targets are reselected after an observed bot dies. Existing touch zones are display-hidden when watching; no controls added to influence fight. Daily Sector, CTF, Forward Bays and LAN spectator system remain distinct.
- The watch camera can change rendered camera focus while watching, but does not change any player/camera zoom constants or simulation. This intentionally touches presentation functions in mirrored `web/game.js` and `android/app/src/main/assets/game.js`, unlike earlier CSS-only slices. Review scope and physics tests accordingly.

## Tests and evidence

- `tests/beta1-match-arc-contract.mjs`: no scoring/save/network/mode configuration/Android Gradle changes, matched Web/Android sources and exact allowlist versus direct parent #157.
- `tests/beta1-match-arc-browser-qa.mjs`: based on production-real M13-B five-landscape-size Chromium fixture but runs **normal unflagged current game**, removing all M13 trial 15/30 target expectations. It probes live actual source functions in the browser for three match stages across scored and Survival, visible HUD dimensions and non-overlap, real solo camera follow/next/death reselect, LAN denial and no additional localStorage writes; archives screenshots and QA JSON.
- `.github/workflows/beta1-match-arc-qa.yml`: run source contract, existing smoke/score/save/Dossier/LAN/signer checks; current five-size match/spectator real Chromium, preceding mode/insignia/hangar browser QA; compile Pixi, Android debug `com.playereden.ricochetrumble.spudacusqa` combined APK and APK source/asset/package/signing proof.
- CI status is **not assumed PASS until exact HEAD run completes**. Artifacts contain disposable debug QA APK only, never the trusted separately signed `com.playereden.ricochetrumble.beta` release.
- Owner mobile test still necessary: readable match header across CQC/FFA/TDM/Survival, no overlap with fire/move/menu, final-phase visibility, successful after-elimination watch and NEXT CAMERA, read-only fire/move, end-of-match report, resume/back, real 2-phone LAN untouched, performance/battery.

## Next gates

Staged order remains #155 → #156 → #157 → this PR. User's “look better” feedback for earlier visual drafts is positive but not unconditional permission to publish or declare full Beta 1 accepted. Owner 30-KO vs 40-KO A/B, actual private Beta 1 APK signing/upgrade/save and itch.io legal materials and publication approval remain separate mandatory steps.
