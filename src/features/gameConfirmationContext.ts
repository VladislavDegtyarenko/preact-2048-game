import { createContext } from "react";
import { BoardSize } from "../types/types";

export type PendingGameAction =
  | { type: "new-game" }
  | { type: "change-board-size"; size: BoardSize }
  | null;

type GameConfirmationValue = {
  pendingAction: PendingGameAction;
  requestNewGame: () => void;
  requestBoardSize: (size: BoardSize) => void;
  confirm: () => void;
  cancel: () => void;
};

export const GameConfirmationContext = createContext<GameConfirmationValue | null>(null);
