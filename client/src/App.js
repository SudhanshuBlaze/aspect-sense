import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import ReviewTable from "./components/ReviewTable";
import InputField from "./components/InputField";
import WordCloud from "./components/WordCloud";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);

  const handleSubmit = async event => {
    event.preventDefault();
    const result = await axios.get(`http://localhost:8000/?url=${url}`);

    setData({
      reviews: JSON.parse(result.data.reviews),
      positiveCloudImg: result.data.positive_wordcloud,
      negativeCloudImg: result.data.negative_wordcloud,
    });
  };

  return (
    <div className="App">
      <InputField handleSubmit={handleSubmit} setUrl={setUrl} url={url} />
      <ReviewTable data={data} />

      <WordCloud data={data} />
    </div>
  );
}

export default App;
