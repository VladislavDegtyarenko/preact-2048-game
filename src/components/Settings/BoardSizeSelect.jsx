import { useContext } from "react";
import GameContext from "../../GameContext";
import CustomSelect from "../ui/CustomSelect";

import { BOARD_SIZE } from "../../GameContext";

const BoardSizeSelect = () => {
  const {
    settings: { boardSize, setBoardSize },
  } = useContext(GameContext);

  const handleBoardSizeSelect = (size) => {
    setBoardSize(size);
  };

  return (
    <CustomSelect
      heading={"Board Size"}
      options={BOARD_SIZE}
      handleSelect={handleBoardSizeSelect}
      selected={boardSize}
    />
  );
};

export default BoardSizeSelect;
