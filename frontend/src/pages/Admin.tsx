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
  // State for storing the list of wilders
  const [wilderList, setWilderList] = useState<User[]>([]);

  // State for storing the index of the wilder to be deleted
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  // Navigate function for programmatic navigation
  const navigate = useNavigate();

  // Auth context to get current user information
  const {auth, setAuth} = useAuth();

  // Fetch the list of wilders on component mount
  useEffect(() => {
    const fetchAllWilders = async () => {
      try {
        const response: ApiResponse<User[]> = await fetchData(
          `${baseUrl}/users`,
          {
            method: "GET",
          },
        );

        // Update the wilder list state
        setWilderList(response.data);
      } catch (err) {
        console.error("Error:", err);
        // Handle token expiration by logging out
        if ((err as Error).message === "Token expired." || "Unauthorized") {
          handleLogout();
        }
      }
    };

    // Invoke the fetch function
    fetchAllWilders();
  }, []);

  // Function to handle user logout
  const handleLogout = async () => {
    // Delete the authentication cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    try {
      // Call the logout API
      await fetchData(`${baseUrl}/auth/logout`, {
        method: "GET",
      });

      // Redirect to the login page
      navigate("/login");

      // Clear the auth context
      setAuth({});
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Function to handle role change for a wilder
  const handleChangeRole = async (wilderId: number, newRole: string) => {
    try {
      // Call the API to update the role
      const response: ApiResponse<void> = await fetchData(
        `${baseUrl}/users/${wilderId}`,
        {
          method: "PUT",
          body: JSON.stringify({role: {name: newRole}}),
        },
      );

      // Check if the API call was successful
      if (response.status === 200) {
        // Update the role in the local state
        const updatedWilders = wilderList.map(wilder =>
          wilder.userId === wilderId ? {...wilder, role: newRole} : wilder,
        );

        // Update the state with the new roles
        setWilderList(updatedWilders);
      } else {
        // Handle the error, e.g., by displaying an error message to the user
        console.error("Failed to update role:", response.status);
      }
    } catch (err) {
      console.error("Error:", err);
      // Handle token expiration by logging out
      if ((err as Error).message === "Token expired." || "Unauthorized") {
        handleLogout();
      }
    }
  };

  // Function to handle wilder deletion
  const handleDeleteWilder = async (wilderId: number) => {
    // Open the confirmation modal and store the wilder ID
    setDeletingIndex(wilderId);
  };

  // Function to confirm wilder deletion
  const handleConfirmDelete = async () => {
    if (deletingIndex !== null) {
      try {
        // Call the API to delete the wilder
        const response: ApiResponse<void> = await fetchData(
          `${baseUrl}/users/${deletingIndex}`,
          {
            method: "DELETE",
          },
        );

        // Check if the deletion was successful
        if (response.status === 200) {
          // Update the state to remove the deleted wilder
          setWilderList(prevList =>
            prevList.filter(wilder => wilder.userId !== deletingIndex),
          );

          // Show a success alert using react-toastify
          toast.success("Wilder deleted successfully!", {
            className: styles.toastifySuccess,
            autoClose: 2000,
          });
        }
      } catch (err) {
        console.error("Error:", err);
        // Handle token expiration by logging out
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
              // Filter out the currently logged-in user
              .filter(wilder => wilder.userId !== auth.userId)
              .map(wilder => (
                <tr key={wilder.userId}>
                  <td>{wilder.username}</td>
                  <td>
                    {/* Dropdown for role selection */}
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
                    {/* Delete button */}
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

      {/* Confirmation modal for wilder deletion */}
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
