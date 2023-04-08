import styles from "./Button.module.scss";

const Button = ({ children, icon, onClick, disabled, title, transparent }) => {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      transparent={transparent}
      disabled={disabled}
      title={title}
    >
      {icon || children}
    </button>
  );
};

export default Button;
