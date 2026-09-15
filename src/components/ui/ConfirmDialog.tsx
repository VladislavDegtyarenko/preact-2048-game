import Button from "./Button";
import Modal from "./Modal";
import styles from "./ConfirmDialog.module.scss";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog = ({
  title, message, confirmLabel, onConfirm, onCancel,
}: ConfirmDialogProps) => (
  <Modal title={title} onClose={onCancel} active>
    <p className={styles.message}>{message}</p>
    <div className={styles.actions}>
      <Button variant="secondary" onClick={onCancel} initialFocus>Cancel</Button>
      <Button variant="primary" onClick={onConfirm}>{confirmLabel}</Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
