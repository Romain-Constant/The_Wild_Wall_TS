import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link} from "react-router-dom";
import {ApiResponse, fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import ConfirmationModal from "../components/confirmationModal/ConfirmationModal";
import StickyPost from "../components/stickyPost/StickyPost";
import Post from "../types/post.type";
import {useMediaQuery} from "react-responsive";
import styles from "./ArchivedPosts.module.css";

// Functional component for displaying archived posts
function ArchivedPosts() {
  // Responsive design check for desktop view
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});

  // State variables for posts, post rotations, and the post to delete
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  // Function to fetch archived posts from the server
  const fetchArchivedPosts = async () => {
    try {
      // Make a GET request to the server to retrieve archived posts
      const response: ApiResponse<{posts: Post[]}> = await fetchData(
        `${baseUrl}/posts/archived`,
        {method: "GET"},
      );
      // Update the state with the retrieved posts
      setPostsList(response.data.posts);
    } catch (err) {
      // Handle errors, log them to the console
      console.error("Error:", err);
    }
  };

  // Effect hook to fetch archived posts when the component mounts
  useEffect(() => {
    fetchArchivedPosts();
  }, []);

  // Function to handle post deletion
  const handlePostDelete = async (postId: number) => {
    try {
      // Make a DELETE request to the server to delete the selected post
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/${postId}`,
        {method: "DELETE"},
      );

      // If the deletion is successful, update the postsList state to reflect the change
      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (error) {
      // Handle errors, log them to the console
      console.error("Error:", error);
    } finally {
      // Close the confirmation modal after the deletion operation
      setDeletePostId(null);
    }
  };

  // Function to open the confirmation modal for post deletion
  const openDeleteModal = (postId: number) => {
    setDeletePostId(postId);
  };

  // Effect hook to generate random rotations for each post
  useEffect(() => {
    // Function to generate random rotations within a specified range
    const generateRandomRotations = () => {
      const minRotation = -5;
      const maxRotation = 5;
      // Generate random rotations for each post and update the rotations state
      const randomRotations = postsList.map(() =>
        Math.floor(
          Math.random() * (maxRotation - minRotation + 1) + minRotation,
        ),
      );
      setRotations(randomRotations);
    };

    // Call the rotation generation function when the postsList state changes
    generateRandomRotations();
  }, [postsList]);

  // JSX structure for rendering the archived posts section
  return (
    <section className={styles.mainWallContainer}>
      <div className={styles.postContainer}>
        {/* Map through the postsList and render each post using the StickyPost component */}
        {postsList.map((post, idx) => (
          <StickyPost
            key={post.postId}
            postData={post}
            onDelete={() => openDeleteModal(post.postId)} // Open the confirmation modal for post deletion
            rotation={rotations[idx]}
            isArchivedPost={true}
          />
        ))}
      </div>

      {/* Render "Add Post" icon only for desktop view, linking to the "Write Post" page */}
      {isDesktop && (
        <Link to="/writepost" className={styles.writepostLink}>
          <div className={styles.addPostIconContainer}>
            <BsPlusCircleFill
              className={styles.addPostIcon}
              aria-label="Add Post"
            />
          </div>
        </Link>
      )}

      {/* Confirmation modal for post deletion */}
      <ConfirmationModal
        isOpen={deletePostId !== null}
        onClose={() => setDeletePostId(null)}
        onConfirm={() => {
          // Check for null before calling handlePostDelete
          if (deletePostId !== null) {
            handlePostDelete(deletePostId);
          }
        }}
        message="Are you sure you want to delete this post?"
      />
    </section>
  );
}

// Export the ArchivedPosts component as the default export
export default ArchivedPosts;
