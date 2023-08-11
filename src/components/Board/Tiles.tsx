import { useContext } from "react";
import GameContext from "../../GameContext";
import Tile from "./Tile";
import styles from "./Tiles.module.scss";

const Tiles = () => {
  const { tiles } = useContext(GameContext);

  return (
    <div className={styles.tiles}>
      {tiles && tiles.length > 0
        ? tiles.map((tile) => <Tile {...tile} key={tile.id} />)
        : null}
    </div>
  );
};

export default Tiles;
