import React from "react";
import "./AnalyserPipeline.css";
import { Button, Form, Dropdown } from "semantic-ui-react";

const options = [
  { key: 1, text: "Konark", value: "Konark" },
  { key: 2, text: "Puri", value: "Puri" },
  { key: 3, text: "Daringbadi", value: "Daringbadi" },
  { key: 4, text: "Gopalpur", value: "Gopalpur" },
  { key: 5, text: "Tampara", value: "Tampara" },
];

const InputField = ({ handleSubmit, setLocation, isLoading }) => {
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Field
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Dropdown
          placeholder="Select a word"
          fluid
          selection
          options={options}
          onChange={(event, data) => setLocation(data.value)}
          style={{ width: "85%", marginRight: "10px" }}
        />

        <Button
          style={{ width: "15%" }}
          primary
          loading={isLoading}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
};

export default InputField;
