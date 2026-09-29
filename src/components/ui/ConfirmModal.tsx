import Button from "./Button";
import Modal from "./Modal";

import styles from "./ConfirmModal.module.scss";

type ConfirmModalProps = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => (
  <Modal title={title} onClose={onCancel} active>
    <p className={styles.message}>{message}</p>
    <div className={styles.actions}>
      <Button variant="secondary" onClick={onCancel} initialFocus>
        Cancel
      </Button>
      <Button variant="primary" onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmModal;
