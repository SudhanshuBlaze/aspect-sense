import React from "react";
import "./App.css";
import AbsaEngine from "./components/AbsaEngine/AbsaEngine";
import AnalyserPipeline from "./components/AnalyserPipeline/AnalyserPipeline";

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>
        The ultimate Aspect based sentiment analyser
      </h1>

      <AnalyserPipeline />

      <AbsaEngine />
    </div>
  );
}

export default App;
