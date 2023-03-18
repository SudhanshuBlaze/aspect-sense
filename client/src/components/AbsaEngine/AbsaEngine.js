import axios from "axios";
import { useState } from "react";
import "../AbsaEngine/AbsaEngine.css";
import { Button, Form, TextArea, Container, Select } from "semantic-ui-react";
import HeaderDesc from "../../ui/HeaderDesc";
import JSONtoString from "../../utils/JSONToString";

const AbsaEngine = () => {
  const [response, setResponse] = useState("");
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [engine, setEngine] = useState("spacy");

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await axios.get(`http://localhost:8000/${engine}_absa`, {
        params: { review },
      });

      if (engine === "spacy") {
        setResponse(JSONtoString(result.data));
      } else {
        setResponse(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="container">
      <HeaderDesc
        header="Single Review ABSA Engine. results."
        description="This tool allows you to perform aspect-based sentiment analysis (ABSA) on a single review. Simply enter your review text and select the language model you want to use: GPT or spaCy. The tool will identify the different aspects and descriptors mentioned in the review andtheir associated sentiment scores."
      />

      <Form onSubmit={handleSubmit} className="form-container">
        <h2>Enter your prompt</h2>
        <Form.Field>
          <TextArea
            value={review}
            onChange={event => setReview(event.target.value)}
            className="text-area"
          />
        </Form.Field>
        <Form.Field>
          <Select
            placeholder="Select ABSA engine"
            options={[
              { key: "spacy", text: "Custom Spacy ABSA", value: "spacy" },
              { key: "gpt", text: "GPT-3 ABSA", value: "gpt" },
            ]}
            value={engine}
            onChange={(_, data) => setEngine(data.value)}
          />
        </Form.Field>

        <Button loading={isLoading} primary onClick={handleSubmit}>
          Submit
        </Button>
      </Form>

      {response && (
        <div className="results-container">
          <h2>Results</h2>
          <div className="display-linebreak ">{response}</div>
        </div>
      )}
    </Container>
  );
};

export default AbsaEngine;
