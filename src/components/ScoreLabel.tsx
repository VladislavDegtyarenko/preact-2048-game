import { useEffect, useState, type CSSProperties } from "react";

import CountUp from "react-countup";

import { ANIMATION_DURATION } from "../constants";

import styles from "./ScoreLabel.module.scss";

type CustomCountUpStyles = CSSProperties & {
  "--fontSizeReduceCoeff": string;
};

type Props = { score: number; label: string; onClick?: () => void };

const ScoreLabel = ({ score, label, onClick }: Props) => {
  const [prevScore, setPrevScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(score);

  useEffect(() => {
    setPrevScore(currentScore);
    setCurrentScore(score);
  }, [score]);

  const getScoreNumFontSizeCoeff = (score: number) => {
    if (score >= 1_000_000) return ".42em";
    else if (score >= 100_000) return ".28em";
    else if (score >= 10_000) return ".14em";
    else return "0em";
  };

  const countUpStyle = {
    "--fontSizeReduceCoeff": getScoreNumFontSizeCoeff(score),
  } as CustomCountUpStyles;

  const content = (
    <>
      <span className={styles.scoreHeading}>{label}</span>
      <CountUp
        start={prevScore || 0}
        end={currentScore}
        duration={ANIMATION_DURATION / 1000}
        className={styles.scoreNum}
        style={countUpStyle}
      />
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={`${styles.scoreLabel} ${styles.button}`}
        aria-haspopup="dialog"
        title="View best scores"
        onClick={(event) => {
          event.currentTarget.focus();
          onClick();
        }}
      >
        {content}
      </button>
    );
  }

  return <h2 className={styles.scoreLabel}>{content}</h2>;
};

export default ScoreLabel;
