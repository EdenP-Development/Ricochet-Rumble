# Beta 1 — approved Spudacus startup promotion to normal Android cold launch

**Owner acceptance:** 2026-11-25: owner physically reviewed the original 1.5s logo, requested it be slower, then reported the revised **2.5s** test as **"That's perfect."** That accepts the visual/timing direction **for Sector Rebound only**, not all accessibility/lifecycle/upgrade cases.

## Scope of this focused integration branch

- Reuse the **exact original approved Spudacus PNG** from central standards (Git blob `7f64339220f851c7e36ae1b0c0662892c0ed1694`, SHA-256 `74773dbda822161f73a639f959e8bce5c6e0b333a94ebeb8ee27f620d4995d25`) unchanged.
- Copy the verified native Java `StartupBrandingOverlay` from pilot PR #151 into the regular Android app. On normal first Activity creation `savedInstanceState == null`, mount skippable overlay above the already-loading WebView. **Previously the pilot only showed it for package `.spudacusqa`; this focused branch deliberately removes that restriction.**
- Spudacus creator logo only, then normal Sector Rebound menu; no GridMates/EP/EPS screen. Cream `#FAE7CD`; fade 250ms in, hold 2000ms, fade 250ms out; touch/Back skips, reduced-motion animation-disabled bypass, no replay after onStop, orientation configChanges retained, asset failure falls through.
- Regular Android `applicationId` `com.playereden.ricochetrumble` and historical `.preview` remain unchanged. No new save keys, network requests, LAN changes, audio, menus, gameplay, camera or AI adjustments. The optional `-PsrSpudacusStartupQA=true` creates an **additional disposable** isolated `.spudacusqa` for safe testing and does not change normal builds.
- A focused CI on this branch must run exact original-asset hash verification, web/native game source parity, save/LAN/smoke regressions, build the Android QA app and inspect its packaged image/class/debug signer. Its APK is **not** a private beta release and may not upgrade other app packages.

## Approval gates / nonclaims

- [x] Owner accepted 2.5s **visual/timing** in the existing isolated QA package.
- [x] Same approved PNG Git object in branch; no regeneration.
- [x] New **mainline-wired** exact-source Android CI **PASS**: [run #45556695604](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45556695604), tested source `38dc291c8c0df3e51939de924477c27953f1219d`; [isolated APK + receipt artifact #14994844697](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45556695604/artifacts/14994844697). First attempt [#45556500482](https://github.com/EdenP-Development/Ricochet-Rumble/actions/runs/45556500482) failed due to obsolete **QA-only package-string check**, not Android compile/game logic; test was corrected (normal cold startup no longer contains a package-suffix literal). Build, original artwork checksum, APK package/asset parity and save/LAN regressions then **passed**. Real-device test of mainline-wired entry remains pending.
- [ ] Physical sanity of normal cold-launch behavior in beta integration candidate and skip/Back/reduced motion/home/resume/landscape on owner's phone. The source tests are not equivalent to device instrumentation.
- [ ] Merge this focused change to main **only after source/Android CI passes and integration review**; do not merge gameplay draft PRs or publish a beta as a side effect.
- [ ] Later test real private beta-signed `com.playereden.ricochetrumble.beta` package and install-over/save preservation separately.

Current Beta 1 plan: [BETA1_ITCH_READINESS_2026-11-25.md](BETA1_ITCH_READINESS_2026-11-25.md). M13 pace selection remains owner-pending (30 KOs/300s vs 40 KOs/360s, [draft PR #150](https://github.com/EdenP-Development/Ricochet-Rumble/pull/150)).
