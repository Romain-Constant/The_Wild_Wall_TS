import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "./MainWall.module.css";
import Post from "../types/post.type";
import {fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import StickyPost from "../components/stickyPost/StickyPost";

function MainWall() {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const {auth} = useAuth();
  const [rotations, setRotations] = useState<number[]>([]);

  const fetchAllPosts = async () => {
    try {
      const response = await fetchData<{posts: Post[]}>(`${baseUrl}/posts`, {
        method: "GET",
      });

      setPostsList(response.posts);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handlePostDelete = async (postId: number) => {
    try {
      const response = (await fetchData(`${baseUrl}/posts/${postId}`, {
        method: "DELETE",
      })) as Response;

      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handlePostArchive = async (postId: number) => {
    try {
      // Archive le post localement en filtrant la liste actuelle
      setPostsList(prevPosts =>
        prevPosts.filter(post => post.postId !== postId),
      );

      // Ensuite, envoyez la demande au serveur pour archiver le post
      const response = (await fetchData(`${baseUrl}/posts/archive/${postId}`, {
        method: "PUT",
      })) as Response;

      if (response.status !== 200) {
        // Si la demande au serveur échoue, annulez la mise à jour locale
        fetchAllPosts();
      }
    } catch (err) {
      console.error("Error:", err);
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
          onArchive={() => handlePostArchive(post.postId)}
          rotation={rotations[idx]}
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

export default MainWall;
