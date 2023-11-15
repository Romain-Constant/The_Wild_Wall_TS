// RequireAuth component serves as a route guard to restrict access to certain routes based on user authentication and authorization.
// It takes an array of allowedRoles as a prop to determine if the user has the necessary role to access the route.
// It uses the useAuth hook to retrieve authentication information from the context.
// If the user is authenticated and has the required role, it renders the Outlet (child routes).
// If the user is authenticated but not authorized, it navigates to the "/unauthorized" route.
// If the user is not authenticated, it redirects to the "/login" route.
import {Navigate, Outlet} from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface RequireAuthProps {
  allowedRoles: string[];
}

function RequireAuth({allowedRoles}: RequireAuthProps) {
  const {auth} = useAuth();

  const isAuthenticated = auth && auth.username;
  const isAuthorized =
    auth && auth.roleCode && allowedRoles.includes(auth.roleCode);

  if (isAuthorized) {
    return <Outlet />;
  } else if (isAuthenticated) {
    return <Navigate to="/unauthorized" />;
  } else {
    return <Navigate to="/login" />;
  }
}

export default RequireAuth;
