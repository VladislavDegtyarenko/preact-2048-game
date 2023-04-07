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

      {/* <Tile value={2} top={0} left={0} />
      <Tile value={4} top={0} left={1} />
      <Tile value={8} top={0} left={2} />
      <Tile value={16} top={0} left={3} />
      <Tile value={32} top={1} left={0} />
      <Tile value={64} top={1} left={1} />
      <Tile value={128} top={1} left={2} />
      <Tile value={256} top={1} left={3} />
      <Tile value={512} top={2} left={0} />
      <Tile value={1024} top={2} left={1} />
      <Tile value={2048} top={2} left={2} />
      <Tile value={4096} top={2} left={3} />
      <Tile value={8192} top={3} left={0} />
      <Tile value={16384} top={3} left={1} />
      <Tile value={16384 * 2} top={3} left={2} />
      <Tile value={16384 * 4} top={3} left={3} /> */}
    </div>
  );
};

export default Tiles;
