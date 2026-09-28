import { BOARD_SIZES } from "../constants/boardSizes";
import { BoardSize, BoardState } from "../types/types";

type SavedBoard = Omit<BoardState, "hasMoved" | "bestScore"> & {
  hasMoved?: boolean;
  bestScore: unknown;
};

/** Accept only finite, nonnegative whole-number records. */
const isValidBestScore = (value: unknown): value is number => {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0
  );
};

/** Restore saved records by board size without changing the current game. */
export const migrateBoardState = (savedBoard: SavedBoard): BoardState => {
  const bestScore: BoardState["bestScore"] = {};
  const savedBestScore = savedBoard.bestScore;

  if (isValidBestScore(savedBestScore)) {
    bestScore[4] = savedBestScore;
  } else if (
    typeof savedBestScore === "object" &&
    savedBestScore !== null &&
    !Array.isArray(savedBestScore)
  ) {
    const savedScores = savedBestScore as Partial<Record<BoardSize, unknown>>;

    for (const boardSize of BOARD_SIZES) {
      const score = savedScores[boardSize];

      if (isValidBestScore(score)) {
        bestScore[boardSize] = score;
      }
    }
  }

  return {
    ...savedBoard,
    bestScore,
    hasMoved:
      savedBoard.hasMoved ??
      Boolean(
        savedBoard.score > 0 ||
        savedBoard.previousTiles?.length ||
        savedBoard.previousScore != null ||
        savedBoard.tiles.length > 2 ||
        savedBoard.tiles.some((tile) => tile.value > 4) ||
        savedBoard.win ||
        savedBoard.gameOver ||
        savedBoard.showWinScreen ||
        savedBoard.waitAfterWin
      ),
  };
};
