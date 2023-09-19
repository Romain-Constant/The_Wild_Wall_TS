import {Outlet} from "react-router-dom";
import NavbarDesktop from "./NavbarDesktop";
import Footer from "./Footer";
import styles from "./Layout.module.css";
import ConsoleMenu from "./ConsoleMenu";

function Layout() {
  return (
    <main className={styles.layoutContainer}>
      <NavbarDesktop />
      <ConsoleMenu />
      <Outlet />
      <Footer />
    </main>
  );
}

export default Layout;
