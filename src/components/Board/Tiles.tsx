import Tile from "./Tile";

import { useAppSelector } from "../../hooks/reduxHooks";

import { getTiles } from "../../features/boardSlice";

import styles from "./Tiles.module.scss";

const Tiles = () => {
  const tiles = useAppSelector(getTiles);

  return (
    <div className={styles.tiles}>
      {tiles.map((tile) => (
        <Tile {...tile} key={tile.id} />
      ))}
    </div>
  );
};

export default Tiles;
