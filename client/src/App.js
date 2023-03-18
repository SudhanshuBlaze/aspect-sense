import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AbsaEngine from "./components/AbsaEngine/AbsaEngine";
import AnalyserPipeline from "./components/AnalyserPipeline/AnalyserPipeline";
import Home from "./components/Home/Home";
import "semantic-ui-css/semantic.min.css";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scrapper_pipeline" element={<AnalyserPipeline />} />
          <Route path="/single_review" element={<AbsaEngine />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
