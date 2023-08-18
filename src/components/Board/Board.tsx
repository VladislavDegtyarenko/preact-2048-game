import { useRef } from "react";
// Redux
import { useAppSelector } from "../../hooks/reduxHooks";

// UI
import Grid from "./Grid";
import styles from "./Board.module.scss";
import Tiles from "./Tiles";
import WinScreen from "./WinScreen";
import GameOverScreen from "./GameOverScreen";
import Settings from "../Settings/Settings";

const Board = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  const settingsIsOpened = useAppSelector((state) => state.settings.settingsIsOpened);
  const { showWinScreen, gameOver } = useAppSelector((state) => state.board);

  return (
    <div className={styles.board}>
      <div className={styles.boardInner} ref={boardRef}>
        <Grid />
        <Tiles />
      </div>
      {showWinScreen ? <WinScreen /> : null}
      {gameOver ? <GameOverScreen /> : null}
      {settingsIsOpened ? <Settings /> : null}
    </div>
  );
};

export default Board;
