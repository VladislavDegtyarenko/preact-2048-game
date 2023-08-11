import styles from "./Overlay.module.scss";

const Overlay = ({ ...props }) => {
  return <div className={styles.overlay} {...props}></div>;
};

export default Overlay;
