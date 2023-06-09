import { createRoot } from "react-dom/client";
import { App } from "./app";
import { GameContextProvider } from "./GameContext";
import "./main.css";

const root = createRoot(document.getElementById("app"));

root.render(
  <GameContextProvider>
    <App />
  </GameContextProvider>
);
