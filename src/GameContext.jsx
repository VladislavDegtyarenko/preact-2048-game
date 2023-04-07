import { createContext } from "react";
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";

const ANIMATION_TYPE = {
  OFF: 0,
  FAST: 150,
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
    // Restart the game first
    setTiles(null);

    // Then, apply new board size
    setSettings((prevSettings) => ({
      ...prevSettings,
      boardSize,
    }));
  };

  let tilesPerRow = settings?.boardSize && +settings.boardSize.slice(0, 1);

  // Save Settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("settings", JSON.stringify(settings));
    } catch (error) {
      console.error(error);
    }
  }, [settings]);

  // TILES

  const [tiles, setTiles] = useState(JSON.parse(localStorage.getItem("tiles")) || null);

  // const [tiles, setTiles] = useState([
  //   { top: 0, left: 0, value: 2, id: nanoid() },
  //   { top: 0, left: 1, value: 4, id: nanoid() },
  //   { top: 0, left: 2, value: 8, id: nanoid() },
  //   { top: 0, left: 3, value: 16, id: nanoid() },
  //   { top: 1, left: 3, value: 32, id: nanoid() },
  //   { top: 1, left: 2, value: 64, id: nanoid() },
  //   { top: 1, left: 1, value: 128, id: nanoid() },
  //   { top: 1, left: 0, value: 256, id: nanoid() },
  //   { top: 2, left: 0, value: 512, id: nanoid() },
  //   { top: 2, left: 1, value: 1024, id: nanoid() },
  //   { top: 2, left: 2, value: 2048, id: nanoid() },
  //   { top: 2, left: 3, value: 4096, id: nanoid() },
  //   { top: 3, left: 3, value: 8192, id: nanoid() },
  //   { top: 3, left: 2, value: 8192 * 2, id: nanoid() },
  // ]);

  // Array of arrays of previous tiles states
  // Used for undo action
  const previousTiles = useRef([]);

  // Game Score
  const score = useRef(+localStorage.getItem("score") || 0);
  const scoreToAdd = useRef(null);
  const scoreHistory = useRef([]); // for Undo action

  let bestScore = useRef(+localStorage.getItem("bestScore") || 0);

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
    localStorage.setItem("score", score.current);
  }, [score.current]);

  // Save best score to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bestScore", bestScore.current);
    } catch (error) {
      console.error(error);
    }
  }, [bestScore.current]);

  // Animate score boolean
  // True, when we've moved the tiles
  // False, when we undo move (disables score animation for undo)
  const animateScore = useRef(true);

  // We use this effect to add a new tile after each move and its re-render
  // Each move sets it to TRUE
  const [tilesWereMoved, setTilesWereMoved] = useState(false);

  // useEffect triggers when the tiles were moved
  useEffect(() => {
    if (tilesWereMoved) {
      animateScore.current = true;

      // Set new tile
      setTimeout(() => {
        setNewTile();
      }, ANIMATION_DURATION * 0.5);

      // Save new score
      tiles.forEach((tile) => {
        if (tile.toDouble) scoreToAdd.current += tile.value * 2;
      });

      // Save and update score at half of the animation time
      setTimeout(() => {
        scoreHistory.current.push(score.current);
        score.current += scoreToAdd.current;
        scoreToAdd.current = 0;

        if (score.current > bestScore.current) {
          bestScore.current = score.current;
        }
      }, ANIMATION_DURATION * 0.75);
    }
  }, [tilesWereMoved]);

  // Use this ref to prevent key events
  // While the tiles are moving
  const isAnimating = useRef(false);

  // Win Check
  const [win, setWin] = useState(false);
  const [waitAfterWin, setWaitAfterWin] = useState(true);
  const [showWinScreen, setShowWinScreen] = useState(false);

  const setUserWin = () => {
    setWin(true);
    setWaitAfterWin(true);
    setShowWinScreen(true);

    setTimeout(() => {
      setWaitAfterWin(false);
    }, 1500);
  };

  // Game Over Check
  const [gameOver, setGameOver] = useState(false);

  function isGameOver() {
    if (isAnimating.current) return false;

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
    setGameOver(isGameOver());
  }, [isAnimating.current, tiles]);

  /* ACTIONS */

  /* Start New Game */
  const startNewGame = () => {
    animateScore.current = false;
    score.current = 0;
    scoreToAdd.current = 0;
    scoreHistory.current = [];
    setTiles(null);
    setWin(false);
    // setWaitAfterWin(false);
    setShowWinScreen(false);
  };

  useEffect(() => {
    // Triggers setting two randon tiles
    if (tiles === null) {
      // new tiles array
      let newTiles = [];

      // first tile
      newTiles.push(getNewTile());

      // second tile
      const secondRandomTile = getNewTile(newTiles);

      newTiles.push(secondRandomTile);

      setTiles(newTiles);
    }
  }, [tiles]);

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
        id: nanoid(),
      };
    } while (
      currentTiles?.some((tile) => tile.top === newTile.top && tile.left === newTile.left)
    );

    return newTile;
  };

  const setNewTile = () => {
    setTiles((prevTiles) => {
      const newTile = getNewTile(prevTiles);
      return prevTiles ? [...prevTiles, newTile] : [newTile];
    });

    setTilesWereMoved(false);
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

  console.log("render");

  useEffect(() => {
    bindKbdControls();

    return () => cleanupKbdControls();
  }, [tiles, win, waitAfterWin, showWinScreen, settingsIsOpened, isGameOver]);

  function bindKbdControls() {
    document.body.addEventListener("keydown", keyboardControls, { once: true });
  }

  function cleanupKbdControls() {
    document.body.removeEventListener("keydown", keyboardControls, { once: true });
  }

  function keyboardControls(e) {
    // define main controls
    const arrowUpKey = e.key === "ArrowUp";
    const arrowDownKey = e.key === "ArrowDown";
    const arrowLeftKey = e.key === "ArrowLeft";
    const arrowRightKey = e.key === "ArrowRight";

    // bind keys for next move
    bindKbdControls();

    // if empty board, prevent arrow keys actions
    if (!tiles || tiles.length === 0) return;

    // Prevent key events while animating
    if (isAnimating.current) return;

    // Prevent keys when settings modal is opened
    if (settingsIsOpened) return;
    // console.log("settingsIsOpened: ", settingsIsOpened);

    if (win && showWinScreen) {
      // if (!arrowUpKey || !arrowDownKey || !arrowLeftKey || !arrowRightKey) return;
      if (waitAfterWin) return console.log("User is win. You should wait 3 seconds");
      else return setShowWinScreen(false);
    }

    // Prevent keys if game is over
    if (gameOver) return;

    if (win && waitAfterWin)
      if (win && !waitAfterWin)
        return console.log("User is win. You should wait 3 seconds");

    if (arrowUpKey) moveTiles("up");
    if (arrowDownKey) moveTiles("down");
    if (arrowLeftKey) moveTiles("left");
    if (arrowRightKey) moveTiles("right");

    // This prevents user to press any arrow key
    // For an ANIMATION_DURATION time
    // In other words, while tiles are moving
    isAnimating.current = true;
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

    setTiles((prevTiles) => {
      // Create a copy of the tiles array
      const newTiles = JSON.parse(JSON.stringify(prevTiles));

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
              currentTile.isMoved = true;
              continue;
            }

            // If there is a tile at the new position, and it has the same value as the current tile,
            // merge the tiles and double the value of the merged tile
            if (nextTile.value === currentTile.value && !nextTile.isMerged) {
              nextTile.isMerged = true;
              nextTile.isMoved = true;
              // nextTile.toDouble = true; // to double the value after re-render using useEffect
              nextTile.toTriggerDoubleAnimation = true;
              nextTile.value *= 2;

              // Check if win
              if (nextTile.value === 2048) setUserWin(true);

              currentTile.isMerged = true;
              // currentTile.toDelete = true;
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
      const noTilesIsMoved = !newTiles.some((tile) => tile.isMoved);
      // console.log("noTilesIsMoved: ", noTilesIsMoved);

      // Remove isMerged property so we don't need it in the end
      newTiles.forEach((tile) => {
        delete tile.isMerged;
      });

      // Remove isMoved property
      newTiles.forEach((tile) => {
        delete tile.isMoved;
      });

      // If no tiles were moved
      // Return the previous (initial) tiles state
      if (noTilesIsMoved) return [...prevTiles];

      // Otherwise,
      // Save current tiles position in Ref for Undo Action
      previousTiles.current.push(prevTiles);

      // Generate a new tile after re-render
      setTilesWereMoved(true);

      return newTiles;
    });
  };

  /* Special */
  const noUndoActions = previousTiles.current.length === 0;
  const previousScore =
    scoreHistory.current.length > 0
      ? scoreHistory.current[scoreHistory.current.length - 1]
      : null;

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
