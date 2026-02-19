import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: "16px",
          fontFamily: "Inter, sans-serif",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
        }}>
          <h2 style={{ fontSize: "24px", fontWeight: "700" }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "14px", opacity: 0.9 }}>
            {this.state.error?.message}
          </p>
          <button
            className="btn btn--primary"
            onClick={() => window.location.reload()}
            style={{
              background: "#fff",
              color: "#667eea",
              padding: "12px 24px",
              borderRadius: "10px",
              border: "none",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
