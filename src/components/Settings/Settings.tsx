import { useState, useEffect, useContext } from "react";
import GameContext from "../../GameContext";
import styles from "./Settings.module.scss";

import ThemeSelect from "./ThemeSelect";
import BoardSizeSelect from "./BoardSizeSelect";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";
import { MdClose } from "react-icons/md";

const Settings = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) setVisible(true);
  }, []);

  const {
    settings: { toggleSettingsModal },
  } = useContext(GameContext);

  return (
    <div className={`${styles.settings} ${visible ? styles.visible : ""}`}>
      <Overlay onClick={toggleSettingsModal} />
      <div className={styles.inner}>
        <header>
          <h2 className={styles.title}>Game Settings</h2>
          <Button onClick={toggleSettingsModal} title="Close settings" transparent>
            {<MdClose />}
          </Button>
        </header>
        <main>
          <ThemeSelect />
          <BoardSizeSelect />
        </main>
        <p className={styles.subtitle}>
          Applying new board size will reset your game progress, including your current
          score
        </p>
      </div>
    </div>
  );
};

export default Settings;
