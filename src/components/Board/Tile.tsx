import { useState, useEffect, memo, useRef } from "react";
import { clearDoubleAnimationFlag, tileDeleted } from "../../features/boardSlice";
import { getBoardSize } from "../../features/settingsSlice";
import { ANIMATION_DURATION } from "../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { CustomTileStyles, Tile as TileProps } from "../../types/types";
import styles from "./Tile.module.scss";

const Tile = ({
  id,
  value,
  top,
  left,
  toTriggerDeleteAnimation,
  toTriggerDoubleAnimation,
}: TileProps) => {
  const boardSize = useAppSelector(getBoardSize);
  const dispatch = useAppDispatch();

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
    let size = `calc(var(--container-width) / ${boardSize} * ${
      Math.round((valueCoeff / 6) * 100) / 100
    })`;

    return { fontSize: size };
  })();

  // Double Animation
  const [animateDouble, setAnimateDouble] = useState(false);

  useEffect(() => {
    // check if it's actually doubled
    if (value !== tileValue) {
      setAnimateDouble(true);

      setTimeout(() => {
        setTileValue(value);
      }, ANIMATION_DURATION * 0.75);

      setTimeout(() => {
        setAnimateDouble(false);
      }, ANIMATION_DURATION * 1.5);
    }
  }, [value]);

  // Delete Animation
  useEffect(() => {
    if (toTriggerDeleteAnimation) {
      // delete tile after animation finish
      setTimeout(() => {
        dispatch(tileDeleted({ id, boardSize }));
      }, ANIMATION_DURATION);
    }
  }, [toTriggerDeleteAnimation]);

  const tileStyles = {
    "--top": top,
    "--left": left,
    ...color,
    ...backgroundColor,
    ...fontSize,
  } as CustomTileStyles;

  return (
    <div
      className={`${styles.tile} ${
        animateTileMoves.current ? styles.animateTransform : ""
      } ${animateDouble ? styles.onTop : ""}`}
      style={tileStyles}
    >
      <span
        className={`${styles.tileInner} ${visible ? styles.visible : ""} ${
          animateDouble ? styles.toDouble : ""
        } ${toTriggerDeleteAnimation ? styles.toDelete : ""}`}
      >
        {tileValue}
      </span>
    </div>
  );
};

export default memo(Tile);
