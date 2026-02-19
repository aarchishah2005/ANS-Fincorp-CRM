import useUIStore from "../../store/useUIStore";
import "./Toast.css";

const Toast = () => {
  const toast = useUIStore((s) => s.toast);
  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast__icon">
        {toast.type === "success" ? "✓" : toast.type === "error" ? "✕" : "ℹ"}
      </span>
      <span className="toast__message">{toast.message}</span>
    </div>
  );
};

export default Toast;
