import axios from "axios";
import { useState } from "react";
import "../App.css";

const AbsaEngine = () => {
  const [response, setResponse] = useState({});
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    const result = await axios.get(
      `http://localhost:8000/absa?prompt=${prompt}`
    );
    setResponse(result);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
        />
        <button
          type="submit"
          value="Submit"
          className="btn"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </form>
      <p>Results</p>
      <div className="display-linebreak">{response?.data.response}</div>
    </>
  );
};

export default AbsaEngine;
