import CustomSelect from "../ui/CustomSelect";

// TS
import { BoardSize } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { boardSizeChanged, getBoardSize } from "../../features/settingsSlice";
import { newGameStarted } from "../../features/boardSlice";

const BoardSizeSelect = () => {
  const boardSize = useAppSelector(getBoardSize);
  const dispatch = useAppDispatch();

  const handleBoardSizeSelect = (size: BoardSize) => {
    dispatch(boardSizeChanged(size));
    dispatch(newGameStarted(size));
  };

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
      handleSelect={handleBoardSizeSelect as (selected: number | string) => void}
      selected={boardSize}
    />
  );
};

export default BoardSizeSelect;
