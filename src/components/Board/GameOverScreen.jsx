import { useState, useEffect } from "react";
import Overlay from "../ui/Overlay";
import styles from "./GameOverScreen.module.scss";

const GameOverScreen = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible)
      setTimeout(() => {
        setVisible(true);
      }, 50);
  }, []);

  return (
    <div className={`${styles.gameOver} ${visible ? styles.visible : ""}`}>
      <Overlay />
      <h2 className={styles.title}>Game over!</h2>
    </div>
  );
};

export default GameOverScreen;
