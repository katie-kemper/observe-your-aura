import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [swatches, setSwatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }
    setError(""); setLoading(true); setSwatches([]);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("consent", "true");
      const response = await axios.post("http://localhost:8080/analyze", formData, { headers: {"Content-Type": "multipart/form-data"} });
      setSwatches(response.data.swatches || []);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Is the backend running?");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <h1>Observe Your Aura</h1>
      <p>Upload a headshot to generate your color palette.</p>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <br /><br />
      <button onClick={handleUpload} disabled={loading}>{loading ? "Analyzing..." : "Analyze"}</button>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
        {swatches.map((color, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <div style={{ width: "100px", height: "100px", backgroundColor: color, borderRadius: "8px", border: "1px solid #ccc" }} />
            <p>{color}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
