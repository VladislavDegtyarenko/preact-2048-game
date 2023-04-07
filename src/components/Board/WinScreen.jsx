import { useContext, useRef, useEffect, useState } from "react";
import GameContext from "../../GameContext";
import Confetti from "react-confetti";
import styles from "./WinScreen.module.scss";

const YouWin = () => {
  const {
    if: { win, waitAfterWin, showWinScreen, setShowWinScreen },
  } = useContext(GameContext);

  const winScreenRef = useRef();
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
    setConfettiSize({
      width: winScreenRef.current.clientWidth,
      height: winScreenRef.current.clientHeight,
    });
  };

  useEffect(() => {
    resizeConfetti();

    window.addEventListener("resize", resizeConfetti);

    return () => window.removeEventListener("resize", resizeConfetti);
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
