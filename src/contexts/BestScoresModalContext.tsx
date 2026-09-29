import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

type BestScoresModalValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const BestScoresModalContext = createContext<BestScoresModalValue | null>(null);

/** Shares the Best Scores window state without saving it with the game. */
export const BestScoresModalProvider = ({ children }: PropsWithChildren) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BestScoresModalContext.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
      }}
    >
      {children}
    </BestScoresModalContext.Provider>
  );
};

/** Reads the Best Scores window state and its open and close actions. */
export const useBestScoresModal = () => {
  const modal = useContext(BestScoresModalContext);

  if (!modal) {
    throw new Error(
      "useBestScoresModal must be used inside BestScoresModalProvider."
    );
  }

  return modal;
};
