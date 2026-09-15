import CustomSelect from "../ui/CustomSelect";

// TS
import { BoardSize } from "../../types/types";
import { useAppSelector } from "../../hooks/reduxHooks";
import useGameConfirmation from "../../hooks/useGameConfirmation";
import { getBoardSize } from "../../features/settingsSlice";

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
