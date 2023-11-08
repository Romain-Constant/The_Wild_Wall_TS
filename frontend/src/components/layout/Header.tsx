import {FaSignOutAlt, FaUserNinja} from "react-icons/fa";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {fetchData} from "../../api/api";
import {baseUrl} from "../../api/config";
import useAuth from "../../hooks/useAuth";
import styles from "./Header.module.css";
import {useEffect} from "react";

function Header() {
  const {auth, setAuth} = useAuth();

  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
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

    setAuth({});
  };

  // add a check to see if the "auth" local storage is empty because the item is removed every 60 minutes. If yes, then logout to make username disappear from the header
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
          <h1 className={styles.loggedUserText}>
            <FaUserNinja className={styles.loggedUserIcon} />
            {auth.username}
            {/* ({getRoleText(auth.role)}) */}
            <FaSignOutAlt
              type="button"
              className={styles.logoutUserIcon}
              onClick={handleLogout}
            />
          </h1>
        ) : (
          <Link to="login" className={styles.loginLink}>
            <h1 className={styles.loginText}>Login</h1>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Header;
