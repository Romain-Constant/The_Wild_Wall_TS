import styles from "./ConfirmationModal.module.css";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

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
