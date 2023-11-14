import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link, useNavigate} from "react-router-dom";
import {ApiResponse, fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import ConfirmationModal from "../components/confirmationModal/ConfirmationModal";
import StickyPost from "../components/stickyPost/StickyPost";
import useAuth from "../hooks/useAuth";
import Post from "../types/post.type";
import {useMediaQuery} from "react-responsive";
import styles from "./MainWall.module.css";

function MainWall() {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const {setAuth} = useAuth();
  const [rotations, setRotations] = useState<number[]>([]);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);
  const [archivePostId, setArchivePostId] = useState<number | null>(null);
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});
  const navigate = useNavigate();

  // Function to fetch all posts
  const fetchAllPosts = async () => {
    try {
      // Fetch posts from the server
      const response: ApiResponse<{posts: Post[]}> = await fetchData(
        `${baseUrl}/posts`,
        {
          method: "GET",
        },
      );

      // Update the local state with the fetched posts
      setPostsList(response.data.posts);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    // Fetch all posts on component mount
    fetchAllPosts();
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
      // Send a request to delete the post
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/${postId}`,
        {
          method: "DELETE",
        },
      );

      // If deletion is successful on the server, update the local post list
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
      // Close the confirmation modal after deletion
      setDeletePostId(null);
    }
  };

  // Function to handle post archiving
  const handlePostArchive = async (postId: number) => {
    try {
      // Send a request to the server to archive the post
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/archive/${postId}`,
        {
          method: "PUT",
        },
      );

      // If archiving is successful on the server, update the local post list
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
      // Handle the error here, for example, by displaying an error message to the user
    } finally {
      // Close the confirmation modal after archiving
      setArchivePostId(null);
    }
  };

  useEffect(() => {
    // Generate random rotations for each post
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

  // Function to open the archive confirmation modal
  const openArchiveModal = (postId: number) => {
    setArchivePostId(postId);
  };

  // JSX structure for the MainWall component
  return (
    <section className={styles.mainWallContainer}>
      <div className={styles.postContainer}>
        {/* Render each post using the StickyPost component */}
        {postsList.map((post, idx) => (
          <StickyPost
            key={post.postId}
            postData={post}
            onDelete={() => openDeleteModal(post.postId)}
            onArchive={() => openArchiveModal(post.postId)}
            rotation={rotations[idx]}
            isArchivedPost={false}
          />
        ))}
      </div>

      {/* Render the add post button for desktop screens */}
      {isDesktop && (
        <div className={styles.addButtonContainer}>
          <Link to="/writepost" className={styles.writepostLink}>
            <div className={styles.addPostIconContainer}>
              <BsPlusCircleFill className={styles.addPostIcon} />
            </div>
          </Link>
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={deletePostId !== null}
        onClose={() => setDeletePostId(null)}
        onConfirm={() => {
          if (deletePostId !== null) {
            handlePostDelete(deletePostId); // Check for non-null before calling handlePostDelete
          }
        }}
        message="Are you sure you want to delete this post?"
      />
      {/* Archive confirmation modal */}
      <ConfirmationModal
        isOpen={archivePostId !== null}
        onClose={() => setArchivePostId(null)}
        onConfirm={() => {
          if (archivePostId !== null) {
            handlePostArchive(archivePostId); // Check for non-null before calling handlePostArchive
          }
        }}
        message="Are you sure you want to archive this post?"
      />
    </section>
  );
}

export default MainWall;
