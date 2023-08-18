import { useRef, useLayoutEffect } from "react";

// Redux

import Header from "./components/Header";
import Board from "./components/Board/Board";
import styles from "./app.module.scss";

// TS
import { useAppDispatch, useAppSelector } from "./hooks/reduxHooks";
import useKeyboard from "./hooks/useKeyboard";
import useSwipes from "./hooks/useSwipes";
import useDynamicWidth from "./hooks/useDynamicWidth";
import { newGameStarted } from "./features/boardSlice";

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

export function App() {
  const { boardSize, theme } = useAppSelector((state) => state.settings);
  const { tiles, gameOver } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const { style } = useDynamicWidth(containerRef);
  useKeyboard();
  useSwipes(containerRef);

  useLayoutEffect(() => {
    if (!tiles || tiles.length === 0 || gameOver) {
      dispatch(newGameStarted(boardSize));
    }
  }, []);

  // Check if dark theme
  theme === "DARK"
    ? document.body?.classList.add("darkTheme")
    : document.body?.classList.remove("darkTheme");

  return (
    <>
      <div className={`${styles.container}`} style={style} ref={containerRef}>
        <Header />
        <Board />
      </div>
    </>
  );
}
