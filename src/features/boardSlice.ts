import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { BoardSize, BoardState, Direction, Tile, TileValue } from "../types/types";
import { cloneDeep } from "lodash";
import { nanoid } from "nanoid";
import { loadState } from "../utils/localStorage";

const initialState: BoardState = loadState("board") || {
  tiles: [],
  previousTiles: null,
  score: 0,
  previousScore: null,
  bestScore: 0,
  gameOver: false,
  win: false,
  waitAfterWin: false,
  showWinScreen: false,
};

const getNewTile = (currentTiles: Tile[], boardSize: BoardSize): Tile => {
  const getRandomPosition = () => {
    return Math.round(Math.random() * (boardSize - 1));
  };

  // Probabilities for
  // Tile 2 = 90%
  // Tile 4 = 10%
  const getRandomValue: () => TileValue = () => (Math.random() < 0.9 ? 2 : 4);

  let newTile: Tile;

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

const isGameOver = (tiles: Tile[], boardSize: BoardSize) => {
  if (!tiles || tiles.length === 0) return false;

  // If current algorithm haven't deleted the tiles
  // with the flag "toTrigger Delete Animation"
  // we're not showing Win Screen
  if (tiles.some((tile) => tile.toTriggerDeleteAnimation)) return false;

  // Check if there are any empty tiles left
  const emptyCells = tiles.length < boardSize * boardSize;
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
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    tilesMoved: (
      state,
      action: PayloadAction<{ direction: Direction; boardSize: BoardSize }>
    ) => {
      const { boardSize, direction } = action.payload;

      // if tilesPerRow = 4
      // keys = [0, 1, 2, 3]
      const keys = Array.from(Array(boardSize).keys());

      // Define the row and column traversal order based on the move direction
      let rowTraversal: number[], colTraversal: number[];

      if (direction === "left" || direction === "right") {
        rowTraversal = keys;
        colTraversal = direction === "left" ? keys : keys.reverse();
      } else {
        rowTraversal = direction === "up" ? keys : keys.reverse();
        colTraversal = keys;
      }

      // Boolean to check if at least one tile is moved
      let tilesMoved = false;

      // Sum of the score to add to the current score
      let scoreToAdd = 0;

      // Create a deep copy of the tiles array
      const newTiles = cloneDeep(state.tiles);

      // Traverse the board in the row and column order
      for (let row of rowTraversal) {
        for (let col of colTraversal) {
          // Find the tile at the current row and column
          let currentTile = newTiles.find(
            (tile) => tile.top === row && tile.left === col
          );

          // if no tile in this cell, skip this iteration
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
            if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) {
              break;
            }

            // Find if another tile exists at new row and col position
            let nextTile = newTiles.find(
              (tile) => tile.top === newRow && tile.left === newCol
            );

            // If there is no tile at the new position,
            // move the current tile to that new position
            if (!nextTile) {
              currentTile.top = newRow;
              currentTile.left = newCol;
              tilesMoved = true;
              continue;
            }

            // If there is a tile at the new position,
            // and it has the same value as the current tile,
            // merge the tiles by deleting one tile
            // and doubling the value of another tile
            if (nextTile.value === currentTile.value && !nextTile.isMerged) {
              nextTile.isMerged = true;
              tilesMoved = true;

              // nextTile.toTriggerDoubleAnimation = true;
              nextTile.value *= 2;

              // add current tile value to scoreToAdd
              scoreToAdd += nextTile.value;

              // Check if win
              const winTile = nextTile.value === 2048;
              if (winTile && !state.win) {
                state.win = true;
                state.showWinScreen = true;
                state.waitAfterWin = true;
              }

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
      // And break the further execution
      if (noTilesIsMoved) {
        return;
      }

      // Otherwise,
      // Save current tiles position in Ref for Undo Action
      state.previousTiles = state.tiles;

      // Switch isAnimating flag to true
      // to block multiple keyboard presses
      // isAnimating.current = true;

      // Tell to animate score increase
      // animateScore.current = true;

      // Set new random tile
      const newTile = getNewTile(newTiles, boardSize);
      newTiles.push(newTile);

      // Save and update score
      state.previousScore = state.score;
      state.score += scoreToAdd;

      if (state.score > state.bestScore) {
        state.bestScore = state.score;
      }

      state.tiles = newTiles;

      // Check for game over
      state.gameOver = isGameOver(newTiles, boardSize);
    },
    tileDeleted: (state, action: PayloadAction<{ id: string; boardSize: BoardSize }>) => {
      const { id, boardSize } = action.payload;
      const newTiles = state.tiles.filter((tile) => tile.id !== id);
      state.tiles = newTiles;
      state.gameOver = isGameOver(newTiles, boardSize);

      state.previousTiles =
        state.previousTiles?.filter((tile) => !tile.toTriggerDeleteAnimation) ?? null;
    },
    clearDoubleAnimationFlag: (state, action: PayloadAction<string>) => {
      const tileId = action.payload;

      state.tiles.forEach((tile) => {
        if (tile.id === tileId) {
          delete tile.toTriggerDoubleAnimation;
        }
      });
    },
    userCanContinue: (state) => {
      state.waitAfterWin = false;
    },
    userContinuedToPlay: (state) => {
      state.showWinScreen = false;
    },
    newGameStarted: (state, action: PayloadAction<BoardSize>) => {
      state.score = 0;
      state.previousScore = null;
      state.win = false;
      state.waitAfterWin = false;
      state.showWinScreen = false;

      state.previousTiles = null;

      // Undo game over state
      state.gameOver = false;

      const boardSize = action.payload;
      const newTiles: Tile[] = [];

      const firstTile = getNewTile(newTiles, boardSize);
      newTiles.push(firstTile);

      const secondTile = getNewTile(newTiles, boardSize);
      newTiles.push(secondTile);

      state.tiles = newTiles;
    },
    undoAction: (state) => {
      if (state.previousScore !== null && state.previousTiles) {
        state.score = state.previousScore;
        state.previousScore = null;

        state.tiles = state.previousTiles;
        state.previousTiles = null;

        // Edge cases:
        // If user win and he see a win screen
        // undo win state and hide win screen
        if (state.win && state.showWinScreen) {
          state.win = false;
          state.showWinScreen = false;
          state.waitAfterWin = false;
        }
        // Undo game over state
        state.gameOver = false;
      }
    },
  },
});

export const getTiles = (state: RootState) => state.board.tiles;
export const getGameOver = (state: RootState) => state.board.gameOver;

export const {
  tilesMoved,
  clearDoubleAnimationFlag,
  tileDeleted,
  userCanContinue,
  userContinuedToPlay,
  newGameStarted,
  undoAction,
} = boardSlice.actions;

export default boardSlice.reducer;
