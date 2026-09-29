import Modal from "../ui/Modal";

import { useAppSelector } from "../../hooks/reduxHooks";

import { BOARD_SIZES } from "../../constants/boardSizes";
import { useBestScoresModal } from "../../contexts/BestScoresModalContext";
import { useGameConfirmation } from "../../contexts/GameConfirmationContext";
import { formatScore } from "../../utils/formatScore";

import styles from "./BestScoresModal.module.scss";

const BestScoresModal = () => {
  const { close } = useBestScoresModal();
  const { pendingAction } = useGameConfirmation();
  const bestScore = useAppSelector((state) => state.board.bestScore);

  return (
    <Modal title="Best Scores" onClose={close} active={!pendingAction}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Board Size</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {BOARD_SIZES.map((size) => {
            const score = bestScore[size];

            return (
              <tr key={size}>
                <th scope="row">
                  {size}×{size}
                </th>
                <td>{score === undefined ? "—" : formatScore(score)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Modal>
  );
};

export default BestScoresModal;
