import {useContext} from "react";
import AuthContext from "../context/AuthProvider";

// Create a custom hook named useAuth to easily access the authentication context
const useAuth = () => {
  // Use the useContext hook to get the current value of AuthContext
  return useContext(AuthContext);
};

// Export the useAuth hook for use in other components
export default useAuth;
