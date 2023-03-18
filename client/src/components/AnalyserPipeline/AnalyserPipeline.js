import InputField from "./InputField";
import ReviewTable from "./ReviewTable";
import WordCloud from "./WordCloud";
import axios from "axios";
import { useState } from "react";
import { Container, Header, Segment } from "semantic-ui-react";
import HeaderDesc from "../../ui/HeaderDesc";

const AnalyserPipeline = () => {
  const [url, setUrl] = useState("");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async event => {
    setIsLoading(true);
    event.preventDefault();

    try {
      const result = await axios.get(
        "http://localhost:8000/scrapper_pipeline",
        {
          params: { url },
        }
      );

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
    <Container>
      <HeaderDesc
        header="Review Scraper and Analyser"
        description="Enter the URL of a Google Maps location to see reviews and generate word clouds!"
      />
      <InputField
        handleSubmit={handleSubmit}
        setUrl={setUrl}
        url={url}
        isLoading={isLoading}
      />

      <ReviewTable data={data} />

      <WordCloud data={data} />
    </Container>
  );
};

export default AnalyserPipeline;
