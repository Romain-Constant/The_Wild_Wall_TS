import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link, useNavigate} from "react-router-dom";
import {ApiResponse, fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import ConfirmationModal from "../components/confirmationModal/ConfirmationModal";
import StickyPost from "../components/stickyPost/StickyPost";
import Post from "../types/post.type";
import {useMediaQuery} from "react-responsive";
import styles from "./ArchivedPosts.module.css";
import useAuth from "../hooks/useAuth";

function ArchivedPosts() {
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const {setAuth} = useAuth();
  const navigate = useNavigate();

  // Function to fetch archived posts
  const fetchArchivedPosts = async () => {
    try {
      const response: ApiResponse<{posts: Post[]}> = await fetchData(
        `${baseUrl}/posts/archived`,
        {
          method: "GET",
        },
      );
      setPostsList(response.data.posts);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // useEffect to fetch archived posts on component mount
  useEffect(() => {
    fetchArchivedPosts();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
      // Logout on the server
      await fetchData(`${baseUrl}/auth/logout`, {
        method: "GET",
      });

      // Redirect to the login page and clear authentication state
      navigate("/login");
      setAuth({});
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle post deletion
  const handlePostDelete = async (postId: number) => {
    try {
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/${postId}`,
        {
          method: "DELETE",
        },
      );

      // After successful deletion, update the postsList state to refresh MainWall
      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (err) {
      console.error("Error:", err);
      // Check if the error is due to an expired token and handle accordingly
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        handleLogout();
      }
    } finally {
      // Close the modal after deletion
      setDeletePostId(null);
    }
  };

  // useEffect to generate random rotations for each post
  useEffect(() => {
    const generateRandomRotations = () => {
      const minRotation = -5;
      const maxRotation = 5;
      const randomRotations = postsList.map(() =>
        Math.floor(
          Math.random() * (maxRotation - minRotation + 1) + minRotation,
        ),
      );
      setRotations(randomRotations);
    };

    generateRandomRotations();
  }, [postsList]);

  // Function to open the delete confirmation modal
  const openDeleteModal = (postId: number) => {
    setDeletePostId(postId);
  };

  return (
    <section className={styles.mainWallContainer}>
      <div className={styles.postContainer}>
        {/* Render each archived post using the StickyPost component */}
        {postsList.map((post, idx) => (
          <StickyPost
            key={post.postId}
            postData={post}
            onDelete={() => openDeleteModal(post.postId)} // Open the delete confirmation modal
            rotation={rotations[idx]}
            isArchivedPost={true}
          />
        ))}
      </div>

      {/* Render the 'Add Post' icon only for desktop view */}
      {isDesktop && (
        <Link to="/writepost" className={styles.writepostLink}>
          <div className={styles.addPostIconContainer}>
            <BsPlusCircleFill className={styles.addPostIcon} />
          </div>
        </Link>
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deletePostId !== null}
        onClose={() => setDeletePostId(null)}
        onConfirm={() => {
          if (deletePostId !== null) {
            handlePostDelete(deletePostId); // Check for null before calling handlePostDelete
          }
        }}
        message="Are you sure you want to delete this post?"
      />
    </section>
  );
}

export default ArchivedPosts;
