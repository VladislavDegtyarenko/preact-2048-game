// React
import { useRef, useState, useLayoutEffect } from "react";
import Confetti from "react-confetti";
import useConfettiSize from "../../hooks/useConfettiSize";

// Redux
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { userCanContinue, userContinuedToPlay } from "../../features/boardSlice";

// Styles
import styles from "./WinScreen.module.scss";

const YouWin = () => {
  const winScreenRef = useRef<HTMLDivElement>(null);
  const confettiSize = useConfettiSize(winScreenRef);

  const visibleTimeout = useRef<ReturnType<typeof setInterval> | null>(null);
  const waitTimeout = useRef<ReturnType<typeof setInterval> | null>(null);

  const { waitAfterWin } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();

  const [visible, setVisible] = useState(false);

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
    dispatch(userContinuedToPlay());
  };

  return (
    <div
      className={`${styles.youWin} ${visible ? styles.visible : ""}`}
      ref={winScreenRef}
      onClick={() => (!waitAfterWin ? hideWinScreen() : null)}
      onTouchStart={() => (!waitAfterWin ? hideWinScreen() : null)}
    >
      <Confetti
        {...confettiSize}
        numberOfPieces={150}
        opacity={0.7}
        gravity={0.1}
        // recycle={false}
      />
      <h2 className={styles.title}>You win!</h2>
      <h3 className={`${styles.subtitle} ${waitAfterWin ? styles.hidden : ""}`}>
        Press any key to keep going
      </h3>
    </div>
  );
};

export default YouWin;
