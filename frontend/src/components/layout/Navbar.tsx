// Import necessary dependencies and styles
import {NavLink} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Navbar.module.css";

// Functional component for the navigation bar
function Navbar() {
  // Retrieve authentication information using the useAuth hook
  const {auth} = useAuth();

  // Render the navigation bar
  return (
    <div className={styles.consoleMenuContainer}>
      {/* Navigation link for the Main Wall */}
      <NavLink
        to="/mainwall"
        className={({isActive}) =>
          isActive ? styles.activeButton : styles.consoleButton
        }>
        Main Wall
      </NavLink>

      {/* Navigation link for the Archives Wall */}
      <NavLink
        to="/archives"
        className={({isActive}) =>
          isActive ? styles.activeButton : styles.consoleButton
        }>
        Archives Wall
      </NavLink>

      {/* Conditional rendering of Admin Page link based on user role */}
      {auth.roleCode === "2013" && (
        <NavLink
          to="/admin"
          className={({isActive}) =>
            isActive ? styles.activeButton : styles.consoleButton
          }>
          Admin Page
        </NavLink>
      )}
    </div>
  );
}

// Export the Navbar component as the default export
export default Navbar;
