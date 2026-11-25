# Sector Rebound Beta 1 — cross-repository AI and engineering reuse audit

**Date:** 2026-11-25. **Status:** research and recommendation only. **No gameplay, signing, package, saves or art were changed.** User explicitly authorized reviewing other repositories for relevant design/engineering ideas. All third-party game references below are the owner's other projects, not outside commercial libraries.

## Actual source material inspected

| Source | Pinned code evidence | Transferable concept | Caution |
|---|---|---|---|
| [The Last Taters](https://github.com/PlayerEden/the-last-taters) | `game.js`, main `0c768b7fe1b2a383760281140e36704b1754e683`; `docs/design/TATER_BRAIN_LAB.md`; `docs/GAME_BIBLE.md`; `docs/ROADMAP.md` | Priority-based autonomy, bounded decision cadence, explainable choices, repeatable equal-seed A/B | Colony workers' needs/economy/relationships and long-lived agents do **not** map directly to fast tactical shooting |
| [Sector Rebound](https://github.com/EdenP-Development/Ricochet-Rumble) | `web/game.js`, main after Spudacus integration and docs; `docs/AI_SINGLE_SHOT_FAIRNESS_2026-11-01.md`, `docs/BOT_TRAJECTORY_COMMIT_A3_2026-11-02.md`, `docs/SOLO_BOT_LAST_SEEN_PURSUIT_2026-11-02.md`, `docs/BOT_PERSONALITIES_EXPERIMENT_2026-11-01.md` | Existing bot goal priorities, real LOS and last-seen memory, committed fair shot planning, role differentiation, deterministic tests | Existing bot system is substantial and already physically constrained; replacing it to imitate Taters risks fairness, CPU load, camera and saves |
| [SudokuTogether](https://github.com/EdenP-Development/SudokuTogether) | `PuzzleCoachDialog.kt` at main `770d0d2e0448c76975559854bec4f8e890b4d500`, plus on-device coach instrumentation test inventory | Present intelligible reasons and evidence; distinguish rule-based assistance from an opaque magic-answer button | A player-facing Coach UI is not an appropriate addition to Sector Rebound Beta 1; diagnostic messages belong in non-player QA |
| [Operation Phosphor](https://github.com/PlayerEden/Operation-Phosphor) | `SnapshotDecision.kt` at main `940cadeddbc94327ef97b8e1f39e5f443ee43d92` | Bounded, validated input/saves; lineage and monotonic revision-aware conflict decisions | Phosphor uses a different game/profile architecture; do not import Kotlin snapshot code directly into Sector Rebound's JS local backup |
| [The Town Was Fine](https://github.com/PlayerEden/The-Town-Was-Fine) | Repo tree and `tests/verify-baseline.mjs` inventory | Repeatable visual baseline and regression discipline | Not a bot combat AI source; no code transplant recommended |

## What Taters' AI actually does (verified in source)

**Not neural-network AI or generalized learning.** The project's own Brain Lab documents production as primarily rule/state/priority driven. In actual `game.js`:

1. `scoreActions(p)` assigns weighted scores to valid actions. Examples include hunger/energy-driven **eat/rest**, construction urgency and learned work familiarity, work ethics and local opportunities. Candidate actions are scored against the tater's situation; they are not universal instructions like “always gather”.
2. `updatePot(p,dt)` maintains needs, injury, interaction and commitment state. Its decisions make sense over a colony day/night timescale, not every 60Hz shooting frame.
3. `taterDecisionPause()` deliberately **reduces decision frequency with greater population** (for 56+ settlers, ~0.48–0.78s; for fewer than 26, ~0.16–0.34s). This is a measurable CPU budgeting idea, not a claim of improved intelligence.
4. `defenseResolve(p)`, `friendInDangerBonus(p,b)` and `updateTaterDefense(p,dt)` combine courage, accumulated experience, injury/exhaustion and nearby allies to decide whether to stand, hesitate, flee or approach an opponent. These are bounded contextual factors, not cheat accuracy.
5. `findNavPath()` is bounded A*-style grid navigation with a binary heap, connected-region early rejection, generation-stamped scratch arrays and diagonal-corner checks. It also gently biases established trails without turning them into mandatory routes. Those engineering optimizations are interesting for maze/path CPU profiling but must be evaluated against Sector Rebound's own grid navigation first.
6. Brain Lab's **`state -> considered actions -> selected action -> outcome`** trace is explicitly described as a future experiment/recommendation. Do not claim this structured full trace is already implemented across production Taters. Similarly adaptive utility weights and bandit-style learning are explicitly **future experiments**, not proven production ML.

## What Sector Rebound already has — do not duplicate it

- `chooseBotObjective()`: prioritizes physically viable vehicle recovery, meaningful repair/pickup opportunities, low-armor retreat and fair engagement, with sentinel positioning.
- `botRoleFor()`: opt-in Custom `varied` roles Hunter / Sentinel / Scavenger, deterministic by index; existing audit used 300 seeds and 1,800 simulation steps. This is already the analogue of simple personality priorities. It does **not** justify default-changing AI for Beta 1.
- `soloBotPursuitPoint()`: respects genuine LOS and camera limits; chases last *seen* human coordinates for only ~1.8s, then deterministic search rather than omniscient tracking through maze walls.
- `botFireCommit()`, `botTraceAim()`, `botAimPosture()`: acquire → physical turn/brake → settle → fire → recover; a fixed modest search of direct plus up to six one-bounce candidates, LOS, actual projectile simulation, capped CPU retries, no mid-shot lock-on. Human pilot/camera fairness and different skill timing are already guarded.
- Existing actual-browser seed runs and shooter-specific regression suites are more relevant to fair fast shooting than transplanting a colony simulation's top-level `scoreActions()`.

**Conclusion:** The most useful cross-game idea is **decision observability and reason-coded measurement**, not a replacement AI system or new “self-learning bot” marketing. Camera scales (pilot 0.94, tank 0.73, mech 0.69), combat physics, old saves and LAN host authority must stay fixed unless independently approved.

## Recommended small, reversible AI experiment — after M13 Beta 1 integration

**A0: explanation and decision trace, offline QA only, zero game-balance change.**

- Add a development-only recorder at the boundary between **existing** `chooseBotObjective`/`soloBotPursuitPoint`/`botFireCommit` and `botInput`. The recorder should sample **existing decisions**, not influence them.
- Every sampled event: `matchSeed`, bot index/role/skill, relative timestamp/frame, **observable** context (line of sight yes/no, last-seen timer, nearby pickup type, armor band), selected goal kind (`recovery`, `supply`, `evade`, `hold`, `engage`, or `search`), decision reason *code*, number of aim candidates actually examined, shot attempted/committed/cancelled, and outcome counters. Avoid logging exact player identity, persistent profile data or Wi-Fi identifiers.
- Use a capped in-memory ring buffer or aggregate counters; **never** telemetry upload, analytics SDK, saved-profile schema, or extra multiplayer packets. Disabled by default in production.
- Instrumentation must not call AI decision functions twice or perturb RNG/game state; compare equal-seed scenarios in diagnostic QA and verify **identical control commands, HP/lives, match result and score** with recorder on vs off. Budget frame time and memory on low-end Android.
- Compare genuine outcomes by mode: CQC, FFA, Solo TDM, Survival, CTF and bot skill; report aim delay, bad path churn, LOS fairness, bot idling/stall rate, recovery/supply usefulness and human readability. Avoid ranking “smartness” by win rate alone.
- **Gate:** 300 or more matched seeds, representative arena sizes, real-browser checks, save/LAN and visual regressions; owner phone check for heat/FPS, fun and perceived bot fairness. Only then decide whether any behavior needs tuning.

**A1 (conditional, later):** if A0 identifies a specific deficiency, trial a **bounded priority adjustment** (e.g. goal commitment hysteresis or emergency route fallback). Compare baseline and candidate with matched seeds, preserve human-facing reaction limits and avoid adaptive accuracy/cheating. Do not add learning/ML unless a measured deficit and an explainable alternative justify it. No A1 work needed simply to claim smarter bots.

## Other cross-repo practices useful for Beta 1

- **From Sudoku:** put meaningful, readable descriptions and guardrail tests ahead of showy but unreliable “AI features.” For Sector Rebound this means precise Help/controls and After Action/mode instructions rather than a new AI coach.
- **From Phosphor:** validate any import/restore payload before touching a profile; never overwrite diverged or newer progress silently. Sector Rebound already has backup recovery gates—cross-check their logic against missing/inconsistent lineage and monotonic state, without automatically changing save schema.
- **From Taters:** run equal-seed baselines rather than changing four AI knobs simultaneously. Test performance at realistic numbers of concurrent entities; keep bounded path-planning and per-bot decision cadence separate from high-frequency movement and projectile physics.
- **From shared EdenP CI:** retain exact-head source/checksum evidence and lasting documentation; do not interpret old expired artifacts as downloadable releases.

## Beta 1 decision and rollout

- **Immediate priority remains B1-03:** selected owner-approved Warm Industrial artwork/UX and truthful match presentation. **B1-02** owner 30 KOs/5 minutes vs 40 KOs/6 minutes phone A/B is still unresolved.
- **A0 recommended for focused QA when visual/rules are consolidated**, not as a blocking core-game redesign before first itch.io Beta 1.
- No runtime AI or code change, no extra repository permission or secrets, no APK or public publication triggered by this audit.

**Owner authorization:** review/use ideas from other repositories; **not** approval to rewrite AI, merge historical experimentation, change difficulty or defer Beta 1 indefinitely.
