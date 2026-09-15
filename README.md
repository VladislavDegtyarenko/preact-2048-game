# 2048

A browser-based 2048 game: slide matching tiles together to reach 2048, then keep playing for a higher score. Built with React and TypeScript, with Vite for development and production builds.

## Features

- Keyboard, touch-swipe, and mouse-drag controls.
- Board sizes from 3×3 to 6×6, with 4×4 selected by default.
- Dark and light themes, animated tiles, and a win celebration.
- One-move undo, current and best scores, and automatic saving in your browser.

## Run locally

Install Node.js and npm, its package manager. Then download the repository and start the game:

```sh
git clone https://github.com/VladislavDegtyarenko/preact-2048-game.git
cd preact-2048-game
npm ci
npm run dev
```

`npm ci` installs the dependency versions recorded in `package-lock.json`. Open the local address printed in the terminal. Vite is configured to open a browser automatically; the development command also makes the server available on your local network.

The game runs entirely in the browser. No accounts, database, or environment variables are required.

## How to play

Move tiles with the arrow keys, swipe across the board, or click and drag in a direction. Two matching tiles merge into one tile with double the value; for example, two 4s become an 8. Each move that changes the board adds a new tile.

| Control | Action |
| --- | --- |
| New game | Start with two tiles and reset the current score. |
| Undo last move | Restore the board and score before the previous move; available once per move. |
| Open game settings | Choose a board size or switch between Elegant Dark and Classic Light. |

Changing the board size starts a new game. Your best score is retained. After reaching 2048, wait for the celebration prompt, then press a key or tap the win screen to continue. The game ends when the board is full and no adjacent tiles can merge.

### Saved progress

The game uses `localStorage`, the browser's storage for this site, to save the board, scores, board size, and theme. An unfinished game resumes when you reload the page; reloading after game over starts a new game.

Saved progress stays in that browser and site address. Clearing the site's stored data removes it.

## Development commands

Run these commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies from the lockfile. |
| `npm run dev` | Start the development server. |
| `npm run build` | Check TypeScript types and write production files to `dist/`. |
| `npm run preview` | Serve the production build locally; run the build first. |

There is no automated test suite or lint command configured. For code changes, run `npm run build` and follow the manual checks in [Testing Guidelines](AGENTS.md#testing-guidelines).

## How it works

[src/main.tsx](src/main.tsx) starts React and connects Redux Toolkit, which manages shared game state. [src/app.tsx](src/app.tsx) assembles the interface and connects keyboard, swipe, and sizing behavior.

[src/features/boardSlice.ts](src/features/boardSlice.ts) handles movement, merging, scoring, and undo. [src/features/localStorageMiddleware.ts](src/features/localStorageMiddleware.ts) saves game state after updates. Components keep their styles alongside their code in `.module.scss` files, which scope styles to each component.

## Contributing

Read [AGENTS.md](AGENTS.md) for the annotated source tree, coding conventions, manual testing checklist, and commit and pull request guidance. Keep setup and gameplay documentation in this README and contributor instructions in `AGENTS.md`.
