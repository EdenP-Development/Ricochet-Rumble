# Sector Rebound — Android itch.io Beta 1 privacy policy (review draft)

Not approved for publication. Publisher, effective date, monitored privacy contact and audience remain owner decisions. Applies only to the eventual accepted Android itch.io Beta 1 build; reconcile against its exact signed artifact before publication.

## What the game stores
Sector Rebound is designed for local play without an account. It saves settings, Custom Match rules and named presets, aggregate Solo match statistics, selected cosmetics and onboarding flags on the device. Daily Sector records, if that feature is available in the distributed build, can include dates, attempts and best results. Internal record identifiers help avoid counting the same result twice. Recovery records may preserve earlier or damaged save values to help recover progress.

## Nearby play
If Local Play is included in this release and you choose to use it, devices discover or connect to one another over the network using the game service name or a local IP address and port. Connected devices exchange game inputs, lobby settings, match state, scores and session information. The reviewed implementation has no developer-hosted matchmaking or player account database. Direct TCP gameplay is not established to be encrypted or authenticated; use a trusted network. Network connectivity permissions support this feature. Local play is not a promise of network isolation.

## Backup and sharing
The Dossier backup option creates readable JSON text containing supported local save records, including any named presets. You may copy, save or share this text through an app of your choice. The backup is not encrypted by the game. External copies are controlled by you and the chosen service, whose own privacy practices apply. Restore can retain recovery information on the device. The reviewed code does not automatically upload the backup.

## Retention and choices
Local information is retained in app storage; you can edit settings, delete custom presets and manage backup copies. Clearing app data or uninstalling normally removes the app's local records; export a backup first if you want to keep progress. This does not erase copies held elsewhere or guarantee deletion of operating-system logs. No hosted player account deletion mechanism is needed in the reviewed account-free design.

## Other services and security
The reviewed dependency inventory contains local game-rendering libraries, not advertising, analytics or connected purchase SDKs. The Android WebView is configured to block remote network loads; this does not establish absence of native network traffic. Android, the download platform and any sharing or support service may process information separately. No promise of absolute security, anonymity or zero data collection is made.

## Contact and policy changes
[APPROVED PUBLIC PUBLISHER REQUIRED]
[MONITORED PUBLIC PRIVACY CONTACT REQUIRED]
[APPROVED EFFECTIVE DATE AND STABLE HTTPS URL REQUIRED]

Players may use the approved contact to ask privacy questions or request help with their local data. Do not send full backups, credentials or private network information unless a specific safe procedure is agreed. Future versions with materially different data practices require updated disclosure.

## Internal acceptance notes (remove from approved public copy)
- Reconcile actual enabled Daily Sector and LAN features and final audience; do not advertise unverified functionality.
- Verify exact signed manifest, dependency graph, runtime WAN/LAN, retention, backup and restore, and permission handling.
- Prior unsigned packaged manifest: INTERNET, ACCESS_NETWORK_STATE, ACCESS_WIFI_STATE; allowBackup=false, usesCleartextTraffic=false (not raw TCP encryption).
- Browser offline Help license tests passed run 46103918935; not evidence of Android network privacy.
- Owner approve actual publisher, contact, audience, host and exact text. Verify applicable current platform and legal requirements before publication. No legal clearance claimed.
- Use existing website route architecture only after owner approval; no placeholder publishing. Keep Google Play declarations separate from itch beta.
