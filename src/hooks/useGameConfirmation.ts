import { useContext } from "react";
import { GameConfirmationContext } from "../features/gameConfirmationContext";

/** Reads the shared game confirmation state and request handlers. */
const useGameConfirmation = () => {
  const confirmation = useContext(GameConfirmationContext);
  if (!confirmation) {
    throw new Error("useGameConfirmation must be used inside GameConfirmationProvider.");
  }
  return confirmation;
};

export default useGameConfirmation;
