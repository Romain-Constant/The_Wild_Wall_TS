// Import the CSS module for styling
import styles from "./ConfirmationModal.module.css";

// Define the props interface for ConfirmationModal component
interface ConfirmationModalProps {
  isOpen: boolean; // Flag indicating whether the modal is open
  onClose: () => void; // Function to close the modal
  onConfirm: () => void; // Function to confirm the action
  message: string; // Message to be displayed in the modal
}

// Functional component for a confirmation modal
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) {
  // If the modal is not open, return null to render nothing
  if (!isOpen) return null;

  // Render the confirmation modal content
  return (
    <div className={styles.modalContent}>
      <h2>Confirmation</h2>
      <p>{message}</p>
      <button className={styles.yesBtn} onClick={onConfirm}>
        Yes
      </button>
      <button className={styles.noBtn} onClick={onClose}>
        No
      </button>
    </div>
  );
}

// Export the ConfirmationModal component as the default export
export default ConfirmationModal;
