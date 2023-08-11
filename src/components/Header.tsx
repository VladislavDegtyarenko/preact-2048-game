import { useContext, useState, useEffect } from "react";
import GameContext from "../GameContext";

import CountUp from "react-countup";
import ScoreLabel from "./ScoreLabel";
import Button from "./ui/Button";

import { MdUndo as UndoIcon } from "react-icons/md";
import { IoSettingsSharp as SettingsIcon } from "react-icons/io5";
import { HiRefresh as NewGameIcon } from "react-icons/hi";
import styles from "./Header.module.scss";

const Header = () => {
  const {
    score,
    bestScore,
    previousScore,
    actions: { startNewGame, undoAction },
    if: { noUndoActions },
    settings: { toggleSettingsModal },
  } = useContext(GameContext);

  const [previousBestScore, setPreviousBestScore] = useState(bestScore);
  const [currentBestScore, setCurrentBestScore] = useState(bestScore);

  useEffect(() => {
    setPreviousBestScore(currentBestScore);
    setCurrentBestScore(bestScore);
  }, [bestScore]);

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h1>2048</h1>
        <div className={styles.stats}>
          <ScoreLabel prevScore={previousScore} currScore={score} />
          <ScoreLabel prevScore={previousBestScore} currScore={currentBestScore} />
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
          <Button title="Undo last move" onClick={undoAction} disabled={noUndoActions}>
            <UndoIcon />
          </Button>
          <Button title="Open game settings" onClick={toggleSettingsModal}>
            <SettingsIcon />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
