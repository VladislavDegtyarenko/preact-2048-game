import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { Provider } from "react-redux";
import { store } from "./store/store";
import GameConfirmationProvider from "./features/GameConfirmationProvider";
import "./main.css";

const root = createRoot(document.getElementById("app") as HTMLElement);

root.render(
  <StrictMode>
    <Provider store={store}>
      <GameConfirmationProvider>
        <App />
      </GameConfirmationProvider>
    </Provider>
  </StrictMode>
);
