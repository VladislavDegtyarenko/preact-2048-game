import styles from "./CustomSelect.module.scss";

const CustomSelect = ({ heading, options, selected = "-", handleSelect }) => {
  // console.log("selected: ", selected);
  return (
    <div className={styles.select}>
      <h3 className={styles.heading}>{heading}: </h3>
      <div className={styles.options}>
        {Object.entries(options).map(([option, text]) => {
          return (
            <div
              className={`${styles.option} ${selected === text ? styles.selected : ""}`}
              key={option}
              onClick={() => handleSelect(options[option])}
            >
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomSelect;
