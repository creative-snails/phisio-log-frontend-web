const ApiStatusBanner = () => {
  if (import.meta.env.PROD) return null;

  const isMock = import.meta.env.VITE_USE_MOCK_API === "true";
  const text = isMock ? "Using Mock API" : "Using Dev API";
  const style = {
    background: isMock ? "#c08000ff" : "#068000ff",
    color: "white",
    textAlign: "center" as const,
    padding: "3px",
    fontSize: "13px",
    fontWeight: "bold",
  };

  return <div style={style}>{text}</div>;
};

export default ApiStatusBanner;
