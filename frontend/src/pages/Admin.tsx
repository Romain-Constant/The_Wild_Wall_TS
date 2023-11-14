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
  const {auth, setAuth} = useAuth();

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
        if ((err as Error).message === "Token expired." || "Unauthorized") {
          handleLogout();
        }
      }
    };
    fetchAllWilders();
  }, []);

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

  const handleChangeRole = async (wilderId: number, newRole: string) => {
    try {
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/users/${wilderId}`,
        {
          method: "PUT",
          body: JSON.stringify({role: {name: newRole}}),
        },
      );

      if (response.status === 200) {
        // Update local wilder List only if the request was successful
        const updatedWilders = wilderList.map(wilder =>
          wilder.userId === wilderId ? {...wilder, role: newRole} : wilder,
        );
        setWilderList(updatedWilders);
      } else {
        // Handle other status codes if needed
        console.error("Update failed:", response.data);
      }
    } catch (err) {
      console.error("Error:", err);
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        handleLogout();
      }
    }
  };

  const handleDeleteWilder = async (wilderId: number) => {
    // Open the confirmation modal and keep the ID
    setDeletingIndex(wilderId);
  };

  const handleConfirmDelete = async () => {
    if (deletingIndex !== null) {
      try {
        const response: ApiResponse<void> = await fetchData(
          `${baseUrl}/users/${deletingIndex}`,
          {
            method: "DELETE",
          },
        );

        if (response.status === 200) {
          setWilderList(prevList =>
            prevList.filter(wilder => wilder.userId !== deletingIndex),
          );

          // Show a success alert with react-toastify
          toast.success("Wilder deleted successfully!", {
            className: styles.toastifySuccess,
            autoClose: 2000,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        if ((err as Error).message === "Token expired." || "Unauthorized") {
          handleLogout();
        }
      } finally {
        // Close the confirmation modal
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
              <th></th>
            </tr>
          </thead>
          <tbody className={styles.tableBodyContainer}>
            {wilderList
              .filter(wilder => wilder.userId !== auth.userId)
              .map(wilder => (
                <tr key={wilder.userId}>
                  <td>{wilder.username}</td>
                  <td>
                    <select
                      value={wilder.role}
                      onChange={e => {
                        if (wilder.userId !== undefined) {
                          handleChangeRole(wilder.userId, e.target.value);
                        }
                      }}>
                      <option value="admin">Admin</option>
                      <option value="delegate">Delegate</option>
                      <option value="wilder">Wilder</option>
                    </select>
                  </td>
                  <td>
                    <RxCross2
                      type="button"
                      className={styles.deleteIcon}
                      onClick={() => {
                        if (wilder.userId !== undefined) {
                          handleDeleteWilder(wilder.userId);
                        }
                      }}>
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
