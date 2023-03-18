import React from "react";
import "./AnalyserPipeline.css";
import { Button, Form, Input } from "semantic-ui-react";

const InputField = ({ handleSubmit, setUrl, url, isLoading }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ width: "85%", padding: "10px", marginRight: "10px" }}
          placeholder="Enter url of google maps location"
        />

        <Button
          style={{ width: "15%" }}
          primary
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit url
        </Button>
      </Form.Field>
    </Form>
  );
};

export default InputField;
