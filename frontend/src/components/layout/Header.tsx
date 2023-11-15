// It includes the Wild Code School logo, project name, and user-related actions like login and logout.
// The user's username is displayed if authenticated.
// The component utilizes react-icons for icons and react-toastify for displaying logout success messages.
// The handleLogout function clears the authentication cookie and triggers a logout API request.

import {useEffect} from "react";
import {FaSignOutAlt, FaUserNinja} from "react-icons/fa";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {fetchData} from "../../api/api";
import {baseUrl} from "../../api/config";
import useAuth from "../../hooks/useAuth";
import styles from "./Header.module.css";

function Header() {
  // Get authentication information using the useAuth hook
  const {auth, setAuth} = useAuth();

  // Function to handle user logout
  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
      // Trigger logout API request
      await fetchData(`${baseUrl}/auth/logout`, {
        method: "GET",
      });

      // Show success toast
      toast.success("Logout successful!", {
        className: styles.toastifyLogoutSuccess,
        autoClose: 2000,
      });
    } catch (err) {
      console.error(err);
    }

    // Clear the authentication information in the app state
    setAuth({});
  };

  // Automatic logout if "auth" local storage is empty after 5 minutes
  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (Object.keys(auth).length === 0) {
          handleLogout();
        }
      },
      5 * 60 * 1000,
    );
    return () => clearTimeout(timeout);
  }, [auth]);

  // Render the navigation bar with the logo, project name, and user-related actions
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.logoContainer} />
      <div className={styles.logoTextContainer}>
        <h1>WILD</h1>
        <h1>CODE</h1>
        <h1>SCHOOL</h1>
      </div>
      <div className={styles.projectName}>
        <h1>The Wild Wall</h1>
      </div>

      <div className={styles.loginContainer}>
        {Object.keys(auth).length !== 0 ? (
          // Display user information if authenticated
          <h1 className={styles.loggedUserText}>
            <FaUserNinja className={styles.loggedUserIcon} />
            {auth.username}
            <FaSignOutAlt
              type="button"
              className={styles.logoutUserIcon}
              onClick={handleLogout}
            />
          </h1>
        ) : (
          // Display login link if not authenticated
          <Link to="login" className={styles.loginLink}>
            <h1 className={styles.loginText}>Login</h1>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
