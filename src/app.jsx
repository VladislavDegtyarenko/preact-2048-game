import { useState, useEffect, useRef, useContext } from "react";
import Header from "./components/Header";
import Board from "./components/Board/Board";
import styles from "./app.module.css";
import { ANIMATION_DURATION } from "./GameContext";
import GameContext from "./GameContext";
import { THEME } from "./GameContext";

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
  const {
    settings: { theme },
  } = useContext(GameContext);

  // Check if dark theme
  let isDarkTheme;

  switch (theme) {
    case THEME.LIGHT:
      isDarkTheme = false;
      break;
    case THEME.DARK:
      isDarkTheme = true;
      break;
    case THEME.SYSTEM:
      isDarkTheme =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      break;
    default:
      isDarkTheme = true;
  }

  isDarkTheme
    ? document.body?.classList.add("darkTheme")
    : document.body?.classList.remove("darkTheme");

  // Dynamic container width
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef();

  const containerWidthHandler = () => {
    setContainerWidth(containerRef?.current.clientWidth);
    // console.dir(containerRef?.current.clientWidth);
  };

  useEffect(() => {
    containerWidthHandler();

    window.addEventListener("resize", containerWidthHandler);

    return () => window.removeEventListener("resize", containerWidthHandler);
  }, []);
  return (
    <>
      <div
        className={`${styles.container}`}
        style={{
          "--transition-duration": ANIMATION_DURATION / 1000 + "s",
          "--container-width": containerWidth + "px",
        }}
        ref={containerRef}
      >
        <Header />
        <Board />
      </div>
    </>
  );
}
