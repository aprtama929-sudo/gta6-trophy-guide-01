# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/aprtama929-sudo/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/aprtama929-sudo/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Platinum is an offline web app: a guide and tracker for all 55 official Grand Theft Auto VI trophies on PlayStation 5. Every trophy carries an original guide (at least 200 characters) reasoned from its official description, with a Sources line citing Exophase and PSNProfiles and an honesty note that the advice is pre-release and not yet checked in the game. The tracker saves a checklist in localStorage with export and import, counts 19 numeric targets (250 stunts, 42 shooting-range golds, 500 choices, $250,000 laundered, and more) with steppers, direct input, progress bars and auto-earn at the target, and filters by grade, kind, earned status, missable flag and text search. A spoiler shield — on by default — masks unearned story trophies, and search cannot see through it. A seven-stage platinum roadmap covers all 55 trophies exactly once, and a missables view presents four trophies flagged as possibly missable, each quoting the official description it was reasoned from and labelled as unconfirmed inference, not fact. Hash routes open a trophy guide (#/guide/<n>), the roadmap (#/roadmap), the missables (#/missables) and grade views (#/grade/<grade>), and a deterministic ?seed= state (13 of 55 earned, counters part way, spoilers on) powers the screenshots.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser. The app is fully static and offline — no build step, no network requests. To hand the entry in instead, run `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`, which copies `app/` and `screenshots/` into `out/` and writes `out/dossier.json`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=j0mxz08v&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
