import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {fetchData} from "../api/api";
import AuthState from "../types/auth.type";
import {baseUrl} from "../api/config";
import styles from "./Login.module.css";

function Login() {
  const [logUsername, setLogUsername] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {setAuth} = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchData<AuthState>(`${baseUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          username: logUsername,
          password: logPassword,
        }),
      });

      setAuth({
        userId: response.userId,
        username: response.username,
        roleCode: response.roleCode,
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
