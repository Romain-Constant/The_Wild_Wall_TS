import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchData, ApiResponse} from "../api/api";
import {toast} from "react-toastify";
import {baseUrl} from "../api/config";
import useAuth from "../hooks/useAuth";
import AuthState from "../types/auth.type";
import styles from "./Login.module.css";

function Login() {
  // Creating a ref for the login input
  const loginRef = useRef<HTMLInputElement>(null);

  // State variables for username, password, and error message
  const [logUsername, setLogUsername] = useState<string>("");
  const [logPassword, setLogPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Using the custom hook for authentication
  const {setAuth} = useAuth();

  // Using the navigate function from react-router-dom
  const navigate = useNavigate();

  // Effect to focus on the login input when the component mounts
  useEffect(() => {
    loginRef.current?.focus();
  }, []);

  // Function to handle the login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Making an API request to the login endpoint
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

      // Checking the response status
      if (response.status === 200) {
        // Setting authentication state with user information
        setAuth({
          userId: response.data.userId,
          username: response.data.username,
          roleCode: response.data.roleCode,
        });
        // Clearing the input fields
        setLogUsername("");
        setLogPassword("");

        // Showing a success toast notification
        toast.success("Login successful!", {
          className: styles.toastifySuccess,
          autoClose: 2000,
        });

        // Navigating to the main wall page
        navigate("/mainwall");
      } else {
        // Handling other status codes if needed
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (err) {
      // Handling errors during the API request
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    // Main container for the login page
    <div className={styles.loginPageContainer}>
      {/* Displaying error message if present */}
      {errorMessage && (
        <p className={styles.errmsg} aria-live="assertive">
          {errorMessage}
        </p>
      )}
      {/* Login card containing the form */}
      <div className={styles.loginCard}>
        {/* Header of the login card */}
        <div className={styles.loginCardHeader}>Login</div>
        {/* Body of the login card */}
        <div className={styles.loginCardBody}>
          {/* Form for username, password, and submit button */}
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
          {/* Text for creating a new account */}
          <p className={styles.noAccountText}>
            Don't have an account? {/* Link to the registration page */}
            <Link to="/register" className={styles.signupLinkStyle}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Exporting the Login component as the default export
export default Login;
