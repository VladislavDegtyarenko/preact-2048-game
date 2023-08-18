import { useState, useEffect } from "react";
import styles from "./Settings.module.scss";

import ThemeSelect from "./ThemeSelect";
import BoardSizeSelect from "./BoardSizeSelect";
import Overlay from "../ui/Overlay";
import Button from "../ui/Button";
import { MdClose } from "react-icons/md";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { settingsModalToggled } from "../../features/settingsSlice";

const Settings = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!visible) setVisible(true);
  }, []);

  const dispatch = useAppDispatch();

  const closeSettingsModal = () => {
    dispatch(settingsModalToggled(false));
  };

  return (
    <div className={`${styles.settings} ${visible ? styles.visible : ""}`}>
      <Overlay onClick={closeSettingsModal} />
      <div className={styles.inner}>
        <header>
          <h2 className={styles.title}>Game Settings</h2>
          <Button onClick={closeSettingsModal} title="Close settings" transparent>
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
