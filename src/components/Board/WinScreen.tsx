import { useEffect, useLayoutEffect, useRef, useState } from "react";

import Confetti from "react-confetti";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useElementSize } from "../../hooks/useElementSize";
import { useGameInputBlocked } from "../../hooks/useGameInputBlocked";

import {
  userCanContinue,
  userContinuedToPlay,
} from "../../features/boardSlice";
import { getTheme } from "../../features/settingsSlice";
import { Theme } from "../../types/types";

import styles from "./WinScreen.module.scss";

const YouWin = () => {
  const inputBlocked = useGameInputBlocked();
  const [winScreenElement, setWinScreenElement] =
    useState<HTMLDivElement | null>(null);
  const confettiSize = useElementSize(winScreenElement);

  const visibleTimeout = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitTimeout = useRef<ReturnType<typeof setInterval> | null>(null);

  const { waitAfterWin } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const theme = useAppSelector(getTheme);
  const [confettiPalette, setConfettiPalette] = useState<{
    theme: Theme;
    colors: string[];
  } | null>(null);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // App applies the theme class in a layout effect before we read its colors.
    const colors = getComputedStyle(document.body)
      .getPropertyValue("--confetti-colors")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    setConfettiPalette({ theme, colors });
  }, [theme]);

  useLayoutEffect(() => {
    // Fade In animation
    visibleTimeout.current = setTimeout(() => {
      setVisible(true);
    }, 50);

    // Wait timeout
    waitTimeout.current = setTimeout(() => {
      dispatch(userCanContinue());
    }, 2000);

    return () => {
      if (visibleTimeout.current) clearTimeout(visibleTimeout.current);
      if (waitTimeout.current) clearTimeout(waitTimeout.current);
    };
  }, []);

  const hideWinScreen = () => {
    if (!inputBlocked && !waitAfterWin) {
      dispatch(userContinuedToPlay());
    }
  };

  return (
    <div
      className={`${styles.youWin} ${visible ? styles.visible : ""}`}
      ref={setWinScreenElement}
      onClick={hideWinScreen}
      onTouchStart={hideWinScreen}
    >
      {confettiPalette?.theme === theme && confettiPalette.colors.length > 0 ? (
        <Confetti
          key={theme}
          {...confettiSize}
          colors={confettiPalette.colors}
          numberOfPieces={150}
          opacity={0.7}
          gravity={0.1}
        />
      ) : null}
      <h2 className={styles.title}>You win!</h2>
      <h3 className={`${styles.subtitle} ${waitAfterWin ? styles.hidden : ""}`}>
        Press any key to keep going
      </h3>
    </div>
  );
};

export default YouWin;
