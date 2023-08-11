import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { GameContextProvider } from "./GameContext";
import "./main.css";

const root = createRoot(document.getElementById("app") as HTMLElement);

root.render(
  <StrictMode>
    <GameContextProvider>
      <App />
    </GameContextProvider>
  </StrictMode>
);
