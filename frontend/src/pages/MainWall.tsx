import {useEffect, useState} from "react";
import {BsPlusCircleFill} from "react-icons/bs";
import {Link} from "react-router-dom";
import useAuth from "../hooks/useAuth";
import styles from "./MainWall.module.css";
import Post from "../types/post.type";
import {fetchData, ApiResponse} from "../api/api";
import ConfirmationModal from "../components/confirmationModal/ConfirmationModal";
import {baseUrl} from "../api/config";
import StickyPost from "../components/stickyPost/StickyPost";

function MainWall() {
  const [postsList, setPostsList] = useState<Post[]>([]);
  const {auth} = useAuth();
  const [rotations, setRotations] = useState<number[]>([]);
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  const fetchAllPosts = async () => {
    try {
      const response: ApiResponse<{posts: Post[]}> = await fetchData(
        `${baseUrl}/posts`,
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
    fetchAllPosts();
  }, []);

  const handlePostDelete = async (postId: number) => {
    try {
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/${postId}`,
        {
          method: "DELETE",
        },
      );

      if (response.status === 200) {
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      // Fermez la modal après la suppression
      setDeletePostId(null);
    }
  };

  const handlePostArchive = async (postId: number) => {
    try {
      // Envoyez la demande au serveur pour archiver le post
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/posts/archive/${postId}`,
        {
          method: "PUT",
        },
      );

      if (response.status === 200) {
        // Si l'archivage réussit sur le serveur, mettez à jour localement la liste des posts
        setPostsList(prevPosts =>
          prevPosts.filter(post => post.postId !== postId),
        );
      }
    } catch (err) {
      console.error("Error:", err);
      // Gérez l'erreur ici, par exemple, en affichant un message d'erreur à l'utilisateur
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
          onArchive={() => handlePostArchive(post.postId)}
          rotation={rotations[idx]}
          isArchivedPost={false}
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

export default MainWall;
