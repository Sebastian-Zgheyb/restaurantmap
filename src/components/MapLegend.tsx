const MapLegend = () => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        background: "rgba(20, 20, 20, 0.8)", // Dark glassmorphic effect
        backdropFilter: "blur(10px)",
        padding: "14px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 255, 255, 0.2)", // Soft neon cyan glow
        fontSize: "14px",
        lineHeight: "20px",
        color: "white",
        width: "220px",
        fontFamily: "monospace", // Tech-style font
      }}
    >
      <h4
        style={{
          margin: "0 0 10px 0",
          // fontWeight: "bold",
          textAlign: "center",
          letterSpacing: "1px",
          // textTransform: "uppercase",
          color: "white", // Neon cyan title
        }}
      >
        Heatmap Legend
      </h4>

      {/* Gradient Bar */}
      <div
        style={{
          height: "14px",
          width: "100%",
          background: "linear-gradient(to right, #0ff, #0ff, #0f0, #ff0, #f00, #f00)",
          borderRadius: "6px",
          boxShadow: "0 0 12px rgba(0, 255, 255, 0.3)", // Glow effect
        }}
      ></div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginTop: "6px",
          color: "#bbb", // Soft gray text
        }}
      >
        <span style={{ color: "#0ff" }}>Low</span>
        <span style={{ color: "#0f0" }}>Medium</span>
        <span style={{ color: "#ff0" }}>High</span>
        <span style={{ color: "#f00", fontWeight: "bold" }}>Peak</span>
      </div>
    </div>
  );
};

export default MapLegend;
