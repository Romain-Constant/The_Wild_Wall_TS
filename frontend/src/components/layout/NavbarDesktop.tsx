import {FaPowerOff, FaUserNinja} from "react-icons/fa";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import styles from "./NavbarDesktop.module.css";

function NavbarDesktop() {
  const {auth, setAuth} = useAuth();

  console.log("auth", auth);

  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
      await axios.get("/logout");

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
            <FaPowerOff
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

export default NavbarDesktop;
