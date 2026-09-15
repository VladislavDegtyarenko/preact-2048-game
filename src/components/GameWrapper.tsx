import { PropsWithChildren, useRef } from "react";
import styles from "./GameWrapper.module.scss";
import useDynamicWidth from "../hooks/useDynamicWidth";
import useSwipes from "../hooks/useSwipes";
import useKeyboard from "../hooks/useKeyboard";

const GameWrapper = ({ children }: PropsWithChildren) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { style } = useDynamicWidth(containerRef);

  useSwipes(containerRef);
  useKeyboard();

  return (
    <div className={`${styles.gameWrapper}`} style={style} ref={containerRef}>
      {children}
    </div>
  );
};

export default GameWrapper;
