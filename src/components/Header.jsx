import { useContext, useState, useEffect, memo } from "react";
import GameContext from "../GameContext";

import CountUp from "react-countup";

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
    animateScore,
    ANIMATION_DURATION,
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

  const getScoreNumFontSizeCoeff = (num) => {
    if (num >= 1000000) return ".42em";
    else if (num >= 100000) return ".28em";
    else if (num >= 10000) return ".14em";
    else return "0em";
  };

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h1>2048</h1>
        <div className={styles.stats}>
          <h2 className={styles.scoreLabel}>
            <span className={styles.scoreHeading}>Score</span>
            <CountUp
              start={previousScore || 0}
              end={score}
              duration={animateScore ? ANIMATION_DURATION / 1000 : 0}
              className={styles.scoreNum}
              style={{ "--fontSizeReduceCoeff": getScoreNumFontSizeCoeff(score) }}
            />
          </h2>
          <h2 className={styles.scoreLabel}>
            <span className={styles.scoreHeading}>Best</span>
            <CountUp
              start={previousBestScore || 0}
              end={currentBestScore || 0}
              duration={animateScore ? ANIMATION_DURATION / 1000 : 0}
              className={styles.scoreNum}
              style={{
                "--fontSizeReduceCoeff": getScoreNumFontSizeCoeff(currentBestScore),
              }}
            />
          </h2>
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

export default memo(Header);
