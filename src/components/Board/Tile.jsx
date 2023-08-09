import { useState, useEffect, useContext, memo, useRef } from "react";
import GameContext from "../../GameContext";
import { ANIMATION_DURATION } from "../../GameContext";
import styles from "./Tile.module.scss";

const Tile = ({
  id,
  value,
  top,
  left,
  toTriggerDeleteAnimation,
  toTriggerDoubleAnimation,
}) => {
  const {
    tilesPerRow,
    actions: { setTiles },
  } = useContext(GameContext);
  const [tileValue, setTileValue] = useState(value);
  const [visible, setVisible] = useState(false);

  const animateTileMoves = useRef(false);

  useEffect(() => {
    if (!visible)
      setTimeout(() => {
        setVisible(true);
      }, ANIMATION_DURATION * 0.5);

    animateTileMoves.current = true;
  }, []);

  setTimeout(() => {
    setTileValue(value);
  }, ANIMATION_DURATION * 0.75);

  const color = tileValue > 4 ? { color: "var(--text-inverted)" } : {};

  const backgroundColor =
    tileValue > 2048
      ? { "--background-color": "var(--tile-huge)" }
      : { "--background-color": `var(--tile${tileValue})` };

  const fontSize = (function () {
    let valueCoeff;

    if (tileValue > 99999) valueCoeff = 1;
    else if (tileValue > 9999) valueCoeff = 1.1;
    else if (tileValue > 999) valueCoeff = 1.375;
    else valueCoeff = 1.725;

    // If it works, don't touch it :)
    let size = `calc(var(--container-width) / ${tilesPerRow} * ${
      Math.round((valueCoeff / 6) * 100) / 100
    })`;

    return { fontSize: size };
  })();

  // Double Animation

  useEffect(() => {
    if (toTriggerDoubleAnimation)
      setTimeout(() => {
        setTiles((prevTiles) =>
          prevTiles.map((tile) => {
            if (tile.id === id) {
              delete tile.toTriggerDoubleAnimation;
            }

            return tile;
          })
        );
      }, ANIMATION_DURATION * 1.5);
  }, [toTriggerDoubleAnimation]);

  // Delete Animation

  useEffect(() => {
    if (toTriggerDeleteAnimation) {
      // delete tile after animation finish
      setTimeout(() => {
        setTiles((prevTiles) => prevTiles.filter((tile) => tile.id !== id));
      }, ANIMATION_DURATION);
    }
  }, [toTriggerDeleteAnimation]);

  return (
    <div
      className={`${styles.tile} ${
        animateTileMoves.current ? styles.animateTransform : ""
      } ${toTriggerDoubleAnimation ? styles.onTop : ""}`}
      style={{
        "--top": top,
        "--left": left,
        ...color,
        ...backgroundColor,
        ...fontSize,
      }}
      ref={animateTileMoves}
    >
      <span
        className={`${styles.tileInner} ${visible ? styles.visible : ""} ${
          toTriggerDoubleAnimation ? styles.toDouble : ""
        } ${toTriggerDeleteAnimation ? styles.toDelete : ""}`}
      >
        {tileValue}
      </span>
    </div>
  );
};

export default memo(Tile);
