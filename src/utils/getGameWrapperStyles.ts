import { ANIMATION_DURATION } from "../constants";
import { BoardSize, CustomCSSVariables } from "../types/types";

const MIN_CONTAINER_WIDTH = 360;
const MAX_CONTAINER_WIDTH = 480;
const OUTER_MARGIN = 16;
const BOARD_PADDING = 16;

/** Calculates the game wrapper styles from the available width and board size. */
export const getGameWrapperStyles = (
  viewportWidth: number,
  boardSize: BoardSize
): CustomCSSVariables => {
  const containerWidth = Math.min(
    MAX_CONTAINER_WIDTH,
    Math.max(MIN_CONTAINER_WIDTH, Math.floor(viewportWidth))
  );
  const boardWidth = containerWidth - OUTER_MARGIN * 2 - BOARD_PADDING;
  const cellSize = (boardWidth / boardSize) * 0.94;
  const cellGap = (boardWidth - cellSize * boardSize) / (boardSize - 1);

  return {
    "--transition-duration": ANIMATION_DURATION / 1000 + "s",
    "--container-width": containerWidth + "px",
    "--outer-margin": OUTER_MARGIN + "px",
    "--tiles-per-row": boardSize,
    "--board-padding": BOARD_PADDING + "px",
    "--cell-size": cellSize.toFixed(1) + "px",
    "--cell-gap": cellGap.toFixed(1) + "px",
  };
};
