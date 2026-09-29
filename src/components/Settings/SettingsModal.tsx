import Modal from "../ui/Modal";
import BoardSizeSelect from "./BoardSizeSelect";
import ThemeSelect from "./ThemeSelect";

import { useAppDispatch } from "../../hooks/reduxHooks";

import { settingsModalToggled } from "../../features/settingsSlice";

import styles from "./SettingsModal.module.scss";

type SettingsModalProps = {
  active: boolean;
};

const SettingsModal = ({ active }: SettingsModalProps) => {
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
        Your best scores are saved separately for each board size.
      </p>
    </Modal>
  );
};

export default SettingsModal;
