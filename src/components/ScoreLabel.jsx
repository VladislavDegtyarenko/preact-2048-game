import { useContext, useMemo, useState } from "react";
import GameContext from "../GameContext";

import CountUp from "react-countup";

import styles from "./ScoreLabel.module.scss";

const ScoreLabel = ({ prevScore, currScore }) => {
  const { animateScore, ANIMATION_DURATION } = useContext(GameContext);

  const getScoreNumFontSizeCoeff = (num) => {
    if (num >= 1000000) return ".42em";
    else if (num >= 100000) return ".28em";
    else if (num >= 10000) return ".14em";
    else return "0em";
  };

  return (
    <h2 className={styles.scoreLabel}>
      <span className={styles.scoreHeading}>Score</span>
      <CountUp
        start={prevScore || 0}
        end={currScore}
        duration={animateScore ? ANIMATION_DURATION / 1000 : 0}
        className={styles.scoreNum}
        style={{ "--fontSizeReduceCoeff": getScoreNumFontSizeCoeff(currScore) }}
      />
    </h2>
  );
};

export default ScoreLabel;
