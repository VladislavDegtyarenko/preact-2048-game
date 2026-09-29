import { useRef } from "react";

import SettingsModal from "../Settings/SettingsModal";
import ConfirmModal from "../ui/ConfirmModal";
import BestScoresModal from "./BestScoresModal";
import GameOverScreen from "./GameOverScreen";
import Grid from "./Grid";
import Tiles from "./Tiles";
import WinScreen from "./WinScreen";

import { useAppSelector } from "../../hooks/reduxHooks";

import { useBestScoresModal } from "../../contexts/BestScoresModalContext";
import { useGameConfirmation } from "../../contexts/GameConfirmationContext";

import styles from "./Board.module.scss";

const Board = () => {
  const { isOpen: bestScoresIsOpen } = useBestScoresModal();
  const { pendingAction, confirm, cancel } = useGameConfirmation();
  const boardRef = useRef<HTMLDivElement>(null);

  const settingsIsOpened = useAppSelector(
    (state) => state.settings.settingsIsOpened
  );
  const { showWinScreen, gameOver } = useAppSelector((state) => state.board);

  return (
    <div className={styles.board}>
      <div className={styles.boardInner} ref={boardRef}>
        <Grid />
        <Tiles />
      </div>
      {showWinScreen ? <WinScreen /> : null}
      {gameOver ? <GameOverScreen /> : null}
      {settingsIsOpened ? (
        <SettingsModal active={!pendingAction && !bestScoresIsOpen} />
      ) : null}
      {bestScoresIsOpen ? <BestScoresModal /> : null}
      {pendingAction ? (
        <ConfirmModal
          title={
            pendingAction.type === "new-game"
              ? "Start a new game?"
              : `Change board size to ${pendingAction.size}×${pendingAction.size}?`
          }
          message="Your current game progress and score will be lost."
          confirmLabel={
            pendingAction.type === "new-game" ? "Start new game" : "Change"
          }
          onConfirm={confirm}
          onCancel={cancel}
        />
      ) : null}
    </div>
  );
};

export default Board;
