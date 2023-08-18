// Redux
import { useAppSelector } from "../../hooks/reduxHooks";
import { getTiles } from "../../features/boardSlice";

// UI
import Tile from "./Tile";

// Styles
import styles from "./Tiles.module.scss";

const Tiles = () => {
  const tiles = useAppSelector(getTiles);

  return (
    <div className={styles.tiles}>
      {tiles && tiles.length > 0
        ? tiles.map((tile) => <Tile {...tile} key={tile.id} />)
        : null}
    </div>
  );
};

export default Tiles;
