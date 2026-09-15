import { ReactNode, useRef, useState } from "react";
import { newGameStarted } from "./boardSlice";
import { boardSizeChanged } from "./settingsSlice";
import { GameConfirmationContext, PendingGameAction } from "./gameConfirmationContext";
import { BoardSize } from "../types/types";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

/** Shares one pending confirmation across game controls without saving it. */
const GameConfirmationProvider = ({ children }: { children: ReactNode }) => {
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

export default GameConfirmationProvider;
