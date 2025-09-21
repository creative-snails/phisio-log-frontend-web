const ApiStatusBanner = () => {
  if (import.meta.env.PROD) return null;

  const useMock = import.meta.env.VITE_USE_MOCK_API === "true";
  const text = useMock ? "🔧 Development Mode • Using Mock API" : "⚡ Development Mode • Using Dev API";

  const style = {
    width: "100%",
    background: useMock
      ? "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)" // Warm pastel yellow/amber
      : "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)", // Cool pastel green
    color: useMock ? "#92400e" : "#166534", // Darker text for contrast
    textAlign: "center" as const,
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: "500",
    letterSpacing: "0.025em",
    borderBottom: useMock ? "1px solid rgba(245, 158, 11, 0.2)" : "1px solid rgba(34, 197, 94, 0.2)",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  };

  return <div style={style}>{text}</div>;
};

export default ApiStatusBanner;
