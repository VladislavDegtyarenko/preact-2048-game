import styles from "./Button.module.scss";

const Button = ({ children, icon, onClick, disabled, title }) => {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled} title={title}>
      {icon || children}
    </button>
  );
};

export default Button;
