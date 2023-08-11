import { ButtonProps } from "../../types/types";
import styles from "./Button.module.scss";

const Button = ({ children, onClick, disabled, title, transparent }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${transparent ? styles.transparent : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
};

export default Button;
