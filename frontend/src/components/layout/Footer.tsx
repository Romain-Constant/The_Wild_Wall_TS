import {FaHeart} from "react-icons/fa";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <p>Coded by Romain with</p>
      <FaHeart className={styles.hearthIcon} />
    </footer>
  );
}

export default Footer;
