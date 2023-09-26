import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FormEvent, useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import styles from "./Register.module.css";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function Register() {
  const errRef = useRef<HTMLParagraphElement>(null);
  const userRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [regUsername, setRegUsername] = useState<string>("");
  const [validName, setValidName] = useState<boolean>(false);
  const [userFocus, setUserFocus] = useState<boolean>(false);

  const [regPassword, setRegPassword] = useState<string>("");
  const [validPwd, setValidPwd] = useState<boolean>(false);
  const [pwdFocus, setPwdFocus] = useState<boolean>(false);

  const [matchPwd, setMatchPwd] = useState<string>("");
  const [validMatch, setValidMatch] = useState<boolean>(false);
  const [matchFocus, setMatchFocus] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState<boolean>(false);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(regUsername));
  }, [regUsername]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(regPassword));
    setValidMatch(regPassword === matchPwd);
  }, [regPassword, matchPwd]);

  useEffect(() => {
    if (errorMessage !== "") {
      setErrorVisible(true);
    }
  }, [errorMessage]);

  const handleRegister = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    try {
      await fetchData(`${baseUrl}/users/register`, {
        method: "POST",
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
        }),
      });
      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
      errRef.current?.focus();
    }
    setRegUsername("");
    setRegPassword("");
    setMatchPwd("");
  };

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
          <p
            id="pwdnote"
            className={
              pwdFocus && !validPwd ? styles.instructions : styles.offscreen
            }>
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
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
          <p
            id="confirmnote"
            className={
              matchFocus && !validMatch ? styles.instructions : styles.offscreen
            }>
            <FontAwesomeIcon icon={faInfoCircle} />
            Must match the first password input field.
          </p>
          <button
            type="button"
            className={styles.loginButton}
            onClick={handleRegister}
            disabled={!!(!validName || !validPwd || !validMatch)}>
            Register me !
          </button>
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
