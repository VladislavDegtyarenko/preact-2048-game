import { useAppSelector } from "../../hooks/reduxHooks";
import { getBoardSize } from "../../features/settingsSlice";

// Styles
import styles from "./Grid.module.scss";

const Grid = () => {
  const boardSize = useAppSelector(getBoardSize);

  return (
    <div className={styles.grid}>
      {[...Array(boardSize).keys()].map((row) => (
        <div className={styles.row} key={row}>
          {[...Array(boardSize).keys()].map((cell) => (
            <div className={styles.cell} key={cell}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
