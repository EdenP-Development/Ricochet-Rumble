# Sector Rebound beta signing — owner secret-entry verification trigger

Triggered: 2026-11-24
Purpose: run the trusted-main, non-publishing GitHub Actions private-key preflight after owner confirmed creating all four organization Actions secrets.
Repository: EdenP-Development/Ricochet-Rumble (ID 1434527636)
Expected public certificate SHA-256: 43840f1525c03a5279fa4d76723b593779fad5837c655296f182cb642e4656c7

This contains NO private credentials or user data.
The workflow must verify the exact pinned certificate and sign/verify its throwaway probe with the real private key.
If any secret is missing or mismatched, stop rather than generating replacement key material.
Do not publish an APK or promote M13-F based on this preflight alone.
