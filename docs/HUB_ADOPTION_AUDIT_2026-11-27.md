# Sector Rebound — hub adoption audit, 2026-11-27

Pinned hub: https://github.com/EdenP-Development/Eden-Development-Standards/tree/b4d7d05bb9e8ada15fb053a584409e7532e9444c
Pinned game review: 80cd22b35b9bb285751ef82e69e1d63f3551edfe, draft #169, CI 45592089117 PASS. Documentary/source inspection, not new runtime, legal or physical verification.

| Standard | Status / evidence | Next gate |
| --- | --- | --- |
| PORT-10 release checklist / policy | R10 exact debug QA, 101 mocked-transport two-client checks, 168 HUD safe-zone cases; ZIP artifact 15010503734 | First public beta: no prior distributed beta established; trusted signed build, clean install and same-channel upgrade rehearsal, owner approval, exact APK receipt and durable archive |
| Signing / PORT-09 recovery | .beta private signer preflight 45491161871; Gradle at reviewed head has .preview/.hybridtest/.spudacusqa but no .beta build variant | Explicit isolated beta build path, verify owner independent encrypted copies and secret scope privately; historical production exposure separate assessment; never rotate or reuse automatically |
| Save preservation | save-backup.js v1 allowlists six stores and recovery snapshot; existing browser save regression; historical emulator canary only | Actual signed install-over with real synthetic WebView records, cosmetics, presets, daily, settings and export/restore; no uninstall |
| Brand / EDT-03 | PR154 approved 250/2000/250 standalone logo; StartupBrandingOverlay.java confirms timing, tap skip, reduced-motion skip and missing-art fallback | Keep exact art, confirm combined phone lifecycle/accessibility; no GridMates/EPS logos |
| Artwork / EDT-09 | R10 compares packaged Hangar, mode and insignia assets to source; no independent rights clearance | Record source hashes, independent package receipt and provenance; launcher masks and actual screenshots |
| Privacy / PORT-12 | Existing draft and in-app notice; inspected source manifest INTERNET, ACCESS_NETWORK_STATE, ACCESS_WIFI_STATE, allowBackup=false, usesCleartextTraffic=false; MainActivity uses plain Socket/ServerSocket, NSD and blocked WebView network loads | Exact merged manifest, dependency inventory, WAN/LAN and permission behavior, actual publisher/contact, audience and approved public HTTPS policy; cleartext manifest flag does not establish encrypted TCP |
| BUS-02 rights | Nine M12 SVGs, shared Spudacus PNG, PixiJS 8.18.0, esbuild 0.25.12 identified | Complete distributed assets, generated art terms, audio/font provenance, dependency licenses/notices and mark screening before distribution |
| BUS-01/04/06/07 and itch | First public Android beta planned, cosmetic-only direction, no monetization integration authorized | Accurate listing, real screenshots, AI disclosure, support/private reporting contact, pricing/terms owner decision; paid/business/Play later |
| PORT-11 GridMates family | Standalone game, not consumer of GridMates identity/audio/emotes/collections/partner ping | Do not import; preserve game-local cosmetic IDs and entitlement rules |
| EDT-01 | Java/WebView game, existing JSON backup validation | No Kotlin preference adapter transplant; review corruption handling locally |
| EDT-02 v0.2 | Receipt-bound preflight relevant, synthetic fixture not a consumer test | Use only after exact same-channel APKs and SDK evidence; adapt product-specific upgrade harness |
| EDT-04 | Theme roles concept, existing game CSS | No Compose palette transplant |
| EDT-05 v0.1/v0.2 | Sector Rebound is original maze reference, existing seed contract | Optional offline graph analysis parity experiment only; no replacement generator |
| EDT-06 v0.2 | Existing arcade bot decisions/perception; hub controller provisional | QA-only reason-coded observation experiment after release freeze; no changed AI or weights |
| EDT-07 v0.1–v0.6 | Colony/autonomous simulation, no current consumer need | Defer, not a combat engine |
| EDT-08 v0.1 | Baseline verifier useful for independent receipts, R10 already checks exact runtime tree | Pilot against independently recorded immutable baseline; no regeneration to pass |
| EDT-09 v0.1–v0.5 | v0.4 packaged assets relevant; v0.5 drawable mapping only if byte-preserved resource | Pin receipt; do not infer runtime rendering, rights or compiled resource verification |
| Website publication | Hub prototype and structural validator are not a live approved policy | No placeholder deployment; owner selects contact/host and exact policy acceptance |

## Priority queue
P0: owner consolidated physical review, two-phone LAN, TDM pacing choice; stable beta build and recovery; exact data and asset rights inventory; public privacy/support readiness; signed install-over and archive. P1: read-only EDT-08/09 consumer pilot, scoped upgrade harness. P2: optional EDT-05/06 diagnostic work after beta, separate branch. No automatic imports, release, merges, key changes or save schema changes.

Sources inspected include hub RELEASE_CHECKLIST, SAVE_PRESERVATION, PRIVACY_STANDARDS, ASSET_LICENSING, BRAND_IDENTITY, ARTWORK_PIPELINE, DISASTER_RECOVERY, SIGNING_KEY_MANAGEMENT, COMMERCIAL_READINESS, CUSTOMER_SUPPORT, ITCH_PUBLISHING_GUIDE, MONETIZATION_STRATEGY, GOOGLE_PLAY_READINESS, DEVELOPMENT_TOOLKIT, PORTFOLIO_STANDARDS_ADOPTION, APP_REGISTRY and toolkit READMEs. Game source: manifest, build.gradle, MainActivity, StartupBrandingOverlay, save-backup.js, hybrid-ui/package.json, privacy draft, publishing checklist, prior AI audit and upgrade rehearsal. No full dependency/rights/runtime network audit or independent artifact inspection in this pass.
