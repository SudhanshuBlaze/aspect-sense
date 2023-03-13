import axios from "axios";
import { useState } from "react";
import "../AbsaEngine/AbsaEngine.css";
import SubmitButton from "../../ui/SubmitButton/SubmitButton";
import Loader from "../../ui/Loader/Loader";

const AbsaEngine = () => {
  const [response, setResponse] = useState();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await axios.get("http://localhost:8000/absa", {
        params: { prompt },
      });
      setResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={event => setPrompt(event.target.value)}
          className="form-textarea"
        />
      </form>

      <SubmitButton handleSubmit={handleSubmit} />

      {isLoading ? (
        <Loader />
      ) : (
        response &&
        response.data && (
          <>
            <p className="results-label">Results</p>
            <div className="display-linebreak results-container">
              {response.data.response}
            </div>
          </>
        )
      )}
    </div>
  );
};

export default AbsaEngine;
