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
