import { CustomSelectProps } from "../../types/types";
import styles from "./CustomSelect.module.scss";

const CustomSelect = ({
  heading,
  options,
  selected,
  handleSelect,
}: CustomSelectProps<string | number>) => {
  return (
    <div className={styles.select}>
      <h3 className={styles.heading}>{heading}: </h3>
      <div className={styles.options}>
        {Object.entries(options).map(([label, value]) => {
          return (
            <div
              className={`${styles.option} ${selected === value ? styles.selected : ""}`}
              key={value}
              onClick={() => handleSelect(options[label])}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSelect;
