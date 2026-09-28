import { useAppSelector } from "./reduxHooks";

import { useBestScoresModal } from "../contexts/BestScoresModalContext";
import { useGameConfirmation } from "../contexts/GameConfirmationContext";
import { getSettingsIsOpened } from "../features/settingsSlice";

/** Reports whether an open modal blocks gameplay input. */
export const useGameInputBlocked = () => {
  const { isOpen: bestScoresIsOpen } = useBestScoresModal();
  const { pendingAction } = useGameConfirmation();
  const settingsIsOpened = useAppSelector(getSettingsIsOpened);

  return bestScoresIsOpen || Boolean(pendingAction) || settingsIsOpened;
};
