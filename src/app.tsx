import { useState, useRef, useContext, useLayoutEffect } from "react";
import Header from "./components/Header";
import Board from "./components/Board/Board";
import styles from "./app.module.css";
import { ANIMATION_DURATION } from "./GameContext";
import GameContext from "./GameContext";
import { debounce } from "lodash";

// TS
import { CustomCSSVariables, Theme } from "./types/types";

/* TODO:
- Share score to Facebook/Twiiter
- optimize keyboard events
- react-spring or react-transition-group

Settings: 
- animations: off, fast, normal, slow
- Odd or Even Numbers select menu (convert tiles from 2,4,8 to Tile-Tier-1, etc.)
- Reset score
- Animations?
- Dark mode tile glow effect
*/

/* 
DONE:
- style the components, layout, tiles
- render tiles from an array4
- tile generating function
- add probability to render 4 num tile of 10% (90% - Tile 2, 10% - Tile 4)
- ability to sum tiles
- add animation for tile appear
- disable continious pressing / state to check if the tiles are moving
- move controls
- undo action
- Enable/Disable Undo
- count score
- animation for adding score
- Start game with two random tiles
- add responsiveness
- add swipes
- Add Win screen
- Save score to localStorage
- Save current game state to localStorage
- Game Over / Best Score screen

Settings: 
- board size
- Dark/Light Mode




*/

const MIN_CONTAINER_WIDTH = 360,
  MAX_CONTAINER_WIDTH = 480;

export function App() {
  const {
    tilesPerRow,
    settings: { theme },
  } = useContext(GameContext);

  // Check if dark theme
  let isDarkTheme;

  switch (theme) {
    case Theme.LIGHT:
      isDarkTheme = false;
      break;
    case Theme.DARK:
      isDarkTheme = true;
      break;
    // case Theme.SYSTEM:
    //   isDarkTheme =
    //     window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    //   break;
    default:
      isDarkTheme = true;
  }

  isDarkTheme
    ? document.body?.classList.add("darkTheme")
    : document.body?.classList.remove("darkTheme");

  // Dynamic container width
  const [containerWidth, setContainerWidth] = useState(MAX_CONTAINER_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerWidthHandler = () => {
    setContainerWidth((prevWidth) => {
      const viewportWidth = document.body.clientWidth;

      if (!containerRef.current) return prevWidth;

      if (viewportWidth < MIN_CONTAINER_WIDTH) return MIN_CONTAINER_WIDTH;
      else if (viewportWidth > MAX_CONTAINER_WIDTH) return MAX_CONTAINER_WIDTH;
      else return Math.floor(viewportWidth);
    });
  };

  const debounceContainerWidthHandler = debounce(containerWidthHandler, 150);

  useLayoutEffect(() => {
    containerWidthHandler();

    window.addEventListener("resize", debounceContainerWidthHandler);

    return () => window.removeEventListener("resize", debounceContainerWidthHandler);
  }, []);

  const OUTER_MARGIN = 16;
  const BOARD_PADDING = 16;

  const boardWidth = containerWidth - OUTER_MARGIN * 2 - BOARD_PADDING; // board size without padding
  const cellSize = (boardWidth / tilesPerRow) * 0.94;
  const cellGap = (boardWidth - cellSize * tilesPerRow) / (tilesPerRow - 1);

  const style: CustomCSSVariables = {
    "--transition-duration": ANIMATION_DURATION / 1000 + "s",
    "--container-width": containerWidth + "px",
    "--outer-margin": OUTER_MARGIN + "px",
    "--tiles-per-row": tilesPerRow,
    "--board-padding": BOARD_PADDING + "px",
    "--cell-size": cellSize.toFixed(1) + "px",
    "--cell-gap": cellGap.toFixed(1) + "px",
  };

  return (
    <>
      <div className={`${styles.container}`} style={style} ref={containerRef}>
        <Header />
        <Board />
      </div>
    </>
  );
}
