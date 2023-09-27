import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchData, ApiResponse} from "../api/api";
import {baseUrl} from "../api/config";
import useAuth from "../hooks/useAuth";
import AuthState from "../types/auth.type";
import styles from "./Login.module.css";

function Login() {
  const loginRef = useRef<HTMLInputElement>(null);
  const [logUsername, setLogUsername] = useState<string>("");
  const [logPassword, setLogPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {setAuth} = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    loginRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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

      setAuth({
        userId: response.data.userId,
        username: response.data.username,
        roleCode: response.data.roleCode,
      });
      setLogUsername("");
      setLogPassword("");

      // Show success toast
      /* toast.success("Login successful!", {
        className: styles.toastifySuccess,
        autoClose: 2000,
      }); */

      navigate("/mainwall");
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <div className={styles.loginPageContainer}>
      {errorMessage && (
        <p className={styles.errmsg} aria-live="assertive">
          {errorMessage}
        </p>
      )}
      <div className={styles.loginCard}>
        <div className={styles.loginCardHeader}>Login</div>
        <div className={styles.loginCardBody}>
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
          <button
            type="button"
            className={styles.loginButton}
            onClick={handleLogin}>
            Go !
          </button>
          <p className={styles.noAccountText}>
            Don't have an account ?{" "}
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
