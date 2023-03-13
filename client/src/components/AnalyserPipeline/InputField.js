import React from "react";
import "./AnalyserPipeline.css";
import SubmitButton from "../../ui/SubmitButton/SubmitButton";

const InputField = ({ handleSubmit, setUrl, url }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />

      <SubmitButton />
    </form>
  );
};

export default InputField;
