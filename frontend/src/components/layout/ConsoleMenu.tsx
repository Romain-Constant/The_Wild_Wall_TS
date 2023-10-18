import {NavLink} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./ConsoleMenu.module.css";

function ConsoleMenu() {
  const {auth} = useAuth();

  return (
    <div className={styles.consoleMenuContainer}>
      <NavLink
        to="/mainwall"
        className={({isActive}) =>
          isActive ? styles.activeButton : styles.consoleButton
        }>
        Main Wall
      </NavLink>
      <NavLink
        to="/archives"
        className={({isActive}) =>
          isActive ? styles.activeButton : styles.consoleButton
        }>
        Archives wall
      </NavLink>

      {auth.roleCode === "2013" && (
        <NavLink
          to="/admin"
          className={({isActive}) =>
            isActive ? styles.activeButton : styles.consoleButton
          }>
          Admin page
        </NavLink>
      )}
    </div>
  );
}

export default ConsoleMenu;
