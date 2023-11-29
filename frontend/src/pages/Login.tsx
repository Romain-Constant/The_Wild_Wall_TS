import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchData, ApiResponse} from "../api/api";
import {toast} from "react-toastify";
import {baseUrl} from "../api/config";
import useAuth from "../hooks/useAuth";
import AuthState from "../types/auth.type";
import styles from "./Login.module.css";

function Login() {
  // Ref for the login input to focus on it when the component mounts
  const loginRef = useRef<HTMLInputElement>(null);

  // State to manage the entered username and password
  const [logUsername, setLogUsername] = useState<string>("");
  const [logPassword, setLogPassword] = useState<string>("");

  // State to store and display error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Accessing the setAuth function from the useAuth hook
  const {setAuth} = useAuth();

  // Accessing the navigation function from React Router
  const navigate = useNavigate();

  // Effect to focus on the login input when the component mounts
  useEffect(() => {
    loginRef.current?.focus();
  }, []);

  // Function to handle the login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Sending a login request to the server
      const response: ApiResponse<AuthState> = await fetchData(
        `${baseUrl}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({
            username: logUsername,
            password: logPassword,
          }),
        },
      );

      // Updating the authentication state on successful login
      setAuth({
        userId: response.data.userId,
        username: response.data.username,
        roleCode: response.data.roleCode,
      });

      // Clearing the entered username and password
      setLogUsername("");
      setLogPassword("");

      // Showing a success toast notification
      toast.success("Login successful!", {
        className: styles.toastifySuccess,
        autoClose: 2000,
      });

      // Navigating to the main wall page after successful login
      navigate("/mainwall");
    } catch (err) {
      // Handling and displaying errors
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  // Rendering the login component
  return (
    <div className={styles.loginPageContainer}>
      {/* Displaying error message if present */}
      {errorMessage && (
        <p className={styles.errmsg} aria-live="assertive">
          {errorMessage}
        </p>
      )}

      <div className={styles.loginCard}>
        <div className={styles.loginCardHeader}>Login</div>

        <div className={styles.loginCardBody}>
          <form className={styles.formContainer} onSubmit={handleLogin}>
            <input
              type="text"
              id="log-username"
              ref={loginRef}
              placeholder="Username"
              autoComplete="off"
              className={styles.loginInputs}
              value={logUsername}
              onChange={e => setLogUsername(e.target.value)}
            />

            <input
              type="password"
              id="log-password"
              placeholder="Password"
              autoComplete="off"
              className={styles.loginInputs}
              value={logPassword}
              onChange={e => setLogPassword(e.target.value)}
            />

            <button type="submit" className={styles.loginButton}>
              Go!
            </button>
          </form>
          {/* Link to the registration page */}
          <p className={styles.noAccountText}>
            Don't have an account?{" "}
            <Link to="/register" className={styles.signupLinkStyle}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
