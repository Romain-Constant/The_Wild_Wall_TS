import {createContext, useState, useEffect} from "react";
import {ReactNode} from "react";
import {AuthState} from "../types/auth.type";

interface AuthProps {
  children: ReactNode;
}

// Define the shape of the default context
interface AuthContextDefault {
  auth: AuthState;
  setAuth: (a: AuthState) => void;
}

// Create the AuthContext with initial default values
const AuthContext = createContext<AuthContextDefault>({
  auth: {}, // Default empty auth state
  setAuth: () => {}, // Default empty function for setting auth state
});

// AuthProvider component that manages the authentication state
export function AuthProvider({children}: AuthProps) {
  // Retrieve auth state from local storage or use an empty object
  const localStorageAuthItem = localStorage.getItem("auth");
  const initialAuth =
    localStorageAuthItem !== null ? JSON.parse(localStorageAuthItem) : {};
  // State to manage the auth state
  const [auth, setAuth] = useState<AuthState>(initialAuth);

  // Save the auth state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  // Clear the auth state from local storage after 60 minutes
  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        localStorage.removeItem("auth");
      },
      60 * 60 * 1000,
    ); // 60 minutes in milliseconds

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timeoutId);
  }, []);

  // Provide the auth state and setAuth function to the context
  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
