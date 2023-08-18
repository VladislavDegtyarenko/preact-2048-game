import { createSlice, Middleware, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";
import { BoardSize, Settings, Theme } from "../types/types";

import { loadState, saveState } from "../utils/localStorage";

// Load state from localStorage if available
const initialState: Settings = loadState("settings") || {
  theme: "DARK",
  boardSize: 4,
  settingsIsOpened: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    settingsModalToggled: (state, action: PayloadAction<boolean | undefined>) => {
      state.settingsIsOpened =
        typeof action?.payload === "boolean" ? action.payload : !state.settingsIsOpened;
    },
    boardSizeChanged: (state, action: PayloadAction<BoardSize>) => {
      const boardSize = action.payload;
      state.boardSize = boardSize;
    },
    themeChanged: (state, action: PayloadAction<Theme>) => {
      const theme = action.payload;
      state.theme = theme;
    },
  },
});

export const { settingsModalToggled, boardSizeChanged, themeChanged } =
  settingsSlice.actions;

export const getBoardSize = (state: RootState) => state.settings.boardSize;
export const getTheme = (state: RootState) => state.settings.theme;
export const getSettingsIsOpened = (state: RootState) => state.settings.settingsIsOpened;

export default settingsSlice.reducer;
