import { useContext, useRef, useState, useLayoutEffect } from "react";
import GameContext from "../../GameContext";
import Confetti from "react-confetti";
import styles from "./WinScreen.module.scss";
import { debounce } from "lodash";

const YouWin = () => {
  const {
    if: { win, waitAfterWin, showWinScreen, setShowWinScreen },
  } = useContext(GameContext);

  const winScreenRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Fade In animation
  setTimeout(() => {
    setVisible(win && showWinScreen);
  }, 200);

  // Handle Confetti Size
  const [confettiSize, setConfettiSize] = useState({
    width: 0,
    height: 0,
  });

  const resizeConfetti = () => {
    if (!winScreenRef.current) return;

    setConfettiSize({
      width: winScreenRef.current.clientWidth,
      height: winScreenRef.current.clientHeight,
    });
  };

  const debounceResizeConfetti = debounce(resizeConfetti, 150);

  useLayoutEffect(() => {
    resizeConfetti();

    window.addEventListener("resize", debounceResizeConfetti);

    return () => window.removeEventListener("resize", debounceResizeConfetti);
  }, []);

  return (
    <div
      className={`${styles.youWin} ${visible ? styles.visible : ""}`}
      ref={winScreenRef}
      onClick={() => (!waitAfterWin ? setShowWinScreen(false) : null)}
      onTouchStart={() => (!waitAfterWin ? setShowWinScreen(false) : null)}
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
