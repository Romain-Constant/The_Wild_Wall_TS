import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {useMediaQuery} from "react-responsive";
import styles from "./Layout.module.css";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

function Layout() {
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});

  return (
    <main className={styles.layoutContainer}>
      {isDesktop ? (
        <>
          <Header />
          <Navbar />
          <Outlet />
          <Footer />
        </>
      ) : (
        <>
          <MobileNavbar />
          <Outlet />
          <Footer />
        </>
      )}
    </main>
  );
}

export default Layout;
