import { useRef, type PropsWithChildren } from "react";

import { useAppSelector } from "../hooks/reduxHooks";
import { useElementSize } from "../hooks/useElementSize";
import { useKeyboard } from "../hooks/useKeyboard";
import { useSwipes } from "../hooks/useSwipes";

import { getGameWrapperStyles } from "../utils/getGameWrapperStyles";

import styles from "./GameWrapper.module.scss";

const GameWrapper = ({ children }: PropsWithChildren) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: viewportWidth } = useElementSize(document.body);
  const boardSize = useAppSelector((state) => state.settings.boardSize);
  const style = getGameWrapperStyles(viewportWidth, boardSize);

  useSwipes(containerRef);
  useKeyboard();

  return (
    <div className={`${styles.gameWrapper}`} style={style} ref={containerRef}>
      {children}
    </div>
  );
};

export default GameWrapper;
