import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link} from "react-router-dom";
import {ApiResponse, fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import StickyPost from "../components/stickyPost/StickyPost";
import useAuth from "../hooks/useAuth";
import Post from "../types/post.type";
import styles from "./ArchivedPosts.module.css";

function ArchivedPosts() {
  const {auth} = useAuth();
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);

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

  useEffect(() => {
    fetchArchivedPosts();
  }, []);

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
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Générer les rotations aléatoires pour chaque post
    const generateRandomRotations = () => {
      const minRotation = -5;
      const maxRotation = 5;
      const randomRotations = postsList.map(
        () =>
          Math.floor(Math.random() * (maxRotation - minRotation + 1)) +
          minRotation,
      );
      setRotations(randomRotations);
    };

    generateRandomRotations();
  }, [postsList]);

  return (
    <section className={styles.mainWallContainer}>
      {postsList.map((post, idx) => (
        <StickyPost
          key={post.postId}
          postData={post}
          onDelete={() => handlePostDelete(post.postId)}
          rotation={rotations[idx]}
          isArchivedPost={true}
        />
      ))}
      {Object.keys(auth).length !== 0 ? (
        <Link to="/writepost" className={styles.writepostLink}>
          <div className={styles.addPostIconContainer}>
            <BsPlusCircleFill className={styles.addPostIcon} />
          </div>
        </Link>
      ) : (
        <Link to="/login" className={styles.writepostLink}>
          <div className={styles.addPostIconContainer}>
            <BsPlusCircleFill className={styles.addPostIcon} />
          </div>
        </Link>
      )}
    </section>
  );
}

export default ArchivedPosts;
