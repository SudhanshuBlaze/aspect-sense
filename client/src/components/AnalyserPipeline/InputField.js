import React from "react";
import "./AnalyserPipeline.css";
import { Button } from "semantic-ui-react";

const InputField = ({ handleSubmit, setUrl, url, isLoading }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />

      <Button loading={isLoading} onClick={handleSubmit}>
        Submit url
      </Button>
    </form>
  );
};

export default InputField;
