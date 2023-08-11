import { useContext, useRef, useEffect } from "react";
import GameContext from "../../GameContext";

import Grid from "./Grid";
import styles from "./Board.module.scss";
import Tiles from "./Tiles";
import WinScreen from "./WinScreen";
import GameOverScreen from "./GameOverScreen";
import Settings from "../Settings/Settings";

const Board = () => {
  const {
    tilesPerRow,
    gameOver,
    actions: { moveTiles },
    if: { showWinScreen },
    settings: { settingsIsOpened },
  } = useContext(GameContext);

  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bindSwipes();

    return () => clearSwipes();
  });

  function bindSwipes() {
    if (!boardRef.current) return;

    boardRef.current.addEventListener("touchstart", handleTouchStart, { passive: false });
    boardRef.current.addEventListener("touchmove", handleTouchMove, { passive: false });
    boardRef.current.addEventListener("touchend", handleTouchEnd);

    boardRef.current.addEventListener("mousedown", handleTouchStart, { passive: false });
    boardRef.current.addEventListener("mousemove", handleTouchMove, { passive: false });
    boardRef.current.addEventListener("mouseup", handleTouchEnd);
    boardRef.current.addEventListener("mouseleave", handleTouchEnd);
  }

  function clearSwipes() {
    if (!boardRef.current) return;

    boardRef.current.removeEventListener("touchstart", handleTouchStart);
    boardRef.current.removeEventListener("touchmove", handleTouchMove);
    boardRef.current.removeEventListener("touchend", handleTouchEnd);

    boardRef.current.removeEventListener("mousedown", handleTouchStart);
    boardRef.current.removeEventListener("mousemove", handleTouchMove);
    boardRef.current.removeEventListener("mouseup", handleTouchEnd);
    boardRef.current.removeEventListener("mouseleave", handleTouchEnd);
  }

  const touchstart = useRef({
    x: 0,
    y: 0,
  });

  let mouseClicked = false;
  let swipeDetected = false; // Initialize the flag to false

  // function handleTouchStart(e: TouchEvent): void;
  // function handleTouchStart(e: MouseEvent): void;
  function handleTouchStart(e: TouchEvent | MouseEvent) {
    e.preventDefault();

    mouseClicked = true;

    if (e.type === "touchstart") {
      const touchEvent = e as TouchEvent;

      touchstart.current = {
        x: touchEvent.touches[0].clientX,
        y: touchEvent.touches[0].clientY,
      };
    }

    if (e.type === "mousedown") {
      const mouseEvent = e as MouseEvent;

      touchstart.current = {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY,
      };
    }
  }

  const SWIPE_DISTANCE = 32;

  function handleTouchMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    if (swipeDetected) return; // Don't detect any more swipes if one has already been detected
    if (!mouseClicked) return; // Skip if mousedown is not fired

    let x = 0,
      y = 0;

    if (e.type === "touchmove") {
      const touchEvent = e as TouchEvent;

      x = touchEvent.touches[0].clientX;
      y = touchEvent.touches[0].clientY;
    }

    if (e.type === "mousemove") {
      const mouseEvent = e as MouseEvent;

      x = mouseEvent.clientX;
      y = mouseEvent.clientY;
    }

    const startX = touchstart.current.x;
    const startY = touchstart.current.y;

    const swipeLeft = startX - x > SWIPE_DISTANCE;
    const swipeRight = x - startX > SWIPE_DISTANCE;
    const swipeUp = startY - y > SWIPE_DISTANCE;
    const swipeDown = y - startY > SWIPE_DISTANCE;

    if (swipeLeft || swipeRight || swipeUp || swipeDown) {
      swipeDetected = true;
      mouseClicked = false;

      touchstart.current = {
        x: 0,
        y: 0,
      };
    }

    if (swipeLeft) return moveTiles("left");
    else if (swipeRight) return moveTiles("right");
    else if (swipeUp) return moveTiles("up");
    else if (swipeDown) return moveTiles("down");
  }

  function handleTouchEnd(e: MouseEvent | TouchEvent) {
    e.preventDefault();

    swipeDetected = false;
    mouseClicked = false;

    touchstart.current = {
      x: 0,
      y: 0,
    };
  }

  return (
    <div className={styles.board}>
      <div className={styles.boardInner} ref={boardRef}>
        <Grid size={tilesPerRow} />
        <Tiles />
      </div>
      {showWinScreen ? <WinScreen /> : null}
      {gameOver ? <GameOverScreen /> : null}
      {settingsIsOpened ? <Settings /> : null}
    </div>
  );
};

export default Board;
