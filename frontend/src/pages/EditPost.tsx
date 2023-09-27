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

function EditPost() {
  const {auth} = useAuth();
  const [postText, setPostText] = useState<string>("");
  const [postColor, setPostColor] = useState<string>("#c7ebb3");
  const navigate = useNavigate();
  const {postId} = useParams();
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response: ApiResponse<{post: Post}> = await fetchData(
          `${baseUrl}/posts/${postId}`,
          {
            method: "GET",
          },
        );

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
      await fetchData(`${baseUrl}/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: currentPost?.postId,
          postText,
          colorCode: postColor,
        }),
      });

      setPostText("");
      navigate("/mainwall");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostText(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPostColor(event.target.value);
  };

  return (
    <div className={styles.writePostContainer}>
      {currentPost === null ? ( // Affichage pendant le chargement
        <p>Loading...</p>
      ) : currentPost.userId === auth.userId ? (
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

              {postText.length > 5 && (
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
        <h1>You're not authorized</h1>
      )}
    </div>
  );
}

export default EditPost;
