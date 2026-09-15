import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import { App } from "./app";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { GameConfirmationProvider } from "./contexts/GameConfirmationContext";
import "./main.css";

const root = createRoot(document.getElementById("app") as HTMLElement);

root.render(
  <StrictMode>
    <Analytics />
    <Provider store={store}>
      <GameConfirmationProvider>
        <App />
      </GameConfirmationProvider>
    </Provider>
  </StrictMode>
);
