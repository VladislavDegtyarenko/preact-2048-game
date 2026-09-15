import { useRef } from "react";
// Redux
import { useAppSelector } from "../../hooks/reduxHooks";

// UI
import Grid from "./Grid";
import styles from "./Board.module.scss";
import Tiles from "./Tiles";
import WinScreen from "./WinScreen";
import GameOverScreen from "./GameOverScreen";
import Settings from "../Settings/Settings";
import ConfirmDialog from "../ui/ConfirmDialog";
import useGameConfirmation from "../../hooks/useGameConfirmation";

const Board = () => {
  const { pendingAction, confirm, cancel } = useGameConfirmation();
  const boardRef = useRef<HTMLDivElement>(null);

  const settingsIsOpened = useAppSelector((state) => state.settings.settingsIsOpened);
  const { showWinScreen, gameOver } = useAppSelector((state) => state.board);

  return (
    <div className={styles.board}>
      <div className={styles.boardInner} ref={boardRef}>
        <Grid />
        <Tiles />
      </div>
      {showWinScreen ? (
        <WinScreen isBlocked={Boolean(pendingAction) || settingsIsOpened} />
      ) : null}
      {gameOver ? <GameOverScreen /> : null}
      {settingsIsOpened ? (
        <Settings active={!pendingAction} />
      ) : null}
      {pendingAction ? (
        <ConfirmDialog
          title={pendingAction.type === "new-game"
            ? "Start a new game?"
            : `Change board size to ${pendingAction.size}×${pendingAction.size}?`}
          message="Your current game progress and score will be lost."
          confirmLabel={pendingAction.type === "new-game"
            ? "Start new game"
            : "Change"}
          onConfirm={confirm}
          onCancel={cancel}
        />
      ) : null}
    </div>
  );
};

export default Board;
