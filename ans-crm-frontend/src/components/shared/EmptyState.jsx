import "./EmptyState.css";

const EmptyState = ({ title = "Nothing here yet", message = "", action }) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📭</div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {action && (
        <button className="btn btn--primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
