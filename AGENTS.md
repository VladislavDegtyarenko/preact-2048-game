# Repository Guidelines

## Project Structure & Module Organization

This 2048 game uses React, TypeScript, Vite, and Redux Toolkit for shared game state. See [README.md](README.md) for setup and gameplay.

```text
.
├── src/                  # Application source
│   ├── main.tsx          # Starts the application
│   ├── app.tsx           # Assembles the interface
│   ├── components/       # Interface components and adjacent .module.scss styles
│   │   ├── Board/        # Board, tiles, and win/game-over screens
│   │   ├── Settings/     # Theme and board-size controls
│   │   └── ui/           # Reusable buttons, selects, and overlays
│   ├── features/         # Game rules, settings updates, and saved state
│   ├── store/            # Shared-state configuration in store.ts
│   ├── hooks/            # Reusable React behavior for input, sizing, and state access
│   ├── types/            # Shared TypeScript definitions
│   ├── utils/            # Constants and browser-storage helpers
│   └── assets/           # Imported images and other assets
└── public/               # Files served directly
```

No test directory exists.

## Build, Test, and Development Commands

Install Node.js and npm, its package manager, then run commands from the repository root:

- `npm ci`: install dependencies using `package-lock.json`.
- `npm run dev`: start the Vite development server with network access enabled.
- `npm run build`: check TypeScript types and generate production files in `dist/`.
- `npm run preview`: serve the production build locally after building.

## Coding Style & Naming Conventions

Use two-space indentation, double quotes, and semicolons. Keep TypeScript strict checking enabled. Name components `Board.tsx`, hooks `useSwipes.tsx`, and matching styles `Board.module.scss`. Use `UPPER_SNAKE_CASE` for constants.

Keep game rules in `src/features/` and presentation in components. Use braces for every conditional body. Document new utility functions with a short `/** ... */` comment. No formatter or linting tool is configured; keep edits consistent with surrounding formatting. Ask before adding production dependencies.

## Testing Guidelines

No automated test framework, test command, coverage target, or test naming convention is configured. Run `npm run build` for code changes. Manually check keyboard moves, swipes, merges, scoring, undo, new games, themes, board-size changes, and saved progress after reload. Check win/game-over screens when changing board rules and narrow-screen layouts when changing styles.

## Commit & Pull Request Guidelines

History uses short, action-focused messages such as `debounce resize`; occasional fixes use `fix: ...`. Follow that style and keep each commit focused.

Pull requests should explain the change, link relevant issues, list validation performed, and include screenshots for visible interface changes.
