import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {FaUserNinja, FaCalendarAlt} from "react-icons/fa";
import {IoArrowBackCircleSharp} from "react-icons/io5";
import {BsFillSendFill} from "react-icons/bs";
import formatDate from "../services/dateUtils";
import {fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import useAuth from "../hooks/useAuth";
import styles from "./WritePost.module.css";

// Regular expression for post text validation
const TEXT_REGEX = /^(?!\s*$)(?=(?:\S\s*){10,}\S).*$/;

function WritePost() {
  // Authentication details from the useAuth hook
  const {auth, setAuth} = useAuth();

  // State variables for post text, text validity, post color, and current date
  const [postText, setPostText] = useState<string>("");
  const [isValidText, setIsValidText] = useState<boolean>(false);
  const [postColor, setPostColor] = useState<string>("#c7ebb3");
  const currentDate = new Date();

  // Navigation hook
  const navigate = useNavigate();

  // useEffect to update the validity of the post text based on the regex
  useEffect(() => {
    setIsValidText(TEXT_REGEX.test(postText));
  }, [postText]);

  // Event handler for text area input change
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  // Function to handle user logout
  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    try {
      // Call the logout API
      await fetchData(`${baseUrl}/auth/logout`, {
        method: "GET",
      });

      // Redirect to the login page
      navigate("/login");

      // Clear the auth context
      setAuth({});
    } catch (err) {
      console.error(err);
    }
  };

  // Event handler for submitting the post
  const handleSubmit = async () => {
    try {
      // Send a POST request to create a new post
      await fetchData(`${baseUrl}/posts`, {
        method: "POST",
        body: JSON.stringify({
          userId: auth.userId,
          postText,
          colorCode: postColor,
        }),
      });

      // Clear the post text and navigate to the main wall
      setPostText("");
      navigate("/mainwall");
    } catch (err) {
      // Handle errors, log them to the console
      console.error("Error:", err);
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        // If token expired or unauthorized, perform logout
        handleLogout();
      }
    }
  };

  // Event handler for changing the post color
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostColor(event.target.value);
  };

  return (
    <div className={styles.writePostContainer}>
      {/* Link to navigate back to the main wall */}
      <Link to="/mainwall" className={styles.linkContainer}>
        <div className={styles.backIconContainer}>
          <IoArrowBackCircleSharp className={styles.backIcon} />
        </div>
      </Link>
      {/* Sticky post container with dynamic background color */}
      <div
        className={styles.stickyPostContainer}
        style={{backgroundColor: postColor}}>
        {/* Sticky post header with user icon and date */}
        <div className={styles.stickyHeader}>
          <h2 className={styles.stickyUsername}>
            <FaUserNinja className={styles.stickyIcons} />
            {auth.username}
          </h2>
          <h2 className={styles.stickyUsername}>
            <FaCalendarAlt className={styles.stickyIcons} />
            {formatDate(currentDate.toISOString())}
          </h2>
        </div>
        {/* Separator between header and post text */}
        <div className={styles.separator} />
        {/* Text area for entering the post content */}
        <div className={styles.stickyTextContainer}>
          <textarea
            value={postText}
            className={styles.stickyInput}
            onChange={handleInputChange}
            placeholder="Write here..."
          />
        </div>
        {/* Sticky post footer with color options and send button */}
        <div className={styles.stickyFooter}>
          <div className={styles.footerLeft}>
            {/* Radio buttons for selecting post color */}
            <div className={styles.colorContainer}>
              <label>
                <input
                  type="radio"
                  value="#c7ebb3"
                  checked={postColor === "#c7ebb3"}
                  onChange={handleColorChange}
                />
                <span
                  className={styles.radioColor}
                  style={{backgroundColor: "#c7ebb3"}}
                />
              </label>
              <label>
                <input
                  type="radio"
                  value="#ffd5f8"
                  checked={postColor === "#ffd5f8"}
                  onChange={handleColorChange}
                />
                <span
                  className={styles.radioColor}
                  style={{backgroundColor: "#ffd5f8"}}
                />
              </label>
              <label>
                <input
                  type="radio"
                  value="#c5e8f1"
                  checked={postColor === "#c5e8f1"}
                  onChange={handleColorChange}
                />
                <span
                  className={styles.radioColor}
                  style={{backgroundColor: "#c5e8f1"}}
                />
              </label>
              <label>
                <input
                  type="radio"
                  value="#f8eaae"
                  checked={postColor === "#f8eaae"}
                  onChange={handleColorChange}
                />
                <span
                  className={styles.radioColor}
                  style={{backgroundColor: "#f8eaae"}}
                />
              </label>
            </div>
          </div>
          {/* Send button, enabled when the post text is valid */}
          {isValidText && (
            <div className={styles.stickyButtonsContainer}>
              <button
                type="button"
                className={styles.sendButton}
                onClick={handleSubmit}>
                {/* Send button icon */}
                <div className={styles.iconCircleContainer}>
                  <BsFillSendFill className={styles.penIcon} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WritePost;
