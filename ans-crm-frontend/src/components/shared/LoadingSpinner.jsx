import "./LoadingSpinner.css";

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
    </div>
  );
};

export default LoadingSpinner;
