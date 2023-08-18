// React
import { useEffect, useRef } from "react";

// Redux
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { tilesMoved, userContinuedToPlay } from "../features/boardSlice";
import { getBoardSize, getSettingsIsOpened } from "../features/settingsSlice";

// TS
import { Direction } from "../types/types";

import { ANIMATION_DURATION } from "../utils/constants";

const useKeyboard = () => {
  const isAnimating = useRef(false); // temporarily

  const { tiles, gameOver, win, waitAfterWin, showWinScreen } = useAppSelector(
    (state) => state.board
  );
  const settingsIsOpened = useAppSelector(getSettingsIsOpened);
  const boardSize = useAppSelector(getBoardSize);
  const dispatch = useAppDispatch();

  const moveTiles = (direction: Direction) => {
    dispatch(tilesMoved({ direction, boardSize }));
  };

  useEffect(() => {
    document.body.addEventListener("keydown", keyboardControls);

    return () => document.body.removeEventListener("keydown", keyboardControls);
  });

  function keyboardControls(e: KeyboardEvent) {
    // define main controls
    const isArrowKey = (key: KeyboardEvent["key"]) =>
      ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key);

    // prevent arrow keys actions
    // if the board is empty,
    // while animating,
    // when settings modal is opened,
    //  if game is over
    if (tiles.length === 0 || isAnimating.current || settingsIsOpened || gameOver) return;

    // keys behaviour when the win screen is shown
    if (win && showWinScreen) {
      if (!waitAfterWin) dispatch(userContinuedToPlay());
      return;
    }

    if (isArrowKey(e.key)) {
      e.preventDefault();

      switch (e.key) {
        case "ArrowUp":
          moveTiles("up");
          break;
        case "ArrowDown":
          moveTiles("down");
          break;
        case "ArrowLeft":
          moveTiles("left");
          break;
        case "ArrowRight":
          moveTiles("right");
          break;
        default:
          break;
      }

      // This prevents user to press any arrow key
      // For an ANIMATION_DURATION time
      // In other words, while tiles are moving
      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, ANIMATION_DURATION);
    }
  }
};

export default useKeyboard;
