import styles from "./Grid.module.scss";

const Grid = ({ size }) => {
  return (
    <div className={styles.grid}>
      {[...Array(size).keys()].map((row) => (
        <div className={styles.row} key={row}>
          {[...Array(size).keys()].map((cell) => (
            <div className={styles.cell} key={cell}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
