# SR-HUB-04 — Asset and dependency rights register (draft, 2026-11-27)

Reviewed immutable R10 source 80cd22b35b9bb285751ef82e69e1d63f3551edfe; hub ASSET_LICENSING.md, ARTWORK_PIPELINE.md and ASSET_RIGHTS_REGISTER template at b4d7d05bb9e8ada15fb053a584409e7532e9444c. Git tree inventory and selected source/document review, not legal clearance. Technical verification and owner design approval are distinct from distribution rights.

| Group | Source / evidence | Intended use | Rights status / next action |
| --- | --- | --- | --- |
| Warm Industrial Hangar SVG | Original M13-C #144; BETA1_WARM_HANGAR record | In-game backdrop | Review pending: generation/creation record, inputs, applicable terms and owner contribution |
| Four Mode Select SVGs | Original M13-C #144; BETA1_MODE_CARDS record | CQC, FFA, TDM, Custom art | Review pending: same provenance questions, no blanket clearance |
| Four insignia SVGs | Original M13-C #144; BETA1_INSIGNIA record | Local cosmetic identities | Review pending: origin, terms and mark similarity |
| Spudacus PNG | Hub branding/spudacus/v1.0, pinned original derivative, SHA256 74773dbda822161f73a639f959e8bce5c6e0b333a94ebeb8ee27f620d4995d25; owner approved Nov 24; R10 package bytes verified by SR-HUB-02 | Standalone intro | Technical and visual provenance recorded; rights/terms and mark screening pending; retain owner master privately |
| Android launcher | ICON_A_INTEGRATION_2026-10-31: selected grounded tank/amber ricochet; optimized 224px foreground WebP SHA256 3467962178347f9043a5c1983485f4962f041aa49962cf0970ee14767491d1f7; separate master and 432px PNG reported | Adaptive, round, monochrome and legacy icon | Restore highest-resolution master, verify masks, provenance and redistribution; no new icon design |
| Pilot source art/catalog | assets/source/pilots and game-data/cosmetics/pilot_icons.v1.json | Development concepts | Not automatically authorized for runtime or sale; verify exclusion and individual rights before promotion |
| Procedural visuals | web/game.js Canvas; web/index.html inline sprite; CSS | Actual combat/UI | Project source; ownership/contribution record pending, no external textures inferred |
| Music and SFX | game.js lines 2312–2410: AUDIO_CUES and updateMusic synthesize oscillator/gain tones; source describes original four-bar pattern | Offline music and combat/UI feedback | Source-backed procedural generation, no separate audio files found in inspected tree; verify composition/authorship and contributions; no GridMates audio import |
| Fonts | style.css system stacks Roboto/Noto Sans/Roboto Condensed, Droid Sans Mono, Segoe UI, Arial, Consolas and generic fallbacks | Device/browser-selected typography | No bundled font file found in tree; verify actual APK and no later remote/imported fonts; do not claim rights to redistribute platform fonts |
| PixiJS 8.18.0 | hybrid-ui/package.json; runtime compiled bundle | Offline menu | Exact upstream license/notices and resolved dependency graph pending; do not assume direct license covers transitive packages |
| esbuild 0.25.12 | hybrid-ui/package.json dev dependency | Build-only | Verify license and tool distribution scope; distinguish compiler from shipped bundle |
| Android/Gradle/other build dependencies | build configuration and CI | Platform/build | Resolved graph and shipped notices pending |
| Product/creator branding and storefront | Sector Rebound, Spudacus, actual screenshots and future promotional exports | Distribution | Trademark screening, AI disclosure, publisher rights and exact approved promotional master inventory pending |

## Exact source asset inventory
Git blob SHA-1 identifies source bytes, not SHA-256 or proof of license. Mirrored paths counted separately. Source-only concept files not implied to ship.

