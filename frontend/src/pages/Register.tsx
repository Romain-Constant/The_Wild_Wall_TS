import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {fetchData, ApiResponse} from "../api/api";
import {baseUrl} from "../api/config";
import styles from "./Register.module.css";

// Regular expressions for username and password validation
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
  // Refs for error message and username input
  const errRef = useRef<HTMLParagraphElement>(null);
  const userRef = useRef<HTMLInputElement>(null);

  // Navigation function from React Router
  const navigate = useNavigate();

  // State for username, its validity, and focus state
  const [regUsername, setRegUsername] = useState<string>("");
  const [validName, setValidName] = useState<boolean>(false);
  const [userFocus, setUserFocus] = useState<boolean>(false);

  // State for password, its validity, and focus state
  const [regPassword, setRegPassword] = useState<string>("");
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);

  // State for confirming password, its validity, and focus state
  const [matchPwd, setMatchPwd] = useState<string>("");
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [matchFocus, setMatchFocus] = useState<boolean>(false);

  // State for error message, and its visibility
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState<boolean>(false);

  // Focus on the username input when the component mounts
  useEffect(() => {
    userRef.current?.focus();
  }, []);

  // Update username validity based on regex test
  useEffect(() => {
    setValidName(USER_REGEX.test(regUsername));
  }, [regUsername]);

  // Update password and confirmation password validity based on regex test
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(regPassword));
    setValidMatch(regPassword === matchPwd);
  }, [regPassword, matchPwd]);

  // Show error message when there is an error
  useEffect(() => {
    if (errorMessage !== "") {
      setErrorVisible(true);
    }
  }, [errorMessage]);

  // Handle registration form submission
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Send a registration request to the server
      const response: ApiResponse<void> = await fetchData<void>(
        `${baseUrl}/users/register`,
        {
          method: "POST",
          body: JSON.stringify({
            username: regUsername,
            password: regPassword,
          }),
        },
      );

      if (response.status === 201) {
        // Show success toast
        toast.success("Register successful!", {
          className: styles.toastifySuccess,
          autoClose: 2000,
        });

        // Registration successful, navigate to the login page
        navigate("/login");
      } else {
        // Handle other status codes if needed
        setErrorMessage("Registration failed. Please check your inputs.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }

    // Reset input fields
    setRegUsername("");
    setRegPassword("");
    setMatchPwd("");
  };

  // Render the registration form component
  return (
    <div className={styles.registerPageContainer}>
      <p
        ref={errRef}
        className={errorVisible ? styles.errmsg : styles.offscreen}
        aria-live="assertive">
        {errorMessage}
      </p>
      <div className={styles.loginCard}>
        <div className={styles.loginCardHeader}>Register</div>
        <div className={styles.loginCardBody}>
          <form className={styles.formContainer} onSubmit={handleRegister}>
            <input
              type="text"
              id="reg-username"
              ref={userRef}
              placeholder="Username"
              autoComplete="off"
              className={styles.loginInputs}
              value={regUsername}
              onChange={e => setRegUsername(e.target.value)}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            {/* Instruction note for username */}
            <p
              id="uidnote"
              className={
                userFocus && regUsername && !validName
                  ? styles.instructions
                  : styles.offscreen
              }>
              <FontAwesomeIcon icon={faInfoCircle} />
              4 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letters, numbers, underscores, hyphens allowed.
            </p>
            <input
              type="password"
              id="reg-password"
              placeholder="Password"
              autoComplete="off"
              className={styles.loginInputs}
              value={regPassword}
              onChange={e => setRegPassword(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            {/* Instruction note for password */}
            <p
              id="pwdnote"
              className={
                pwdFocus && !validPwd ? styles.instructions : styles.offscreen
              }>
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              Allowed special characters:{" "}
              <span aria-label="exclamation mark">!</span>{" "}
              <span aria-label="at symbol">@</span>{" "}
              <span aria-label="hashtag">#</span>{" "}
              <span aria-label="dollar sign">$</span>{" "}
              <span aria-label="percent">%</span>
            </p>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm password"
              autoComplete="off"
              className={styles.loginInputs}
              value={matchPwd}
              onChange={e => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            {/* Instruction note for confirming password */}
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch
                  ? styles.instructions
                  : styles.offscreen
              }>
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={!!(!validName || !validPwd || !validMatch)}>
              Register me !
            </button>
          </form>
          <p className={styles.noAccountText}>
            Already have an account ?{" "}
            <Link to="/login" className={styles.signupLinkStyle}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
