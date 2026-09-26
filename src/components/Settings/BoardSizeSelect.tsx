import CustomSelect from "../ui/CustomSelect";

import { useAppSelector } from "../../hooks/reduxHooks";

import { useGameConfirmation } from "../../contexts/GameConfirmationContext";
import { getBoardSize } from "../../features/settingsSlice";
import { BoardSize } from "../../types/types";

const BoardSizeSelect = () => {
  const { requestBoardSize } = useGameConfirmation();
  const boardSize = useAppSelector(getBoardSize);
  const boardSizeOptions: { [key: string]: BoardSize } = {
    "3x3": 3,
    "4x4": 4,
    "5x5": 5,
    "6x6": 6,
  };

  return (
    <CustomSelect
      heading="Board Size"
      options={boardSizeOptions}
      handleSelect={requestBoardSize}
      selected={boardSize}
    />
  );
};

export default BoardSizeSelect;
