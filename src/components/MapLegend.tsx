// Legend component
const MapLegend = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "320px", // Position at bottom-right
          left: "5px",
          backgroundColor: "rgba(255,255,255,0.5)",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          fontSize: "14px",
          lineHeight: "24px",
          color:"black",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0", fontWeight: "bold", textAlign:"center" }}>Legend</h4>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "20px", height: "20px", backgroundColor: "green", marginRight: "8px", borderRadius: "50%" }}></div>
          Excellent Rated Restaurants
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "20px", height: "20px", backgroundColor: "blue", marginRight: "8px", borderRadius: "50%" }}></div>
          Good Rated Restaurants
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "20px", height: "20px", backgroundColor: "orange", marginRight: "8px", borderRadius: "50%" }}></div>
          Poor Rated Restaurants
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "20px", height: "20px", backgroundColor: "red", marginRight: "8px", borderRadius: "50%" }}></div>
          Terrible Rated Restaurants
        </div>
      </div>
    );
  };

  export default MapLegend;
  