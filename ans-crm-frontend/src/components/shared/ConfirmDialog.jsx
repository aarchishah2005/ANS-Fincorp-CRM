// components/shared/ConfirmDialog.jsx
// ── THIS WAS THE MISSING PIECE CAUSING DELETE TO NOT WORK ─────────────────
// showConfirm() sets state in useUIStore but this component was never created,
// so the dialog never rendered, and onConfirm() was never called.
// Add <ConfirmDialog /> once inside your Layout or App root.

import useUIStore from "../../store/useUIStore";
import "./ConfirmDialog.css";

const ConfirmDialog = () => {
  const { confirm, clearConfirm } = useUIStore();

  if (!confirm) return null;

  const handleConfirm = () => {
    confirm.onConfirm();
    clearConfirm();
  };

  const handleCancel = () => {
    clearConfirm();
  };

  return (
    <div className="confirm-overlay" onClick={handleCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog__icon">⚠️</div>
        <div className="confirm-dialog__message">{confirm.message}</div>
        <div className="confirm-dialog__actions">
          <button className="btn btn--ghost" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn btn--danger" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;