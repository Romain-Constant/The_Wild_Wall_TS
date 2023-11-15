// AuthProvider component manages the authentication state using React context.
// It initializes the authentication state from local storage or sets it to an empty object.
// The component provides a context with the current authentication state and a function to update it.
// The authentication state is saved to local storage whenever it changes.
// Additionally, the component clears the authentication state from local storage after 60 minutes to enhance security.
import {createContext, useState, useEffect, ReactNode} from "react";
import {AuthState} from "../types/auth.type";

interface AuthProps {
  children: ReactNode;
}

interface AuthContextDefault {
  auth: AuthState;
  setAuth: (a: AuthState) => void;
}

const AuthContext = createContext<AuthContextDefault>({
  auth: {},
  setAuth: () => {},
});

export function AuthProvider({children}: AuthProps) {
  // Retrieve the authentication state from local storage or set it to an empty object
  const localStorageAuthItem = localStorage.getItem("auth");
  const initialAuth =
    localStorageAuthItem !== null ? JSON.parse(localStorageAuthItem) : {};
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

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
