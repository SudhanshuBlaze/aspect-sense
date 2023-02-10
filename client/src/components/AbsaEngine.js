import axios from "axios";
import { useState } from "react";
import "../App.css";

const AbsaEngine = () => {
  const [response, setResponse] = useState({});
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async event => {
    setLoading(true);
    event.preventDefault();
    const result = await axios.get(
      `http://localhost:8000/absa?prompt=${prompt}`
    );
    setResponse(result);
    setLoading(false);
  };
  console.log(response);

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          className="form-textarea"
        />
      </form>

      <button
        type="submit"
        value="Submit"
        className="btn form-submit-button"
        onClick={handleSubmit}
      >
        Submit
      </button>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <p class="results-label">Results</p>
          <div className="display-linebreak results-container">
            {response?.data?.response}
          </div>
        </>
      )}
    </div>
  );
};

export default AbsaEngine;
