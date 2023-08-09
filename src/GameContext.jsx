import { createContext, useCallback, useMemo } from "react";
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";

const ANIMATION_TYPE = {
  OFF: 0,
  FAST: 125,
  NORMAL: 200,
  SLOW: 300,
};

export const THEME = {
  DARK: "Elegant Dark",
  LIGHT: "Classic Light",
  // SYSTEM: "System Preffered",
};

const DEFAULT_THEME = THEME.DARK;

export const BOARD_SIZE = {
  S: "3x3",
  M: "4x4",
  L: "5x5",
  XL: "6x6",
};

const DEFAULT_SETTINGS = {
  theme: DEFAULT_THEME,
  boardSize: BOARD_SIZE.M,
  // animations: null,
  // mode: null, // classic, odd
};

export const ANIMATION_DURATION = ANIMATION_TYPE.NORMAL; // in ms

const GameContext = createContext();

export const GameContextProvider = ({ children }) => {
  /* SETTINGS */
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("settings")) || DEFAULT_SETTINGS
  );

  const [settingsIsOpened, setSettingsIsOpened] = useState(false);

  const toggleSettingsModal = () => {
    setSettingsIsOpened((s) => !s);
  };

  const setTheme = (theme) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      theme,
    }));
  };

  const setBoardSize = (boardSize) => {
    // Reset score
    animateScore.current = false;
    score.current = 0;
    scoreToAdd.current = 0;
    scoreHistory.current = [];

    // Reset win state
    setWin(false);
    setWaitAfterWin(false);
    setShowWinScreen(false);

    // Restart the game first
    setTiles([]);

    // Then, apply new board size
    setSettings((prevSettings) => ({
      ...prevSettings,
      boardSize,
    }));
  };

  let tilesPerRow = settings?.boardSize && +settings.boardSize.slice(0, 1);

  // TILES
  const [tiles, setTiles] = useState(() => {
    try {
      const savedTiles = localStorage.getItem("tiles");

      return savedTiles ? JSON.parse(savedTiles) : [];
    } catch (error) {
      console.warn("No tiles found in localStorage", error);
    }
  });

  // Array of arrays of previous tiles states
  // Used for undo action
  const previousTiles = useRef([]);

  // Game Score
  const score = useRef(+localStorage.getItem("score") || 0);
  const scoreToAdd = useRef(null);
  const scoreHistory = useRef([]); // for Undo action

  let bestScore = useRef(+localStorage.getItem("bestScore") || 0);

  // Animate score boolean
  // True, when we've moved the tiles
  // False, when we undo move (disables score animation for undo)
  const animateScore = useRef(true);

  // Use this ref to prevent key events
  // While the tiles are animating/moving
  const isAnimating = useRef(false);

  // Win Check
  const [win, setWin] = useState(false);
  const [waitAfterWin, setWaitAfterWin] = useState(true);
  const [showWinScreen, setShowWinScreen] = useState(false);

  const setUserWin = () => {
    if (win) return;

    setWin(true);
    setWaitAfterWin(true);
    setShowWinScreen(true);

    setTimeout(() => {
      setWaitAfterWin(false);
    }, 3000);
  };

  // Game Over Check
  const [gameOver, setGameOver] = useState(false);

  function isGameOver() {
    if (!tiles) return false;

    // Check if there are any empty tiles left
    const emptyCells = tiles.length < tilesPerRow * tilesPerRow;
    if (emptyCells) {
      return false;
    }

    // Check if there are any adjacent tiles with the same value
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const right = tiles.find((t) => t.top === tile.top && t.left === tile.left + 1);
      const left = tiles.find((t) => t.top === tile.top && t.left === tile.left - 1);
      const down = tiles.find((t) => t.top === tile.top + 1 && t.left === tile.left);
      const up = tiles.find((t) => t.top === tile.top - 1 && t.left === tile.left);

      if (right && right.value === tile.value) {
        return false;
      }
      if (left && left.value === tile.value) {
        return false;
      }
      if (down && down.value === tile.value) {
        return false;
      }
      if (up && up.value === tile.value) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    if (isAnimating.current) return;

    // Start a new game if board is empty
    if (tiles.length === 0) {
      // new tiles array
      let newTiles = [];

      // first tile
      newTiles.push(getNewTile());

      // second tile
      const secondRandomTile = getNewTile(newTiles);

      newTiles.push(secondRandomTile);

      setTiles(newTiles);
    }

    // Game Over Check
    setGameOver(isGameOver());
  }, [isAnimating.current, tiles]);

  /* ACTIONS */

  /* Start New Game */
  const startNewGame = () => {
    animateScore.current = false;
    score.current = 0;
    scoreToAdd.current = 0;
    scoreHistory.current = [];
    setTiles([]);
    setWin(false);
    setWaitAfterWin(false);
    setShowWinScreen(false);
  };

  /* Generate New Tile */

  const getNewTile = (currentTiles) => {
    const getRandomPosition = () => {
      return Math.round(Math.random() * (tilesPerRow - 1));
    };

    // Probabilities for
    // Tile 2 = 90%
    // Tile 4 = 10%
    const getRandomValue = () => (Math.random() < 0.9 ? 2 : 4);

    let newTile;

    do {
      newTile = {
        value: getRandomValue(),
        top: getRandomPosition(),
        left: getRandomPosition(),
        id: nanoid(4),
      };
    } while (
      currentTiles?.some((tile) => tile.top === newTile.top && tile.left === newTile.left)
    );

    return newTile;
  };

  /* Undo Action */
  const undoAction = () => {
    animateScore.current = false;

    // Restore previous score
    if (scoreHistory.current.length === 0) return console.log("No score history");
    score.current = scoreHistory.current[scoreHistory.current.length - 1];
    scoreHistory.current.pop();

    // Restore previous tiles
    if (previousTiles.current.length === 0) return console.log("No undo actions");
    setTiles(previousTiles.current[previousTiles.current.length - 1]);
    previousTiles.current.pop();
  };

  /* GAME KEYBOARD CONTROLS */

  useEffect(() => {
    document.body.addEventListener("keydown", keyboardControls);

    return () => document.body.removeEventListener("keydown", keyboardControls);
  });

  function keyboardControls(e) {
    // define main controls
    const arrowUpKey = e.key === "ArrowUp";
    const arrowDownKey = e.key === "ArrowDown";
    const arrowLeftKey = e.key === "ArrowLeft";
    const arrowRightKey = e.key === "ArrowRight";

    // prevent arrow keys actions
    // if empty board,
    // while animating,
    // when settings modal is opened,
    if (tiles.length === 0 || isAnimating.current || settingsIsOpened) return;

    // keys behaviour when the win screen is shown
    if (win && showWinScreen) {
      if (!waitAfterWin) setShowWinScreen(false);
      return;
    }

    // if (e.ctrlKey && e.keyCode === 90) undoAction();

    // prevent arrow keys actions if game is over
    if (gameOver) return;

    if (arrowUpKey) moveTiles("up");
    if (arrowDownKey) moveTiles("down");
    if (arrowLeftKey) moveTiles("left");
    if (arrowRightKey) moveTiles("right");

    // This prevents user to press any arrow key
    // For an ANIMATION_DURATION time
    // In other words, while tiles are moving
    // isAnimating.current = true;
    setTimeout(() => {
      isAnimating.current = false;
    }, ANIMATION_DURATION);
  }

  /* Move Tiles Function */

  const moveTiles = (direction) => {
    // if tilesPerRow = 4
    // keys = [0, 1, 2, 3]
    const keys = Array.from(Array(tilesPerRow).keys());

    // Define the row and column traversal order based on the move direction
    let rowTraversal, colTraversal;

    if (direction === "left" || direction === "right") {
      rowTraversal = keys;
      colTraversal = direction === "left" ? keys : keys.reverse();
    } else {
      rowTraversal = direction === "up" ? keys : keys.reverse();
      colTraversal = keys;
    }

    let tilesMoved = false; // Boolean to check if at least one tile is moved

    setTiles((prevTiles) => {
      // Create a deep copy of the tiles array
      // const newTiles = JSON.parse(JSON.stringify(prevTiles));
      const newTiles = cloneDeep(prevTiles);

      // Traverse the board in the row and column order
      for (let row of rowTraversal) {
        for (let col of colTraversal) {
          // Find the tile at the current row and column
          let currentTile = newTiles.find(
            (tile) => tile.top === row && tile.left === col
          );
          if (!currentTile) continue;

          // Calculate the new row and column for the tile based on the move direction
          let newRow = row;
          let newCol = col;

          while (true) {
            if (direction === "left") newCol--;
            if (direction === "right") newCol++;
            if (direction === "up") newRow--;
            if (direction === "down") newRow++;

            // Check if the new row and column are within the board boundaries
            if (
              newRow < 0 ||
              newRow >= tilesPerRow ||
              newCol < 0 ||
              newCol >= tilesPerRow
            ) {
              break;
            }

            // Find the tile at the new row and column, if any
            let nextTile = newTiles.find(
              (tile) => tile.top === newRow && tile.left === newCol
            );

            // If there is no tile at the new position, move the current tile to the new position
            if (!nextTile) {
              currentTile.top = newRow;
              currentTile.left = newCol;
              tilesMoved = true;
              continue;
            }

            // If there is a tile at the new position, and it has the same value as the current tile,
            // merge the tiles and double the value of the merged tile
            if (nextTile.value === currentTile.value && !nextTile.isMerged) {
              nextTile.isMerged = true;
              tilesMoved = true;

              nextTile.toTriggerDoubleAnimation = true;
              nextTile.value *= 2;

              // add current tile value to scoreToAdd
              scoreToAdd.current += nextTile.value;

              // Check if win
              const winTile = nextTile.value === 2048;
              if (winTile) setUserWin();

              currentTile.isMerged = true;

              currentTile.top = newRow;
              currentTile.left = newCol;

              // Remove the merged tile from the new position
              currentTile.toTriggerDeleteAnimation = true;
            }
            break;
          }
        }
      }

      // Check if no tiles were moved
      let noTilesIsMoved = !tilesMoved;

      // Remove isMerged property so we don't need it in the end
      newTiles.forEach((tile) => {
        delete tile.isMerged;
      });

      // If no tiles were moved
      // Return the previous (initial) tiles state
      if (noTilesIsMoved) return prevTiles;

      // Otherwise,
      // Save current tiles position in Ref for Undo Action
      previousTiles.current.push(prevTiles);

      // Switch isAnimating flag to true
      // to block multiple keyboard presses
      isAnimating.current = true;

      // Set new random tile
      const newTile = getNewTile(newTiles);
      newTiles.push(newTile);

      // Tell to animate score increase
      animateScore.current = true;

      // Save and update score
      scoreHistory.current.push(score.current);
      score.current += scoreToAdd.current;
      scoreToAdd.current = 0;

      if (score.current > bestScore.current) {
        bestScore.current = score.current;
      }

      return newTiles;
    });
  };

  /* Special */
  const noUndoActions = previousTiles.current.length === 0;
  const previousScore =
    scoreHistory.current.length > 0
      ? scoreHistory.current[scoreHistory.current.length - 1]
      : null;

  /* LOCAL STORAGE */

  // Save current tiles
  useEffect(() => {
    try {
      localStorage.setItem("tiles", JSON.stringify(tiles));
    } catch (error) {
      console.error(error);
    }
  }, [tiles]);

  // Save current progress score
  useEffect(() => {
    try {
      localStorage.setItem("score", score.current);
    } catch (error) {
      console.error(error);
    }
  }, [score.current]);

  // Save best score to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bestScore", bestScore.current);
    } catch (error) {
      console.error(error);
    }
  }, [bestScore.current]);

  // Save win state in localStorage.
  // We use this in the following scenario:
  // if the game is won, user refreshes the page and continues to play,
  // and then when the user reaches another 2048 tile,
  // we don't show the winning screen again
  useEffect(() => {
    try {
      localStorage.setItem("win", JSON.stringify(win));
    } catch (error) {
      console.error(error);
    }
  }, [win]);

  // Save Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error(error);
    }
  }, [settings]);

  /* Main Game Context Object */

  const game = {
    tiles,
    tilesPerRow,
    score: score.current,
    bestScore: bestScore.current,
    gameOver,
    previousScore,
    ANIMATION_DURATION,
    animateScore: animateScore.current,
    actions: {
      startNewGame,
      setTiles,
      moveTiles,
      undoAction,
    },
    if: {
      noUndoActions,
      win,
      showWinScreen,
      setShowWinScreen,
      waitAfterWin,
    },
    settings: {
      ...settings,
      settingsIsOpened,
      toggleSettingsModal,
      setTheme,
      setBoardSize,
    },
  };

  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
};

export default GameContext;
