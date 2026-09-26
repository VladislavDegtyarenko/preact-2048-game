import { Middleware, configureStore } from "@reduxjs/toolkit";

import { localStorageMiddleware } from "../features/localStorageMiddleware";
import boardReducer from "./../features/boardSlice";
import settingsReducer from "./../features/settingsSlice";

const middleware: Middleware[] = [localStorageMiddleware];

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    board: boardReducer,
  },
  middleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
