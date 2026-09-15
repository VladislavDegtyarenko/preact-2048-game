// Redux
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { useGameConfirmation } from "../contexts/GameConfirmationContext";
import { settingsModalToggled } from "../features/settingsSlice";
import { undoAction } from "../features/boardSlice";

// UI
import ScoreLabel from "./ScoreLabel";
import Button from "./ui/Button";

import { MdUndo as UndoIcon } from "react-icons/md";
import { IoSettingsSharp as SettingsIcon } from "react-icons/io5";
import { HiRefresh as NewGameIcon } from "react-icons/hi";

// Styles
import styles from "./Header.module.scss";

const Header = () => {
  const { requestNewGame } = useGameConfirmation();
  const { score, bestScore, previousScore } = useAppSelector((state) => state.board);

  const dispatch = useAppDispatch();
  const noUndoActions = previousScore === null;

  const undo = () => {
    dispatch(undoAction());
  };

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h1>2048</h1>
        <div className={styles.stats}>
          <ScoreLabel score={score} />
          <ScoreLabel score={bestScore} />
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
