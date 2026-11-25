# Sector Rebound — Beta 1 refinement, debt and cleanup audit (pass 1)

> **R1 current-head audit outcome 2026-11-25:** [draft #159](https://github.com/EdenP-Development/Ricochet-Rumble/pull/159) source `c4a613f4d96794de59b82e5188e8c5789730fa5a` ran against exact combined #158. [CI #45571138944 PASSED](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45571138944), [artifact #15001454722](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45571138944/artifacts/15001454722). Real current-head geometry diagnostic: **102 screen/viewport scenes, 0 detected geometry FAIL, 0 WARN, no reported layout issues** across five landscape/two portrait sizes. Warm Hangar, Mode Select, real insignia and Solo match/watching browser suites also passed at audit head. Source audit: **4,306 CSS lines, 169 media starts, 129 `!important` statements, 55 frequent repeated-selector header groups (heuristic investigation list only), 38 distinct HTML actions, 7 HTML templates**, exact Web/Android runtime mirror equality. [Complete 73-open-PR inventory and current-screen review queue](https://github.com/EdenP-Development/Ricochet-Rumble/blob/audit/beta1-refinement-baseline-2026-11-25/docs/BETA1_R1_CURRENT_HEAD_SCREEN_AUDIT_2026-11-25.md). **No runtime edits, PR closures or merges.** This narrows our focus to **visual hierarchy, contrast, texture and phone feel**, not invented clipping problems or CSS deletion for its own sake. Physical final owner acceptance, two-phone LAN, true signed Beta 1, save/install-over and itch.io publication remain unverified/blocked.


**2026-11-25 | Actual source inspected:** stacked [B1-03-D PR #158](https://github.com/EdenP-Development/Ricochet-Rumble/pull/158) head `6796265df57d1f561c44cc52581841f5e3398ea8`, plus mainline handoff, itch readiness, prior cross-screen and M6 pre-release audits. **No runtime code changed as part of this audit.**

## Owner feedback / current release disposition

Owner tested the combined Hangar/mode/Dossier/match-stage preview and says **“It's not bad, we definitely have a lot of refining, audits, cleaning up and such to do.”** Treat this as positive directional feedback only, **not final visual acceptance, merge authorization or release approval**. Stop expanding feature scope until the highest impact defects and release blockers are triaged.

The most recent stacked PR #158 is **draft** and its five-viewport browser/source/save/LAN/Android QA [passed](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45567887725). It is nevertheless a **separate debug app**, not a signed `.beta` release, and real phone usability/performance, two-phone LAN, update/save preservation and release approval are still unverified.

## Inspectable source inventory and identified risks

| Severity | Evidence | Interpretation | Recommended next action |
|---|---|---|---|
| **P0** | Main has only the merged Spudacus startup; #155 (Hangar) → #156 (Mode art) → #157 (Insignias) → #158 (match stages/watch) are **stacked draft PRs** | Final visual review APK does **not** equal merged/releasable mainline | Mark exact approvals per slice; rebase/merge **parent first** after acceptance, run complete exact-head Android and browser QA and preserve rollback |
| **P0** | 73 open PRs in GitHub (2026-11-25 query), including old experimental and stacked series | High review ambiguity, stale status and risk of bulk-merging incompatible variants | Produce an inventory of active/research/archive candidates and source dependencies. Do **not** auto-close, merge or delete any without disposition review |
| **P0** | Only disposable `com.playereden.ricochetrumble.spudacusqa` APK evidenced for combined #158; signed private `.beta` APK **not built** | Can't responsibly declare an installable public Beta 1 candidate yet | Independently build true beta-signed APK, attest cert/ID/asset hashes; practice install-over, uninstall/reinstall and saved-game restore safely; owner control of signing backup; no public upload |
| **P0** | Owner 30 KOs / 5 min vs 40 KOs / 6 min Solo TDM comparison outstanding; current rules remain **15/5** | Release balance still undecided; prior experiments must not leak into current candidate | Request actual phone pacing comparison results only when owner tests. Retain current scoring until then; no guessing |
| **P0** | Two-phone Wi-Fi LAN not established by regression runner | Browser/native mocked LAN checks cannot prove actual hardware discovery, disconnect/reconnect and gameplay latency | Physical two-phone host/join/mode/return/reconnect matrix, record device versions, failure steps and OS permissions |
| **P1** | Review-head `web/style.css` ~4,306 lines / 240,250 characters; ~169 media-query blocks, 129 `!important` declarations; dozens of repeated mode-grid/hangar selectors | High CSS cascade and cross-size override complexity; metrics are **signals** rather than proof of specific visual bugs | Build cascade ownership map for Home/Mode/Hangar/Dossier/HUD. Remove duplicated dead rules incrementally with before/after five-viewport screenshots, keyboard and touch tests. Do not globally strip `!important` or re-theme |
| **P1** | Review-head `web/game.js` ~3,903 lines / 266,630 characters and 234 named functions; Web+Android mirrored copies | Big integration surface; easier to introduce regressions when UI helpers share one game file | Map module seams around HUD/presentation, Solo spectator, controls and physics. Extract only if test-proven byte-for-byte behavior parity and feasible packaging; avoid a broad AI/game engine rewrite before Beta 1 |
| **P1** | B1-03-D changed both visual HUD text and spectator camera; old `tests/smoke.mjs` expected bare `03:00`; original M13 fixture expected a different initial map preset | Tests can freeze **old presentation** instead of important game invariants; fixtures inherited from experiments require adaptation | Separate invariant tests (score, state, input, save) from exact copy/format and intentional viewport presentation tests; add live cycle, death re-target, no-fire and no-save-write evidence |
| **P1** | Prior premium cross-screen audit covered five landscape sizes, Home, Modes, Local Play, Hangar, Dossier, Results and backup, but it was performed on earlier draft #140 | Past screenshot PASS cannot certify current combined #158 flow | Fresh end-to-end **current-head** screen capture and interactive journey for every exposed menu/mode/result; collect visual diffs and specific owner screenshots instead of declaring all screens polished |
| **P1** | Solo stages can show DEPLOY / ENGAGE / FINAL PUSH/STAND / WATCH FIGHT, plus score and clock; spectator camera moves focus | Dense HUD may overlap gameplay or distract even if geometry tests pass | Owner phone test of text size, contrast, visual hierarchy, spectator bar, thumb reach, actual readability at combat speed, low-end FPS; minimize nonessential messaging |
| **P1** | Offline Dossier and unlocks, manual backup, Android WebView lifecycle | Automated save/LAN passes don't cover all real install-update lifecycle risks | 0-progress, mature-progress, locked/unlocked, equipped paint/insignia, corrupt restore, downgrade, data-clear and Android process recreation tests |
| **P2** | Four review PRs + several historical docs each contain dated “latest” headings; some older readiness rows are explicitly labeled historical | Handoff drift makes new work vulnerable to stale status assertions | One canonical Beta 1 gate table with source SHA/PR/CI/APK, device-accepted flags and outstanding blockers; archive historical notes as references without rewriting their history |
| **P2** | Original M13 study assets and multiple experiments remain in other draft refs | Valuable reference material but not necessarily approved production features | Keep source-provenance and exact artifact IDs; consolidate only reviewed/used SVGs, don't bulk-copy experiment files |

## Recommended effort order (not a promise of release timeline)

**Sprint R1 — audit and baseline.** Lock exact known-green review head, gather real owner device screenshots/feedback, record all current-screen/control bugs, inventory PR categories, and produce source-backed CSS specificity/duplicate-selector report. No extra modes, AI training or unreviewed art.

**Sprint R2 — clean visual system incrementally.** Prioritize first-screen branding, Hangar consistency, illustrated Mode Select, Dossier identity, scored/Survival HUD, results and Local Play. Establish typography/spacing/contrast/touch targets; consolidate one surface at a time with before/after screenshots on 568×320, 640×360, 740×360, 915×412 and 1280×720.

**Sprint R3 — gameplay quality and real Android.** Reproduce observed control/AI/camera or performance defects from device; fix only measured regressions with equal-seed matching, preserve earned rewards, and actually test two phones and save/update. Retain 10/10/15 scoring until owner selects a tested paced alternative.

**Sprint R4 — release engineering.** Once owner accepts the stacked experience, parent-first integration and full exact-head regression; build separately signed real `com.playereden.ricochetrumble.beta`; confirm cert continuity, install/upgrade/restore, package parity, legal/privacy/contact and truthful itch listing. Public upload needs explicit owner approval.

## Cleanup rules

1. **Never equate “looks better” with full approval**, or an Android CI debug build with a signed production beta.
2. **Do not bulk merge/close 73 open PRs.** Provide a reviewable triage list and maintain exact source provenance/rollback.
3. Preserve Spudacus-only player-facing branding and original artwork; no corporate cross-branding.
4. No gameplay-balance, saved schema, camera zoom, bot cheating/accuracy, LAN protocol, Java/native app ID, or signing changes justified merely by UI cleanup.
5. Every cleanup patch must identify **exact user-visible difference**, screenshots/viewport constraints, and no-regression evidence.
6. Distinguish source-verified risks above from physical-device defects that only the owner can observe.

## Highest-value immediate deliverable

A **focused audit-only PR** consisting of a screen-by-screen current-head baseline matrix + CSS rule ownership/duplicate selector evidence + actionable defects with screenshot or exact DOM selector locations. Then repair the most disruptive layout inconsistencies in small, reversible patches. Do not add another experiment just to keep the milestone count moving.

**Source references:** [B1-03-D handoff](../CONTINUE_HERE.md), [Beta 1 itch readiness](BETA1_ITCH_READINESS_2026-11-25.md), [M13 selective integration](BETA1_M13_SELECTIVE_INTEGRATION_2026-11-25.md), [Original premium UI screen audit](PREMIUM_UI_V2_CROSS_SCREEN_AUDIT_2026-11-04.md), [M6 pre-release audit](M6_PRE_RELEASE_AUDIT_2026-11-04.md).