| Path | Git blob | Bytes | Scope |
| --- | --- | ---: | --- |
| `android/app/src/main/assets/assets/m12/hangar-warm-empty-v1.svg` | `7efe4b676141798c2a5ae77a827c79b64012bc47` | 6114 | Runtime source |
| `android/app/src/main/assets/assets/m12/insignia-ace-study-v1.svg` | `708f7a07753d6025b2027b6d1a76bf87cb119514` | 538 | Runtime source |
| `android/app/src/main/assets/assets/m12/insignia-command-study-v1.svg` | `a68965cd619f25514978b305e0d36feaa0cb3267` | 489 | Runtime source |
| `android/app/src/main/assets/assets/m12/insignia-field-study-v1.svg` | `5443b63d2c3acd4a81f165d607a96845df8d47e8` | 518 | Runtime source |
| `android/app/src/main/assets/assets/m12/insignia-vector-study-v1.svg` | `6de10eccc3d34bcbb5aa6dc470868ea625f1637e` | 490 | Runtime source |
| `android/app/src/main/assets/assets/m12/mode-cqc-study-v1.svg` | `2a2e1913b8c5eae2548866b9bb300b7a4b90a7aa` | 1338 | Runtime source |
| `android/app/src/main/assets/assets/m12/mode-custom-study-v1.svg` | `d085dee30f92ead686aac2c9c22e3188a4092423` | 1284 | Runtime source |
| `android/app/src/main/assets/assets/m12/mode-ffa-study-v1.svg` | `01b600fe48a1d5c4ff7b994aa323cda42bad9f8b` | 1355 | Runtime source |
| `android/app/src/main/assets/assets/m12/mode-tdm-study-v1.svg` | `e9f4ee39002bac2072a5f4bb8d107ee6ffbef6cf` | 1448 | Runtime source |
| `android/app/src/main/assets/branding/spudacus-v1-full-transparent.png` | `7f64339220f851c7e36ae1b0c0662892c0ed1694` | 739499 | Runtime source |
| `android/app/src/main/res/drawable-nodpi/ic_launcher.png` | `bafa30d45305c5ddc1fcbaf90fe00102b5253302` | 11199 | Runtime source |
| `android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.webp` | `504eaf7055ce8f044177f2cc00560d9927913c39` | 5046 | Runtime source |
| `android/app/src/main/res/drawable/ic_launcher_monochrome.xml` | `bab56c1e8b906c427b7236c341f4f5b79f2879ef` | 1021 | Runtime source |
| `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` | `1b20ec96f20f234e3ab1ebe73f9824f681b42a7d` | 345 | Runtime source |
| `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` | `1b20ec96f20f234e3ab1ebe73f9824f681b42a7d` | 345 | Runtime source |
| `android/app/src/main/res/values/colors.xml` | `15e84b8a671cfbf3e32f49e44c6e27c62fa5c2ac` | 125 | Runtime source |
| `assets/source/pilots/pilot.pr.001/pilot.pr.001.svg` | `2a9f93539516ff72d7326e03f50d7d148ba3a49e` | 2292 | Source-only candidate |
| `assets/source/pilots/pilot.st.001/pilot.st.001.svg` | `1cc1ad8d600247501055133604129d7e3e948b37` | 2172 | Source-only candidate |
| `assets/source/pilots/pilot.st.002/pilot.st.002.svg` | `9973cd436a0f33979381483a6c77f84f196ca372` | 2620 | Source-only candidate |
| `web/assets/m12/hangar-warm-empty-v1.svg` | `7efe4b676141798c2a5ae77a827c79b64012bc47` | 6114 | Runtime source |
| `web/assets/m12/insignia-ace-study-v1.svg` | `708f7a07753d6025b2027b6d1a76bf87cb119514` | 538 | Runtime source |
| `web/assets/m12/insignia-command-study-v1.svg` | `a68965cd619f25514978b305e0d36feaa0cb3267` | 489 | Runtime source |
| `web/assets/m12/insignia-field-study-v1.svg` | `5443b63d2c3acd4a81f165d607a96845df8d47e8` | 518 | Runtime source |
| `web/assets/m12/insignia-vector-study-v1.svg` | `6de10eccc3d34bcbb5aa6dc470868ea625f1637e` | 490 | Runtime source |
| `web/assets/m12/mode-cqc-study-v1.svg` | `2a2e1913b8c5eae2548866b9bb300b7a4b90a7aa` | 1338 | Runtime source |
| `web/assets/m12/mode-custom-study-v1.svg` | `d085dee30f92ead686aac2c9c22e3188a4092423` | 1284 | Runtime source |
| `web/assets/m12/mode-ffa-study-v1.svg` | `01b600fe48a1d5c4ff7b994aa323cda42bad9f8b` | 1355 | Runtime source |
| `web/assets/m12/mode-tdm-study-v1.svg` | `e9f4ee39002bac2072a5f4bb8d107ee6ffbef6cf` | 1448 | Runtime source |

## Release gates and limitations
SR-HUB-02 passed 31 source and 16 package asset checks on original R10 debug APK, SHA256 702ec203f4ef3769108725adc937b9a2f23c9290bbeda8ac6e3427be2a0c1c05. This does not verify every packaged file, compiled resource, license or asset rights. No lockfile or license/notice file was identified in the inspected tree; resolve actual dependency graph and notices for exact release before public distribution. Record generation provider/model/date/plan and terms where known, source inputs and human contributions; unknown is not cleared. Do not upload private receipts or change project license without explicit approval. Verify actual APK complete asset inventory, concept exclusion, launcher and fonts; archive approved master art and receipts. Mark screening not performed; no claim of trademark clearance. No code/assets/keys/rights declarations or publication changed.

Next: collect provenance and resolved dependency/license evidence, prepare notices as required, then signed beta candidate verification. Owner physical approval and public policy gates remain separate.
