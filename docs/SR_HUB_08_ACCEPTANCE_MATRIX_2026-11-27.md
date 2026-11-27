# SR-HUB-08 — Consolidated standards acceptance matrix, 2026-11-27

Scope: first public Android itch.io Beta 1; no prior distributed .beta APK established. R10 tested runtime 80cd22b35b9bb285751ef82e69e1d63f3551edfe. All development slices remain draft except earlier approved startup mainline. This is a gate review, not release authorization.

| Gate | Verified evidence | Release disposition |
| --- | --- | --- |
| HUB-01 standards applicability | Pinned hub audit 6698200 | PASS documentary scope |
| HUB-02 source and package integrity | 45949255646: 31 source / 16 packaged checks; historical R10 debug APK | PASS scoped; repeat for exact release |
| HUB-03 privacy | a56ff39 data register | PENDING exact manifest/dependencies, runtime WAN/LAN, retention, approved audience/contact and policy |
| HUB-04 rights | 1cc530a asset register | PENDING provenance, resolved dependencies/notices, master recovery, brand screening |
| HUB-05 staging | d724426, 45950890516, artifact 15176830805 | PASS unsigned nondebug .beta v1; not installable |
| HUB-06 signing safety | c33587b, 45951957698, 12 SDK cases | PASS disposable fixture; original beta preflight 45491161871 passed previously, actual signed beta absent |
| HUB-06 emulator | db6ea74, 45952312100 job 140350749839, artifact 15177213496 | PASS actual API35 emulator debug .upgradeqa 1 to 2, identical disposable cert fa6a92370314551292924eb0b706bdcba586f3a7283d4b13f104c9544ba7cd38, eight synthetic records exact after restart and install-over, Dossier 6 matches/11 KOs, private canary retained. Same runtime, not real beta signature/physical migration. |
| HUB-07 support/store | cacca6b draft | PENDING actual screenshots, publisher/contact, privacy URL, audience, pricing and approved LAN scope |
| HUB-08 review | This matrix | PASS documentary review; release BLOCKED |

## Remaining mandatory gates
1. Independently recover original private key copies; check org secret scope and artifact access. Owner attestation required; never share secrets.
2. Physical R10 review, TDM scope/pacing decision (current R10 target 15, experimental 30/300 vs 40/360 not selected), physical LAN or explicit scope decision consistent with no critical defects.
3. Complete resolved dependency/notice inventory, reproducible build inputs, asset provenance and applicable rights/mark review. Do not claim legal clearance.
4. Reconcile exact permissions, data inventory, runtime network behavior, retention and backup/export/restore; approve product-specific privacy and support contact and publish only approved policy at tested HTTPS URL.
5. Owner approve exact source promotion; merge only reviewed stack, never bulk historical PRs. Run exact main staging, independent unsigned hash receipt, main-only manual signing with pinned original cert. Confirm artifact access before signing.
6. Test actual signed .beta clean install and same-channel upgrade with increasing versions and backed-up synthetic/noncritical data; no uninstall/reset workaround. Existing signing workflow currently pins version 1; a separate approved version 2 staging/signing path is needed for real upgrade. Physical acceptance of exact signed candidate, real LAN and support/privacy/rights gates remain.
7. Preserve accepted bytes and receipt in durable owner-controlled archive, authorize exact artifact/channel publication separately, verify distributed download and update registry.

## Evidence limits
CI logs verified; emulator evidence ZIP metadata verified, screenshots not independently inspected. Artifact 15177213496 expires Dec 11 06:34:49 UTC; R10 artifact expires Dec 9. No confidential storage established. No changes to runtime, assets, save schema, keys or publication. No numerical readiness score substitutes for gates.

## Next independent work
Resolve actual dependency graph, capture licenses/notices, introduce reviewed lockfile/build reproducibility on separate branch; improve exact candidate receipt and signed upgrade versioning. Owner decisions can proceed in parallel. Google Play/paid launch not in current scope.
