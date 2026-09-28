# 2048

A browser-based 2048 game: slide matching tiles together to reach 2048, then keep playing for a higher score. Built with React and TypeScript, with Vite for development and production builds.

## Features

- Keyboard, touch-swipe, and mouse-drag controls.
- Board sizes from 3×3 to 6×6, with 4×4 selected by default.
- Elegant Dark (default), Classic Light, and Noire themes, animated tiles, and a win celebration with confetti matching each theme.
- Noire pairs a nearly black background with matte graphite-to-ivory tiles and silver-white confetti.
- One-move undo, a separate best score for each board size, and automatic saving in your browser.

## Run locally

Install Node.js and pnpm. Then download the repository and start the game:

```sh
git clone https://github.com/VladislavDegtyarenko/preact-2048-game.git
cd preact-2048-game
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm install --frozen-lockfile` installs the dependency versions recorded in `pnpm-lock.yaml`. Open the local address printed in the terminal. Vite is configured to open a browser automatically; the development command also makes the server available on your local network.

The game runs entirely in the browser. No accounts, database, or environment variables are required.

## How to play

Move tiles with the arrow keys, swipe across the board, or click and drag in a direction. Two matching tiles merge into one tile with double the value; for example, two 4s become an 8. Each move that changes the board adds a new tile.

| Control            | Action                                                                         |
| ------------------ | ------------------------------------------------------------------------------ |
| New game           | Start with two tiles and reset the current score.                              |
| Undo last move     | Restore the board and score before the previous move; available once per move. |
| Best               | View best scores for all four board sizes.                                     |
| Open game settings | Choose the board size and theme: Elegant Dark, Classic Light, or Noire.        |

Changing the board size starts a new game. Before your first move, New game and board-size changes happen immediately. After any move that shifts or merges tiles, both actions ask for confirmation, even if you undo that move or the win screen is showing. Inputs that leave the board unchanged do not count as moves. Selecting the current size does nothing.

Cancel, Escape, the close button, or a click outside the dialog keeps your current game. A board-size confirmation appears above Settings; Settings stays open when you cancel or confirm. Your best scores are retained, and starting a new game clears undo history.

The Best button shows the record for the selected board size. Select it to see all four records; a dash means no record has been saved for that size. A new record is saved when your score first becomes positive, then increases as you score more. Undo, new games, and board-size changes keep your records. The game pauses while the Best Scores dialog is open. Close it with Escape, the close button, or a click on its backdrop.

After reaching 2048, wait for the celebration prompt, then press a key or tap the win screen to continue. The game ends when the board is full and no adjacent tiles can merge.

### Saved progress

The game uses `localStorage`, the browser's storage for this site, to save the board, scores, board size, theme, and whether you have made a valid move. An unfinished game resumes when you reload the page; reloading after game over starts a new game.

Older saves infer prior play from the score, undo history, tiles, and win/game-over flags. An older save that looks like a fresh board cannot reveal a first move that was already undone; new saves preserve that history.

An older save with a single best score moves that record to 4×4, including a saved zero, regardless of the selected board size. The other sizes start without records. This conversion keeps your current game and undo history and is saved immediately when browser storage is available.

Saved progress stays in that browser and site address. Clearing the site's stored data removes it.

## Development commands

Run these commands from the repository root:

| Command                          | Purpose                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Install dependencies from the lockfile.                       |
| `pnpm format`                    | Format files and sort imports.                                |
| `pnpm format:check`              | Check formatting without changing files.                      |
| `pnpm dev`                       | Start the development server.                                 |
| `pnpm build`                     | Check TypeScript types and write production files to `dist/`. |
| `pnpm preview`                   | Serve the production build locally; run the build first.      |

Prettier sorts imports into groups separated by blank lines: React and React DOM, other libraries, components, hooks, other local imports, and styles. Components are recognized by the component folders and uppercase filenames; hooks are recognized by the hooks folder and `use` filename prefix. Imports from contexts stay with other local imports. Group labels such as `// Redux` are not generated.

In VS Code, install the recommended Prettier extension. The project settings enable Format on Save and use Prettier for Format Document.

There is no automated test suite or lint command configured. For code changes, run `pnpm build` and follow the manual checks in [Testing Guidelines](AGENTS.md#testing-guidelines).

## How it works

[src/main.tsx](src/main.tsx) starts React and connects Redux Toolkit, which manages shared game state. [src/app.tsx](src/app.tsx) initializes the game, applies the theme, and assembles the interface. [GameWrapper](src/components/GameWrapper.tsx) connects keyboard, swipe, and sizing behavior.

[GameConfirmationContext.tsx](src/contexts/GameConfirmationContext.tsx) shares pending confirmations. [BestScoresModalContext.tsx](src/contexts/BestScoresModalContext.tsx) shares the records window's open state and actions. Both use React Context so components can read this state directly without passing it through intermediate components. This state stays in memory and is not saved with the game. [useGameInputBlocked](src/hooks/useGameInputBlocked.ts) checks whether an open modal blocks keyboard input, swipes, and the win screen's continue action.

[src/features/boardSlice.ts](src/features/boardSlice.ts) handles movement, merging, scoring, and undo. [src/features/localStorageMiddleware.ts](src/features/localStorageMiddleware.ts) saves game state after updates. Components keep their styles alongside their code in `.module.scss` files, which scope styles to each component.

## Contributing

Read [AGENTS.md](AGENTS.md) for the annotated source tree, coding conventions, manual testing checklist, and commit and pull request guidance. Keep setup and gameplay documentation in this README and contributor instructions in `AGENTS.md`.
