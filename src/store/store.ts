import { configureStore, Middleware } from "@reduxjs/toolkit";

// Reducers
import settingsReducer from "./../features/settingsSlice";
import boardReducer from "./../features/boardSlice";

// Middleware
import { localStorageMiddleware } from "../features/localStorageMiddleware";

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
