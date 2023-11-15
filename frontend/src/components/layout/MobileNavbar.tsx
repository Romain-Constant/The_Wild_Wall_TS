// MobileNavbar component provides a responsive navigation menu for mobile devices.
// It utilizes the react-burger-menu library for the sliding menu effect.
// The menu items include Write Post, Main Wall, Archives Wall, and Admin Page (if the user has admin rights).
// User authentication is handled, displaying the username and logout option when logged in.
// The menu can be opened or closed, triggering the state change accordingly.
// The component also includes a logo and project name.
// The navigation links use React Router's NavLink for seamless routing.
// Logout functionality clears the authentication cookie, logs the user out, and displays a success toast.
import {useState} from "react";
//@ts-ignore
import {slide as Menu} from "react-burger-menu";
import {FaSignOutAlt, FaUserNinja} from "react-icons/fa";
import {NavLink} from "react-router-dom";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {fetchData} from "../../api/api";
import {baseUrl} from "../../api/config";
import useAuth from "../../hooks/useAuth";
import "./MobileNavbar.css";

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
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
        className: "toastifyLogoutSuccess",
        autoClose: 2000,
      });
    } catch (err) {
      console.error(err);
    }

    setAuth({});
    closeMenu();
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // @ts-ignore
  const handleStateChange = state => {
    setMenuOpen(state.isOpen);
  };

  return (
    <div id="outer-container">
      <Menu
        right
        width="50%"
        isOpen={menuOpen}
        // @ts-ignore
        onStateChange={state => handleStateChange(state)}>
        <NavLink
          id="writepost"
          className="writepost"
          to="/writepost"
          onClick={() => closeMenu()}>
          Write Post
        </NavLink>
        <div className="separator" />

        <NavLink
          id="mainwall"
          className="menu-item"
          to="/mainwall"
          onClick={() => closeMenu()}>
          Main Wall
        </NavLink>

        <NavLink
          id="archiveswall"
          className="menu-item"
          to="/archives"
          onClick={() => closeMenu()}>
          Archives Wall
        </NavLink>
        {auth.roleCode === "2013" && (
          <NavLink
            id="adminpage"
            className="menu-item"
            to="/admin"
            onClick={() => closeMenu()}>
            Admin Page
          </NavLink>
        )}

        <div className="separator" />

        {Object.keys(auth).length !== 0 ? (
          <>
            <h1 className="loggedUserText">
              <FaUserNinja className="loggedUserIcon" />
              {auth.username}
            </h1>
            <FaSignOutAlt
              type="button"
              className="logoutIcon"
              onClick={handleLogout}
            />
          </>
        ) : (
          <>
            <NavLink
              to="login"
              className="loginLink"
              onClick={() => closeMenu()}>
              Login
            </NavLink>
            <NavLink
              to="register"
              className="loginLink"
              onClick={() => closeMenu()}>
              Register
            </NavLink>
          </>
        )}

        <div className="logoAndTextContainer">
          <div className="logoContainer" />
          <div className="logoTextContainer">
            <h1>WILD</h1>
            <h1>CODE</h1>
            <h1>SCHOOL</h1>
          </div>
        </div>
      </Menu>
      <div id="page-wrap">
        <div className="mobileNavbar">
          <div className="projectName">
            <h1>The Wild Wall</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
