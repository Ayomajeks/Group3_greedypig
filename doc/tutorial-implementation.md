# Interactive tutorial — group handoff

## Why it counts as an improvement

An interactive, five-move learning experience replaces reliance on reading a static rule page. Players can practise rolling, choosing PASS, seeing points move into the bank, and seeing a 1 wipe out only the unbanked score.

Category: Accessibility and experience.

## URLs

- `/live-game/tutorial`: interactive practice mode.
- `/live-game/how-to-play`: existing rules reference.
- `/live-game/setup`: start the real game.

The tutorial is linked from the home screen and shared navbar.

## Files

- `src/utils/tutorialEngine.js`: pure tutorial state transitions and scripted die outcomes.
- `src/utils/tutorialEngine.test.js`: regression tests for scoring and stage sequencing.
- `src/routes/Tutorial.jsx`: responsive, accessible guided interface.
- `src/main.jsx`, `src/routes/Home.jsx`, `src/components/Navbar.jsx`: entry points.
- `src/routes/HowToPlay.jsx`: fixes legacy home link.

## Important integration note

The tutorial is deliberately a simulated educational round, **not** a real match. Scripted die faces are explicitly labelled. It does not persist score data, send API requests, use Supabase credentials, or replace the team's server-side game logic work.

## Run & test

```bash
npm ci
npm run dev
node --test src/utils/tutorialEngine.test.js
npm run lint
npm run build
```

## Demo sequence (approximately 45 seconds)

1. Open Home → Learn to Play.
2. Click Start guided lesson.
3. Roll 4, then 3. Point out the unbanked score (7).
4. Select PASS. Point out Player 1's banked score (7) and Player 2's turn.
5. Roll 5, then roll 1. Point out Player 2's unbanked score reset to zero but Player 1 keeps 7.
6. Select Play for real to reach the existing setup screen.

## Hand-off checklist

- [ ] Route works when opened directly and through the navigation.
- [ ] Tutorial works on phone and desktop.
- [ ] Mouse and keyboard controls work.
- [ ] Results match the live game rules.
- [ ] Real game state remains unchanged after tutorial.
- [ ] Include this improvement in the group README and presentation.
