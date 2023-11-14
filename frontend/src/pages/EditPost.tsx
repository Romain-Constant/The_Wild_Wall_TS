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

const TEXT_REGEX = /^(?=(?:\S\s*){10,}\S$).*$/;

function EditPost() {
  const {auth} = useAuth();
  const [postText, setPostText] = useState<string>("");
  const [isValidText, setIsValidText] = useState<boolean>(false);
  const [postColor, setPostColor] = useState<string>("#c7ebb3");
  const navigate = useNavigate();
  const {postId} = useParams();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  useEffect(() => {
    // Update the validity of the post text whenever it changes
    setIsValidText(TEXT_REGEX.test(postText));
  }, [postText]);

  useEffect(() => {
    // Fetch post data when the component mounts
    const fetchPostById = async () => {
      try {
        const response: ApiResponse<{post: Post}> = await fetchData(
          `${baseUrl}/posts/${postId}`,
          {
            method: "GET",
          },
        );

        // Set the current post and update the text and color state
        setCurrentPost(response.data.post);
        setPostText(response.data.post.postText);
        setPostColor(response.data.post.colorCode);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchPostById();
  }, [postId]);

  const handleSubmit = async () => {
    try {
      // Update the post on the server using a PUT request
      await fetchData(`${baseUrl}/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: currentPost?.postId,
          postText,
          colorCode: postColor,
        }),
      });

      // Reset the post text and navigate back to the main wall
      setPostText("");
      navigate("/mainwall");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the post text state when the input changes
    setPostText(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Update the post color state when the color input changes
    setPostColor(event.target.value);
  };

  return (
    <div className={styles.writePostContainer}>
      {currentPost === null ? ( // Display loading message during data retrieval
        <p>Loading...</p>
      ) : currentPost.userId === auth.userId ? ( // Display edit form if authorized
        <>
          <Link to="/mainwall" className={styles.linkContainer}>
            <div className={styles.backIconContainer}>
              <IoArrowBackCircleSharp className={styles.backIcon} />
            </div>
          </Link>
          <div
            className={styles.stickyPostContainer}
            style={{backgroundColor: postColor}}>
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
            <div className={styles.stickyTextContainer}>
              <textarea
                value={postText}
                className={styles.stickyInput}
                onChange={handleInputChange}
                placeholder="Write here..."
              />
            </div>
            <div className={styles.stickyFooter}>
              <div className={styles.footerLeft}>
                <div className={styles.colorContainer}>
                  {/* Radio buttons for selecting post color */}
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
              {/* Display send button if the text is valid */}
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
        // Display unauthorized message if the user is not the owner of the post
        <h1>You're not authorized</h1>
      )}
    </div>
  );
}

export default EditPost;
