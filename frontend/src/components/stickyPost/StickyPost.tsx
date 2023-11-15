// StickyPost component renders a sticky note containing post information.
// It displays the username, post date, post text, and provides buttons for actions such as edit, archive, and delete.
// The component receives post data, handles delete and archive callbacks, rotation degree, and a flag indicating if it's an archived post.
// The buttons are conditionally rendered based on user authentication and authorization (user, admin or delegate).

import {BsFillPencilFill} from "react-icons/bs";
import {FaArchive, FaCalendarAlt, FaUserNinja} from "react-icons/fa";
import {IoIosCloseCircle} from "react-icons/io";
import {Link} from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import formatDate from "../../services/dateUtils";
import Post from "../../types/post.type";
import styles from "./StickyPost.module.css";

interface StickyPostProps {
  postData: Post;
  onDelete: () => void;
  onArchive?: () => void;
  rotation: number;
  isArchivedPost: boolean;
}

function StickyPost({
  postData,
  onDelete,
  onArchive,
  rotation,
  isArchivedPost,
}: StickyPostProps) {
  const {username, postText, postDate, statutName, userId} = postData;
  const {auth} = useAuth();
  const isUserPost = auth.userId === userId;
  const isAdmin = auth.roleCode === "2013" || auth.roleCode === "4004";

  const renderEditAndDeleteButtons = () => {
    if (isUserPost) {
      // Render edit and delete buttons for the post owner
      return (
        <div className={styles.stickyButtonsContainer}>
          {!isArchivedPost && (
            <div
              className={styles.iconCircleContainer}
              style={{
                backgroundColor:
                  statutName === "archived" ? "grey" : postData.colorCode,
              }}>
              <Link
                to={`/editpost/${postData.postId}`}
                className={styles.editLink}>
                <BsFillPencilFill className={styles.penIcon} />
              </Link>
            </div>
          )}
          {!isArchivedPost && (
            <div
              className={styles.iconCircleContainer}
              style={{
                backgroundColor:
                  statutName === "archived" ? "grey" : postData.colorCode,
              }}>
              <FaArchive className={styles.penIcon} onClick={onArchive} />
            </div>
          )}
          <div
            className={styles.iconCircleContainer}
            style={{
              backgroundColor:
                statutName === "archived" ? "grey" : postData.colorCode,
            }}>
            <IoIosCloseCircle
              className={styles.crossIcon}
              type="button"
              onClick={onDelete}
            />
          </div>
        </div>
      );
    }

    if (isAdmin) {
      // Render archive and delete buttons for admin users
      return (
        <div className={styles.stickyButtonsContainer}>
          {!isArchivedPost && (
            <div
              className={styles.iconCircleContainer}
              style={{
                backgroundColor:
                  statutName === "archived" ? "grey" : postData.colorCode,
              }}>
              <FaArchive className={styles.penIcon} onClick={onArchive} />
            </div>
          )}
          <div
            className={styles.iconCircleContainer}
            style={{
              backgroundColor:
                statutName === "archived" ? "grey" : postData.colorCode,
            }}>
            <IoIosCloseCircle
              className={styles.crossIcon}
              type="button"
              onClick={onDelete}
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      className={styles.stickyPostContainer}
      style={{
        backgroundColor:
          statutName === "archived" ? "grey" : postData.colorCode,
        transform: `rotate(${rotation}deg)`,
      }}>
      <div className={styles.stickyHeader}>
        <h2 className={styles.stickyUsername}>
          <FaUserNinja className={styles.stickyIcons} />
          {username}
        </h2>
        <h2 className={styles.stickyUsername}>
          <FaCalendarAlt className={styles.stickyIcons} />
          {formatDate(postDate)}
        </h2>
      </div>
      <div className={styles.separator} />
      <div
        className={styles.stickyTextContainer}
        style={{
          backgroundColor:
            statutName === "archived" ? "grey" : postData.colorCode,
        }}>
        <p className={styles.stickyText}>{postText}</p>
      </div>
      <div className={styles.stickyFooter}>{renderEditAndDeleteButtons()}</div>
    </div>
  );
}

export default StickyPost;
