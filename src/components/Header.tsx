// Redux
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getBoardSize, settingsModalToggled } from "../features/settingsSlice";
import { newGameStarted, undoAction } from "../features/boardSlice";

// UI
import ScoreLabel from "./ScoreLabel";
import Button from "./ui/Button";

import { MdUndo as UndoIcon } from "react-icons/md";
import { IoSettingsSharp as SettingsIcon } from "react-icons/io5";
import { HiRefresh as NewGameIcon } from "react-icons/hi";

// Styles
import styles from "./Header.module.scss";

const Header = () => {
  const { score, bestScore, previousScore } = useAppSelector((state) => state.board);
  const boardSize = useAppSelector(getBoardSize);

  const dispatch = useAppDispatch();
  const noUndoActions = previousScore === null;

  const undo = () => {
    dispatch(undoAction());
  };

  const startNewGame = () => {
    dispatch(newGameStarted(boardSize));
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
          <Button title="New game" onClick={startNewGame}>
            <NewGameIcon />
          </Button>
          <Button title="Undo last move" onClick={undo} disabled={noUndoActions}>
            <UndoIcon />
          </Button>
          <Button
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
