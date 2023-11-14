import {Navigate, Outlet} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Define the properties expected by the RequireAuth component
interface RequireAuthProps {
  allowedRoles: string[];
}

// RequireAuth component checks if the user is authenticated and authorized based on roles
function RequireAuth({allowedRoles}: RequireAuthProps) {
  // Retrieve authentication information from the custom useAuth hook
  const {auth} = useAuth();

  // Check if the user is authenticated
  const isAuthenticated = auth && auth.username;

  // Check if the user is authorized based on allowed roles
  const isAuthorized =
    auth && auth.roleCode && allowedRoles.includes(auth.roleCode);

  // Render the appropriate content based on authentication and authorization status
  if (isAuthorized) {
    // If authorized, render the nested content (components) within the Outlet
    return <Outlet />;
  } else if (isAuthenticated) {
    // If authenticated but not authorized, navigate to the unauthorized page
    return <Navigate to="/unauthorized" />;
  } else {
    // If not authenticated, navigate to the login page
    return <Navigate to="/login" />;
  }
}

// Export the RequireAuth component for use in other parts of the application
export default RequireAuth;
