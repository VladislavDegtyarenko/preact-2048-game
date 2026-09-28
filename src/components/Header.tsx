import { HiRefresh as NewGameIcon } from "react-icons/hi";
import { IoSettingsSharp as SettingsIcon } from "react-icons/io5";
import { MdUndo as UndoIcon } from "react-icons/md";

import ScoreLabel from "./ScoreLabel";
import Button from "./ui/Button";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { useBestScoresModal } from "../contexts/BestScoresModalContext";
import { useGameConfirmation } from "../contexts/GameConfirmationContext";
import { undoMove } from "../features/boardSlice";
import { settingsModalToggled } from "../features/settingsSlice";

import styles from "./Header.module.scss";

const Header = () => {
  const { open: openBestScores } = useBestScoresModal();
  const { requestNewGame } = useGameConfirmation();
  const { score, bestScore, previousScore } = useAppSelector(
    (state) => state.board
  );
  const boardSize = useAppSelector((state) => state.settings.boardSize);

  const dispatch = useAppDispatch();
  const noUndoActions = previousScore === null;

  const undo = () => {
    dispatch(undoMove());
  };

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h1>2048</h1>
        <div className={styles.stats}>
          <ScoreLabel score={score} label="Score" />
          <ScoreLabel
            score={bestScore[boardSize] ?? 0}
            label="Best"
            onClick={openBestScores}
          />
        </div>
      </div>
      <div className={styles.row}>
        <p>
          Join the tiles and get to the <strong>2048</strong> tile!
        </p>

        <div className={styles.controls}>
          <Button variant="secondary" title="New game" onClick={requestNewGame}>
            <NewGameIcon />
          </Button>
          <Button
            variant="secondary"
            title="Undo last move"
            onClick={undo}
            disabled={noUndoActions}
          >
            <UndoIcon />
          </Button>
          <Button
            variant="secondary"
            title="Open game settings"
            onClick={() => dispatch(settingsModalToggled())}
          >
            <SettingsIcon />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
