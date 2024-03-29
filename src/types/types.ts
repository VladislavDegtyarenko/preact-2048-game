import React, { ReactNode } from "react";

export type Theme = "DARK" | "LIGHT";
export type BoardSize = 3 | 4 | 5 | 6;

export type Settings = {
  theme: Theme;
  boardSize: BoardSize;
  settingsIsOpened: boolean;
};

export type BoardState = {
  tiles: Tile[];
  previousTiles: Tile[] | null;
  score: number;
  previousScore: number | null;
  bestScore: number;
  gameOver: boolean;
  win: boolean;
  waitAfterWin: boolean;
  showWinScreen: boolean;
};

export type TileValue =
  | 2
  | 4
  | 8
  | 16
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1024
  | 2048
  | 4096
  | 8192
  | 16384
  | 32768
  | 65536
  | 131072;

export type Tile = {
  value: TileValue;
  top: number;
  left: number;
  id: string;
  isMerged?: boolean;
  toTriggerDoubleAnimation?: boolean;
  toTriggerDeleteAnimation?: boolean;
};

export type Direction = "up" | "down" | "left" | "right";
// export type TilesPerRow = 3 | 4 | 5 | 6;

export type GameContextProps = {
  tiles: Tile[];
  tilesPerRow: number;
  score: number;
  bestScore: number;
  gameOver: boolean;
  previousScore: number | null;
  ANIMATION_DURATION: number;
  animateScore: boolean;
  actions: {
    startNewGame: () => void;
    setTiles: (value: React.SetStateAction<Tile[]>) => void;
    moveTiles: (direction: Direction) => void;
    undoAction: () => void;
  };
  if: {
    noUndoActions: boolean;
    win: boolean;
    showWinScreen: boolean;
    setShowWinScreen: React.Dispatch<React.SetStateAction<boolean>>;
    waitAfterWin: boolean;
  };
  settings: Settings & {
    settingsIsOpened: boolean;
    toggleSettingsModal: () => void;
    setTheme: (theme: Theme) => void;
    setBoardSize: (boardSize: BoardSize) => void;
  };
};

export type CustomCSSVariables = React.CSSProperties & {
  "--transition-duration": string;
  "--container-width": string;
  "--outer-margin": string;
  "--tiles-per-row": number;
  "--board-padding": string;
  "--cell-size": string;
  "--cell-gap": string;
};

export type CustomCountUpStyles = React.CSSProperties & {
  "--fontSizeReduceCoeff": string;
};

export type CustomTileStyles = React.CSSProperties & {
  "--top": number;
  "--left": number;
  "--background-color": string;
};

// UI
export type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  transparent?: boolean;
  title?: string;
  disabled?: boolean;
};

export interface CustomSelectProps<T> {
  heading: string;
  options: { [key: string]: string | number };
  selected: string | number;
  handleSelect: (selected: T) => void;
}
