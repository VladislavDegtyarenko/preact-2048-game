import styles from "./Overlay.module.scss";

const Overlay = ({ onClick }) => {
  return <div className={styles.overlay} onClick={onClick}></div>;
};

export default Overlay;
