// Layout component serves as the main container for the application's UI.
// It conditionally renders either the desktop layout (with Header, Navbar, Outlet, and Footer)
// or the mobile layout (with MobileNavbar, Outlet, and Footer) based on the screen width.
// The responsive design is achieved using the react-responsive library to check for desktop width.
// The Header contains navigation and user-related information.
// The Navbar/MobileNavbar provides navigation links.
// The Outlet renders the content specific to each route.
// The Footer is displayed at the bottom of the page.
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {useMediaQuery} from "react-responsive";
import styles from "./Layout.module.css";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

function Layout() {
  // Check if the screen width is greater than or equal to 768px (desktop)
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});

  // Render the appropriate layout based on the screen width
  return (
    <main className={styles.layoutContainer}>
      {isDesktop ? (
        // Desktop layout with Header, Navbar, Outlet, and Footer
        <>
          <Header />
          <Navbar />
          <Outlet />
          <Footer />
        </>
      ) : (
        // Mobile layout with MobileNavbar, Outlet, and Footer
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
