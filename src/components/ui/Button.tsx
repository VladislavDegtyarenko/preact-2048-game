import { ComponentPropsWithoutRef } from "react";
import styles from "./Button.module.scss";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: "transparent" | "secondary" | "primary";
  initialFocus?: boolean;
};

const Button = ({
  children,
  className,
  type = "button",
  title,
  variant = "secondary",
  initialFocus,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      data-modal-initial-focus={initialFocus || undefined}
      aria-label={title}
      className={[styles.button, styles[variant], className]
        .filter(Boolean)
        .join(" ")}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
