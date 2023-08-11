import { useContext } from "react";
import GameContext from "../../GameContext";
import CustomSelect from "../ui/CustomSelect";

// TS
import { BoardSize } from "../../types/types";

const BoardSizeSelect = () => {
  const {
    settings: { boardSize, setBoardSize },
  } = useContext(GameContext);

  const handleBoardSizeSelect = (size: BoardSize) => {
    setBoardSize(size);
  };

  return (
    <CustomSelect
      heading={"Board Size"}
      options={BoardSize}
      handleSelect={handleBoardSizeSelect as (selected: string) => void}
      selected={boardSize}
    />
  );
};

export default BoardSizeSelect;
