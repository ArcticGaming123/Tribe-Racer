# Tribe Racer

A local 3D arcade time-trial racer built with **TypeScript + React + Vite + React Three Fiber**.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown by Vite.

## Controls

- `W` accelerate
- `S` brake / reverse
- `A` steer left
- `D` steer right
- `TAB` pause menu
- `ESC` toggle pause / close overlays
- `R` reset to last checkpoint

## Features

- 10 progressively harder tracks
- Main menu with best time per track
- In-race HUD (timer + speed)
- Checkpoint validated finish
- Per-track leaderboard (top 10)
- Personal best ghost replay
- localStorage persistence for best times / leaderboard / ghost

## Main files

- `src/App.tsx` app flow and modal state
- `src/components/RaceScene.tsx` 3D gameplay and car controls
- `src/components/GhostReplay.tsx` ghost playback renderer
- `src/components/MainMenu.tsx` and `TrackSelect.tsx` menu UI
- `src/components/PauseMenu.tsx`, `LeaderboardModal.tsx`, `ResultsModal.tsx`
- `src/tracks/tracks.ts` all 10 track configs
- `src/utils/storage.ts` localStorage persistence
