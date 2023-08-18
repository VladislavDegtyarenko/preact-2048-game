import { useState, useLayoutEffect, RefObject } from "react";
import { useAppSelector } from "./reduxHooks";
import { debounce } from "lodash";
import { ANIMATION_DURATION } from "../utils/constants";
import { CustomCSSVariables } from "../types/types";

const MIN_CONTAINER_WIDTH = 360,
  MAX_CONTAINER_WIDTH = 480;

const useDynamicWidth = (containerRef: RefObject<HTMLDivElement>) => {
  // Dynamic container width
  const [containerWidth, setContainerWidth] = useState(MAX_CONTAINER_WIDTH);

  const boardSize = useAppSelector((state) => state.settings.boardSize);

  const containerWidthHandler = () => {
    setContainerWidth((prevWidth) => {
      const viewportWidth = document.body.clientWidth;

      if (!containerRef.current) return prevWidth;

      if (viewportWidth < MIN_CONTAINER_WIDTH) return MIN_CONTAINER_WIDTH;
      else if (viewportWidth > MAX_CONTAINER_WIDTH) return MAX_CONTAINER_WIDTH;
      else return Math.floor(viewportWidth);
    });
  };

  const debounceContainerWidthHandler = debounce(containerWidthHandler, 150);

  useLayoutEffect(() => {
    containerWidthHandler();

    window.addEventListener("resize", debounceContainerWidthHandler);

    return () => window.removeEventListener("resize", debounceContainerWidthHandler);
  }, []);

  const OUTER_MARGIN = 16;
  const BOARD_PADDING = 16;

  const boardWidth = containerWidth - OUTER_MARGIN * 2 - BOARD_PADDING; // board size without padding
  const cellSize = (boardWidth / boardSize) * 0.94;
  const cellGap = (boardWidth - cellSize * boardSize) / (boardSize - 1);

  const style: CustomCSSVariables = {
    "--transition-duration": ANIMATION_DURATION / 1000 + "s",
    "--container-width": containerWidth + "px",
    "--outer-margin": OUTER_MARGIN + "px",
    "--tiles-per-row": boardSize,
    "--board-padding": BOARD_PADDING + "px",
    "--cell-size": cellSize.toFixed(1) + "px",
    "--cell-gap": cellGap.toFixed(1) + "px",
  };
  return { style };
};

export default useDynamicWidth;
