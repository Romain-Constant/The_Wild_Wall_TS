// ConfirmationModal component renders a confirmation dialog with 'Yes' and 'No' buttons.
// It receives props such as isOpen (to control visibility), onClose (callback for closing),
// onConfirm (callback for confirmation), and a message to display.

import styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  // Controls the visibility of the modal
  isOpen: boolean;

  // Callback function for closing the modal
  onClose: () => void;

  // Callback function for confirming the action
  onConfirm: () => void;

  // Message to be displayed in the modal
  message: string;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) {
  // If the modal is not open, render nothing
  if (!isOpen) return null;

  // Render the modal content with the provided message and buttons for confirmation and closure
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

export default ConfirmationModal;
