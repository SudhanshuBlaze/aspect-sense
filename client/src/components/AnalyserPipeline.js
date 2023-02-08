import InputField from "./InputField";
import ReviewTable from "./ReviewTable";
import WordCloud from "./WordCloud";
import axios from "axios";
import { useState } from "react";

const AnalyserPipeline = ({}) => {
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
    <>
      <InputField handleSubmit={handleSubmit} setUrl={setUrl} url={url} />
      <ReviewTable data={data} />
      <WordCloud data={data} />
    </>
  );
};

export default AnalyserPipeline;
