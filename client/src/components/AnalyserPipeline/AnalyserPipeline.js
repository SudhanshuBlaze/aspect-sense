import InputField from "./InputField";
import ReviewTable from "./ReviewTable";
import WordCloud from "./WordCloud";
import axios from "axios";
import { useState } from "react";

const AnalyserPipeline = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async event => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const result = await axios.get("http://localhost:8000/pipeline", {
        params: { url },
      });

      setData({
        reviews: JSON.parse(result.data.reviews),
        positiveCloudImg: result.data.positive_wordcloud,
        negativeCloudImg: result.data.negative_wordcloud,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <InputField
        handleSubmit={handleSubmit}
        setUrl={setUrl}
        url={url}
        isLoading={isLoading}
      />
      <ReviewTable data={data} />
      <WordCloud data={data} />{" "}
    </>
  );
};

export default AnalyserPipeline;
