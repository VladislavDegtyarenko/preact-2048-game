import styles from "./Settings.module.scss";
import ThemeSelect from "./ThemeSelect";
import BoardSizeSelect from "./BoardSizeSelect";
import Modal from "../ui/Modal";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { settingsModalToggled } from "../../features/settingsSlice";

type SettingsProps = {
  active: boolean;
};

const Settings = ({ active }: SettingsProps) => {
  const dispatch = useAppDispatch();

  return (
    <Modal
      title="Game Settings"
      onClose={() => dispatch(settingsModalToggled(false))}
      active={active}
    >
      <div className={styles.options}>
        <ThemeSelect />
        <BoardSizeSelect />
      </div>
      <p className={styles.subtitle}>
        Changing the board size starts a new game and resets your current score.
        Your best score is kept.
      </p>
    </Modal>
  );
};

export default Settings;
