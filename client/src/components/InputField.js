import React, { useState } from "react";
import "../App.css";

const InputField = ({ handleSubmit, setUrl, url }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />
      <button type="submit" className="btn">
        Submit
      </button>
    </form>
  );
};

export default InputField;
