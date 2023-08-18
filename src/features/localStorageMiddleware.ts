import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { saveState } from "../utils/localStorage";

// Middleware to persist state to localStorage
export const localStorageMiddleware: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);
    const {
      settings: { boardSize, theme },
      board,
    } = store.getState();
    saveState("settings", { boardSize, theme });
    saveState("board", board);
    return result;
  };
