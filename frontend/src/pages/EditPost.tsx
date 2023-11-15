import {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {FaUserNinja, FaCalendarAlt} from "react-icons/fa";
import {IoArrowBackCircleSharp} from "react-icons/io5";
import {BsFillSendFill} from "react-icons/bs";
import formatDate from "../services/dateUtils";
import {fetchData, ApiResponse} from "../api/api";
import {baseUrl} from "../api/config";
import styles from "./EditPost.module.css";
import useAuth from "../hooks/useAuth";
import Post from "../types/post.type";

// Regular expression for post text validation
const TEXT_REGEX = /^(?!\s*$)(?=(?:\S\s*){10,}\S).*$/;

// Functional component for editing a post
function EditPost() {
  // Authentication context hook
  const {auth, setAuth} = useAuth();

  // State variables for post text, text validation, post color, navigation, current post, and loading state
  const [postText, setPostText] = useState<string>("");
  const [isValidText, setIsValidText] = useState<boolean>(false);
  const [postColor, setPostColor] = useState<string>("#c7ebb3");
  const navigate = useNavigate();
  const {postId} = useParams();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  // Effect hook to validate post text whenever it changes
  useEffect(() => {
    setIsValidText(TEXT_REGEX.test(postText));
  }, [postText]);

  // Effect hook to fetch the current post when the component mounts
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        // Make a GET request to the server to retrieve the current post
        const response: ApiResponse<{post: Post}> = await fetchData(
          `${baseUrl}/posts/${postId}`,
          {method: "GET"},
        );

        // Update state with the retrieved post information
        setCurrentPost(response.data.post);
        setPostText(response.data.post.postText);
        setPostColor(response.data.post.colorCode);
      } catch (err) {
        // Handle errors, log them to the console
        console.error("Error:", err);
      }
    };
    fetchPostById();
  }, [postId]);

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

  // Function to handle post submission
  const handleSubmit = async () => {
    try {
      // Make a PUT request to update the current post
      await fetchData(`${baseUrl}/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: currentPost?.postId,
          postText,
          colorCode: postColor,
        }),
      });

      // Clear the post text and navigate back to the main wall
      setPostText("");
      navigate("/mainwall");
    } catch (err) {
      // Handle errors, log them to the console
      console.error("Error:", err);
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        handleLogout();
      }
    }
  };

  // Function to handle changes in the post text input
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  // Function to handle changes in the selected post color
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostColor(event.target.value);
  };

  // JSX structure for rendering the EditPost component
  return (
    <div className={styles.writePostContainer}>
      {currentPost === null ? ( // Display during loading
        <p>Loading...</p>
      ) : currentPost.userId === auth.userId ? ( // Display if the user is authorized to edit the post
        <>
          {/* Navigation link back to the main wall */}
          <Link to="/mainwall" className={styles.linkContainer}>
            <div className={styles.backIconContainer}>
              <IoArrowBackCircleSharp className={styles.backIcon} />
            </div>
          </Link>

          {/* Edit post form container */}
          <div
            className={styles.stickyPostContainer}
            style={{backgroundColor: postColor}}>
            {/* Post header with username and post date */}
            <div className={styles.stickyHeader}>
              <h2 className={styles.stickyUsername}>
                <FaUserNinja className={styles.stickyIcons} />
                {currentPost.username}
              </h2>
              <h2 className={styles.stickyUsername}>
                <FaCalendarAlt className={styles.stickyIcons} />
                {formatDate(currentPost.postDate)}
              </h2>
            </div>
            <div className={styles.separator} />

            {/* Textarea for editing post text */}
            <div className={styles.stickyTextContainer}>
              <textarea
                value={postText}
                className={styles.stickyInput}
                onChange={handleInputChange}
                placeholder="Write here..."
              />
            </div>

            {/* Footer section with color options and send button */}
            <div className={styles.stickyFooter}>
              <div className={styles.footerLeft}>
                {/* Color options for the post */}
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

              {/* Send button, visible when the post text is valid */}
              {isValidText && (
                <div className={styles.stickyButtonsContainer}>
                  <button
                    className={styles.sendButton}
                    type="button"
                    onClick={handleSubmit}>
                    <div className={styles.iconCircleContainer}>
                      <BsFillSendFill className={styles.penIcon} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        // Display if the user is not authorized to edit the post
        <h1>You're not authorized</h1>
      )}
    </div>
  );
}

// Export the EditPost component as the default export
export default EditPost;
