import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link} from "react-router-dom";
import {ApiResponse, fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import StickyPost from "../components/stickyPost/StickyPost";
import useAuth from "../hooks/useAuth";
import Post from "../types/post.type";
import styles from "./ArchivedPosts.module.css";
import ConfirmationModal from "../components/confirmationModal/ConfirmationModal";

function ArchivedPosts() {
  const {auth} = useAuth();
  const [postsList, setPostsList] = useState<Post[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

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

      // Après la suppression réussie, mettez à jour l'état postsList pour actualiser MainWall
      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Fermez la modal après la suppression
      setDeletePostId(null);
    }
  };

  useEffect(() => {
    // Générer les rotations aléatoires pour chaque post
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

  // Fonction pour ouvrir la modal de confirmation de suppression
  const openDeleteModal = (postId: number) => {
    setDeletePostId(postId);
  };

  return (
    <section className={styles.mainWallContainer}>
      {postsList.map((post, idx) => (
        <StickyPost
          key={post.postId}
          postData={post}
          onDelete={() => openDeleteModal(post.postId)} // Ouvrir la modal de confirmation
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

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        isOpen={deletePostId !== null}
        onClose={() => setDeletePostId(null)}
        onConfirm={() => {
          if (deletePostId !== null) {
            handlePostDelete(deletePostId); // Vérification de nullité avant d'appeler handlePostDelete
          }
        }}
        message="Êtes-vous sûr de vouloir supprimer ce post ?"
      />
    </section>
  );
}

export default ArchivedPosts;
