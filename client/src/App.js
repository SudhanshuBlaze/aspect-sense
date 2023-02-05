import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = async event => {
    event.preventDefault();
    const result = await axios.get(`http://localhost:8000/?url=${url}`);
    setData(result.data);
  };

  console.log(data);

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ width: "80%", padding: "10px", marginRight: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Submit
        </button>
      </form>
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Review</th>
              <th>Ratings</th>
              <th>Segmented Reviews</th>
              <th>Aspect with Description</th>
              <th>Aspect with Polarity</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.reviews}</td>
                <td>{row.ratings}</td>
                <td>[{row.segmented_reviews.toString()}]</td>

                <td>[{JSON.stringify(row.aspect_with_description)}]</td>
                <td>[{JSON.stringify(row.aspect_with_polarity)}]</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
