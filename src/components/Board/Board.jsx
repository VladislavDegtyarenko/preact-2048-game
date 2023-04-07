import { useContext, useRef, useEffect } from "react";
import GameContext from "../../GameContext";

import Grid from "./Grid";
import styles from "./Board.module.scss";
import Tiles from "./Tiles";
import WinScreen from "./WinScreen";
import GameOverScreen from "./GameOverScreen";
import Settings from "./../Settings/Settings";

const Board = () => {
  const {
    tilesPerRow,
    gameOver,
    actions: { moveTiles },
    if: { showWinScreen },
    settings: { settingsIsOpened },
  } = useContext(GameContext);

  const boardRef = useRef();

  useEffect(() => {
    bindSwipes();
  }, []);

  function bindSwipes() {
    boardRef.current.addEventListener("touchstart", handleTouchStart, { passive: false });
    boardRef.current.addEventListener("touchmove", handleTouchMove, { passive: false });
    boardRef.current.addEventListener("touchend", handleTouchEnd);

    boardRef.current.addEventListener("mousedown", handleTouchStart, { passive: false });
    boardRef.current.addEventListener("mousemove", handleTouchMove, { passive: false });
    boardRef.current.addEventListener("mouseup", handleTouchEnd);
    boardRef.current.addEventListener("mouseleave", handleTouchEnd);
  }

  const touchstart = useRef({
    x: null,
    y: null,
  });

  let mouseClicked = false;
  let swipeDetected = false; // Initialize the flag to false

  function handleTouchStart(e) {
    e.preventDefault();

    mouseClicked = true;
    // console.log(e?.touches ? e.touches[0].clientX : e.clientX);

    if (e.type === "touchstart") {
      // if (e.touches.length > 0) return;
      touchstart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }

    if (e.type === "mousedown") {
      touchstart.current = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  }

  const SWIPE_DISTANCE = 32;

  function handleTouchMove(e) {
    // e.preventDefault();

    if (swipeDetected) return; // Don't detect any more swipes if one has already been detected
    if (!mouseClicked) return; // Skip if mousedown is not fired

    let x, y;

    if (e.type === "touchmove") {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }

    if (e.type === "mousemove") {
      x = e.clientX;
      y = e.clientY;
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
        x: null,
        y: null,
      };
    }

    if (swipeLeft) return moveTiles("left");
    else if (swipeRight) return moveTiles("right");
    else if (swipeUp) return moveTiles("up");
    else if (swipeDown) return moveTiles("down");
  }

  function handleTouchEnd(e) {
    e.preventDefault();
    swipeDetected = false;
    mouseClicked = false;

    touchstart.current = {
      x: null,
      y: null,
    };
  }

  return (
    <div className={styles.board} style={{ "--board-size": tilesPerRow }}>
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
