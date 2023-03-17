import axios from "axios";
import { useState } from "react";
import "../AbsaEngine/AbsaEngine.css";
import { Button, Form, TextArea, Container, Select } from "semantic-ui-react";

const AbsaEngine = () => {
  const [response, setResponse] = useState({});
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [engine, setEngine] = useState("spacy");

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await axios.get(`http://localhost:8000/${engine}_absa`, {
        params: { prompt },
      });
      setResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEngineChange = (event, data) => {
    setEngine(data.value);
  };

  return (
    <Container className="container">
      <Form onSubmit={handleSubmit} className="form-container">
        <h2>Enter your prompt</h2>
        <Form.Field>
          <TextArea
            value={prompt}
            onChange={event => setPrompt(event.target.value)}
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
            onChange={handleEngineChange}
          />
        </Form.Field>

        <Button loading={isLoading} primary onClick={handleSubmit}>
          Submit
        </Button>
      </Form>

      {response.data && (
        <div className="results-container">
          <h2>Results</h2>
          <div className="display-linebreak ">{response.data}</div>
        </div>
      )}
    </Container>
  );
};

export default AbsaEngine;
