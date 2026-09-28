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

/** Assign the legacy shared record to the original 4×4 board. */
const migrateLegacyBestScore = (bestScore: number): BoardState["bestScore"] => {
  return { 4: bestScore };
};

/** Restore saved records and move status without changing the current game. */
export const restoreBoardState = (savedBoard: SavedBoard): BoardState => {
  const bestScore: BoardState["bestScore"] = {};
  const savedBestScore =
    typeof savedBoard.bestScore === "number"
      ? migrateLegacyBestScore(savedBoard.bestScore)
      : savedBoard.bestScore;

  if (
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
