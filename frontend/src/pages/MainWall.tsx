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

  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    try {
      await fetchData(`${baseUrl}/auth/logout`, {
        method: "GET",
      });

      navigate("/login");

      setAuth({});
    } catch (err) {
      console.error(err);
    }
  };

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
      if ((err as Error).message === "Token expired.") {
        handleLogout();
      }
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
      if ((err as Error).message === "Token expired.") {
        handleLogout();
      }
      // Gérez l'erreur ici, par exemple, en affichant un message d'erreur à l'utilisateur
    } finally {
      // Fermez la modal après la suppression
      setArchivePostId(null);
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

  // Fonction pour ouvrir la modal de confirmation pour l'archivage
  const openArchiveModal = (postId: number) => {
    setArchivePostId(postId);
  };

  return (
    <section className={styles.mainWallContainer}>
      <div className={styles.postContainer}>
        {postsList.map((post, idx) => (
          <StickyPost
            key={post.postId}
            postData={post}
            onDelete={() => openDeleteModal(post.postId)} // Ouvrir la modal de confirmation
            onArchive={() => openArchiveModal(post.postId)}
            rotation={rotations[idx]}
            isArchivedPost={false}
          />
        ))}
      </div>
      {isDesktop && (
        <div className={styles.addButtonContainer}>
          <Link to="/writepost" className={styles.writepostLink}>
            <div className={styles.addPostIconContainer}>
              <BsPlusCircleFill className={styles.addPostIcon} />
            </div>
          </Link>
        </div>
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
        message="Are you sure you want to delete this post?"
      />
      {/* Modal de confirmation pour l'archivage */}
      <ConfirmationModal
        isOpen={archivePostId !== null}
        onClose={() => setArchivePostId(null)}
        onConfirm={() => {
          if (archivePostId !== null) {
            handlePostArchive(archivePostId); // Vérification de nullité avant d'appeler handlePostArchive
          }
        }}
        message="Are you sure you want to archive this post?"
      />
    </section>
  );
}

export default MainWall;
