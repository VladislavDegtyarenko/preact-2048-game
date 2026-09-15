import { createContext, type PropsWithChildren, useContext, useRef, useState } from "react";
import { newGameStarted } from "../features/boardSlice";
import { boardSizeChanged } from "../features/settingsSlice";
import { type BoardSize } from "../types/types";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

type PendingGameAction =
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

const GameConfirmationContext = createContext<GameConfirmationValue | null>(null);

type Props = PropsWithChildren;

/** Shares one pending confirmation across game controls without saving it. */
export const GameConfirmationProvider = ({ children }: Props) => {
  const [pendingAction, setPendingAction] = useState<PendingGameAction>(null);
  const pendingRef = useRef<PendingGameAction>(null);
  const hasMoved = useAppSelector((state) => state.board.hasMoved);
  const boardSize = useAppSelector((state) => state.settings.boardSize);
  const dispatch = useAppDispatch();

  const execute = (action: NonNullable<PendingGameAction>) => {
    const size = action.type === "change-board-size" ? action.size : boardSize;
    if (action.type === "change-board-size") {
      dispatch(boardSizeChanged(size));
    }

    dispatch(newGameStarted(size));
  };

  const request = (action: NonNullable<PendingGameAction>) => {
    if (pendingRef.current ||
      (action.type === "change-board-size" && action.size === boardSize)) {
      return;
    }

    if (!hasMoved) {
      execute(action);
      return;
    }

    pendingRef.current = action;
    setPendingAction(action);
  };

  const cancel = () => {
    pendingRef.current = null;
    setPendingAction(null);
  };

  const confirm = () => {
    if (pendingRef.current) {
      execute(pendingRef.current);
      cancel();
    }
  };

  return (
    <GameConfirmationContext.Provider value={{
      pendingAction,
      requestNewGame: () => request({ type: "new-game" }),
      requestBoardSize: (size: BoardSize) => request({ type: "change-board-size", size }),
      confirm,
      cancel,
    }}>
      {children}
    </GameConfirmationContext.Provider>
  );
};

/** Reads the shared game confirmation state and request handlers. */
export const useGameConfirmation = () => {
  const confirmation = useContext(GameConfirmationContext);
  if (!confirmation) {
    throw new Error("useGameConfirmation must be used inside GameConfirmationProvider.");
  }

  return confirmation;
};
