import { ComponentPropsWithoutRef, useId } from "react";
import Button from "./Button";
import styles from "./CustomSelect.module.scss";

type CustomSelectProps<T extends string | number> = Omit<
  ComponentPropsWithoutRef<"div">, "children"
> & {
  heading: string;
  options: Record<string, T>;
  selected: T;
  handleSelect: (selected: T) => void;
};

const CustomSelect = <T extends string | number,>({
  heading,
  options,
  selected,
  handleSelect,
  className,
  ...props
}: CustomSelectProps<T>) => {
  const headingId = useId();

  return (
    <div
      className={[styles.select, className].filter(Boolean).join(" ")}
      {...props}
    >
      <h3 id={headingId} className={styles.heading}>{heading}: </h3>
      <div className={styles.options} role="group" aria-labelledby={headingId}>
        {Object.entries(options).map(([label, value]) => (
          <Button
            variant={selected === value ? "primary" : "secondary"}
            type="button"
            aria-pressed={selected === value}
            className={styles.option}
            key={value}
            onClick={() => handleSelect(value)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
