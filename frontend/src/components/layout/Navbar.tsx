// Navbar component provides a navigation bar with NavLink components for different sections.
// It utilizes the react-router-dom library for seamless routing.
// The navigation links include Main Wall, Archives Wall, and Admin Page (if the user has admin rights).
// The component dynamically applies styles based on the active NavLink.
// User authentication is used to conditionally render the Admin Page link.
import {NavLink} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Navbar.module.css";

function Navbar() {
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

export default Navbar;
