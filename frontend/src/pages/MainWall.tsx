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
  // State to store the list of posts
  const [postsList, setPostsList] = useState<Post[]>([]);

  // Accessing setAuth function from the useAuth hook
  const {setAuth} = useAuth();

  // State to store random rotations for each post
  const [rotations, setRotations] = useState<number[]>([]);

  // State to store the post ID for deletion confirmation modal
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  // State to store the post ID for archive confirmation modal
  const [archivePostId, setArchivePostId] = useState<number | null>(null);

  // Media query for checking if the screen size is desktop
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});

  // Accessing the navigation function from React Router
  const navigate = useNavigate();

  // Function to fetch all posts from the server
  const fetchAllPosts = async () => {
    try {
      // Send a request to the server to get all posts
      const response: ApiResponse<{posts: Post[]}> = await fetchData(
        `${baseUrl}/posts`,
        {
          method: "GET",
        },
      );

      // Update the local state with the retrieved posts
      setPostsList(response.data.posts);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Effect to fetch all posts when the component mounts
  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
      // Send a logout request to the server
      await fetchData(`${baseUrl}/auth/logout`, {
        method: "GET",
      });

      // Navigate to the login page
      navigate("/login");

      // Clear the authentication state
      setAuth({});
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle post deletion
  const handlePostDelete = async (postId: number) => {
    try {
      // Send a request to the server to delete the post
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/${postId}`,
        {
          method: "DELETE",
        },
      );

      // If deletion is successful on the server, update the local list of posts
      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (err) {
      console.error("Error:", err);
      // Check if the error is due to an expired token and handle logout
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        handleLogout();
      }
    } finally {
      // Close the modal after deletion
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

      // If archiving is successful on the server, update the local list of posts
      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (err) {
      console.error("Error:", err);
      // Check if the error is due to an expired token and handle logout
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        handleLogout();
      }
      // Handle the error here, for example, by displaying an error message to the user
    } finally {
      // Close the modal after archiving
      setArchivePostId(null);
    }
  };

  // Effect to generate random rotations for each post
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

  // Function to open the archive confirmation modal
  const openArchiveModal = (postId: number) => {
    setArchivePostId(postId);
  };

  // Render the main wall component
  return (
    <section className={styles.mainWallContainer}>
      <div className={styles.postContainer}>
        {postsList.map((post, idx) => (
          <StickyPost
            key={post.postId}
            postData={post}
            onDelete={() => openDeleteModal(post.postId)} // Open the delete confirmation modal
            onArchive={() => openArchiveModal(post.postId)} // Open the archive confirmation modal
            rotation={rotations[idx]}
            isArchivedPost={false}
          />
        ))}
      </div>
      {isDesktop && (
        <div className={styles.addButtonContainer}>
          <Link to="/writepost" className={styles.writepostLink}>
            <div className={styles.addPostIconContainer}>
              <BsPlusCircleFill
                className={styles.addPostIcon}
                aria-label="Add Post"
              />
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
            handlePostDelete(deletePostId); // Check for nullability before calling handlePostDelete
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
            handlePostArchive(archivePostId); // Check for nullability before calling handlePostArchive
          }
        }}
        message="Are you sure you want to archive this post?"
      />
    </section>
  );
}

export default MainWall;
