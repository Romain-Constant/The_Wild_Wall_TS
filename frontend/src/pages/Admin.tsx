import {useEffect, useState} from "react";
import {RxCross2} from "react-icons/rx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ApiResponse, fetchData} from "../api/api";
import {baseUrl} from "../api/config";
import ConfirmationModal from "../components/confirmationModal/ConfirmationModal";
import useAuth from "../hooks/useAuth";
import User from "../types/user.type";

import styles from "./Admin.module.css";

const Admin = () => {
  const [wilderList, setWilderList] = useState<User[]>([]);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const {setAuth} = useAuth();

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

  useEffect(() => {
    const fetchAllWilders = async () => {
      try {
        const response: ApiResponse<User[]> = await fetchData(
          `${baseUrl}/users`,
          {
            method: "GET",
          },
        );

        setWilderList(response.data);
      } catch (err) {
        console.error(err);
        if ((err as Error).message === "Token expired.") {
          handleLogout();
        }
      }
    };
    fetchAllWilders();
  }, []);

  const handleChangeRole = async (index: number, newRole: string) => {
    try {
      const updatedWilders = [...wilderList];

      updatedWilders[index].role = newRole;

      setWilderList(updatedWilders);

      const wilderId = updatedWilders[index].userId;
      await fetchData(`${baseUrl}/users/${wilderId}`, {
        method: "PUT",
        body: JSON.stringify({role: {name: newRole}}),
      });
    } catch (err) {
      console.error("Error:", err);
      if ((err as Error).message === "Token expired.") {
        handleLogout();
      }
    }
  };

  const handleDeleteWilder = async (index: number) => {
    // Ouvrir la modal de confirmation et conserver l'index
    setDeletingIndex(index);
  };

  const handleConfirmDelete = async () => {
    if (deletingIndex !== null) {
      const wilderId = wilderList[deletingIndex].userId;
      try {
        const response: ApiResponse<void> = await fetchData(
          `${baseUrl}/users/${wilderId}`,
          {
            method: "DELETE",
          },
        );

        if (response.status === 200) {
          setWilderList(prevList =>
            prevList.filter((_, i) => i !== deletingIndex),
          );

          // Affichez une alerte de succès avec react-toastify
          toast.success("Wilder deleted successfully!", {
            className: styles.toastifySuccess,
            autoClose: 2000,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        if ((err as Error).message === "Token expired.") {
          handleLogout();
        }
        // Gérez l'erreur ici, par exemple, en affichant un message d'erreur à l'utilisateur
      } finally {
        // Fermez la modal de confirmation
        setDeletingIndex(null);
      }
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <div className={styles.wilderListContainer}>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {wilderList.map((wilder, index) => (
              <tr key={wilder.userId}>
                <td>{wilder.username}</td>
                <td>
                  <select
                    value={wilder.role}
                    onChange={e => handleChangeRole(index, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="delegate">Delegate</option>
                    <option value="wilder">Wilder</option>
                  </select>
                </td>
                <td>
                  <RxCross2
                    type="button"
                    className={styles.deleteIcon}
                    onClick={() => handleDeleteWilder(index)}>
                    Delete
                  </RxCross2>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmationModal
        isOpen={deletingIndex !== null}
        onClose={() => setDeletingIndex(null)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this wilder?"
      />
    </div>
  );
};

export default Admin;
