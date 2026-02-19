import useUIStore from "../../store/useUIStore";
import "./ConfirmModal.css";

const ConfirmModal = () => {
  const { confirmModal, hideConfirm } = useUIStore();
  if (!confirmModal) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    hideConfirm();
  };

  return (
    <div className="modal-overlay" onClick={hideConfirm}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Are you sure?</h3>
        <p className="modal-message">{confirmModal.message}</p>
        <div className="modal-actions">
          <button className="btn btn--ghost" onClick={hideConfirm}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
