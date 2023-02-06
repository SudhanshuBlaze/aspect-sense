import React, { useState } from "react";

const InputField = ({ handleSubmit, setUrl, url }) => {
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />
      <button
        type="submit"
        style={{
          padding: "10px",
          backgroundColor: "#4CAF50",
          color: "white",
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default InputField;
