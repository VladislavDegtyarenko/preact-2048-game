import { useEffect, useState } from "react";

import CountUp from "react-countup";

import { ANIMATION_DURATION } from "../utils/constants";

// Styles
import styles from "./ScoreLabel.module.scss";

// TS
import { CustomCountUpStyles } from "../types/types";

const ScoreLabel = ({ score }: { score: number }) => {
  const [prevScore, setPrevScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(score);

  useEffect(() => {
    setPrevScore(currentScore);
    setCurrentScore(score);
  }, [score]);

  const getScoreNumFontSizeCoeff = (num: number) => {
    if (num >= 1000000) return ".42em";
    else if (num >= 100000) return ".28em";
    else if (num >= 10000) return ".14em";
    else return "0em";
  };

  const countUpStyle = {
    "--fontSizeReduceCoeff": getScoreNumFontSizeCoeff(score),
  } as CustomCountUpStyles;

  return (
    <h2 className={styles.scoreLabel}>
      <span className={styles.scoreHeading}>Score</span>
      <CountUp
        start={prevScore || 0}
        end={currentScore}
        duration={ANIMATION_DURATION / 1000}
        className={styles.scoreNum}
        style={countUpStyle}
      />
    </h2>
  );
};

export default ScoreLabel;
