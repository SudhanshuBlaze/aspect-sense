import InputField from "./InputField";
import ReviewTable from "./ReviewTable";
import WordCloud from "./WordCloud";
import axios from "axios";
import { useState, useEffect } from "react";
import { Container } from "semantic-ui-react";
import HeaderDesc from "../../ui/HeaderDesc";
import MenuRight from "../../pages/Home/MenuRight";
import "../../pages/Home/Home.css";
import "./AnalyserPipeline.css";


const AnalyserPipeline = () => {
  const [location, setLocation] = useState("");
  const [data, setData] = useState({ reviews: [], positiveCloudImg: "", negativeCloudImg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [activeLocations, setActiveLocations] = useState(["Konark", "Puri", "Daringbadi", "Gopalpur", "Tampara"]);
  const [dbStats, setDbStats] = useState({});

  const fetchActiveLocationsAndStats = async () => {
    try {
      const res = await axios.get("http://localhost:8000/active_locations");
      if (res.data) {
        if (res.data.active_locations) {
          setActiveLocations(res.data.active_locations);
        }
        setDbStats(res.data.database_totals || {});
      }
    } catch (e) {
      console.error("Could not fetch active locations stats", e);
    }
  };

  useEffect(() => {
    fetchActiveLocationsAndStats();
    const interval = setInterval(fetchActiveLocationsAndStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAddActiveLocation = async (newLoc) => {
    try {
      const res = await axios.post(`http://localhost:8000/add_active_location?location=${encodeURIComponent(newLoc)}`);
      if (res.data && res.data.status) {
        setActiveLocations(res.data.status.active_locations || []);
        setDbStats(res.data.status.database_totals || {});
      }
    } catch (err) {
      console.error("Error adding active location:", err);
    }
  };

  const handleRemoveActiveLocation = async (locToRemove) => {
    try {
      const res = await axios.post(`http://localhost:8000/remove_active_location?location=${encodeURIComponent(locToRemove)}`);
      if (res.data && res.data.status) {
        setActiveLocations(res.data.status.active_locations || []);
        setDbStats(res.data.status.database_totals || {});
      }
    } catch (err) {
      console.error("Error removing active location:", err);
    }
  };

  const handleSubmit = async (event, overrideLocation) => {
    if (event && event.preventDefault) event.preventDefault();
    const query = (overrideLocation || location || "").trim();
    if (!query) return;

    setIsLoading(true);
    setData({ reviews: [], positiveCloudImg: "", negativeCloudImg: "" });

    try {
      const response = await fetch(
        `http://localhost:8000/stream_scrapper_pipeline?location=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const payload = JSON.parse(line.replace("data: ", ""));
              if (payload.batch && payload.batch.length > 0) {
                setData(prev => ({
                  reviews: [...(prev.reviews || []), ...payload.batch],
                  positiveCloudImg: payload.positive_wordcloud || prev.positiveCloudImg,
                  negativeCloudImg: payload.negative_wordcloud || prev.negativeCloudImg,
                }));
              }
            } catch (err) {
              console.error("Error parsing stream chunk:", err);
            }
          }
        }
      }
    } catch (error) {
      console.error("Stream error, falling back to standard batch API:", error);
      try {
        const result = await axios.get("http://localhost:8000/scrapper_pipeline", {
          params: { location: query },
        });
        const reviewsParsed = typeof result.data.reviews === "string" ? JSON.parse(result.data.reviews) : result.data.reviews;
        setData({
          reviews: reviewsParsed,
          positiveCloudImg: result.data.positive_wordcloud,
          negativeCloudImg: result.data.negative_wordcloud,
        });
      } catch (fallbackErr) {
        console.error(fallbackErr);
      }
    } finally {
      setIsLoading(false);
      fetchActiveLocationsAndStats();
    }
  };

  const activeLocKey = location.trim();
  const storedDbCount = dbStats[activeLocKey] || dbStats[activeLocKey.toLowerCase()] || 0;

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Container>
        <MenuRight />
      </Container>
      <Container className="pipeline-container">
        <HeaderDesc
          header="Review Scraper & Real-Time Analyser"
          description="Enter a location query or paste a Google Maps URL to stream reviews in real time, auto-queue continuous background extraction, and store reviews permanently in the Database."
        />

      <InputField
        handleSubmit={handleSubmit}
        setLocation={setLocation}
        location={location}
        isLoading={isLoading}
        activeLocations={activeLocations}
        dbStats={dbStats}
        onAddActiveLocation={handleAddActiveLocation}
        onRemoveActiveLocation={handleRemoveActiveLocation}
      />

      {location && (
        <div style={{
          margin: "1rem 0",
          padding: "0.9rem 1.35rem",
          borderRadius: 12,
          background: "rgba(99,102,241,0.18)",
          border: "1px solid rgba(99,102,241,0.35)",
          color: "#e0e7ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "0.92rem",
          fontWeight: 700,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 8px #6366f1", display: "inline-block" }} />
            Continuously monitoring <em style={{ marginLeft: 6, color: "#ffffff", fontStyle: "normal", fontWeight: 800 }}>"{location}"</em>
          </div>
          <div style={{ color: storedDbCount > 0 ? "#a5b4fc" : "#34d399", fontWeight: 800, fontSize: "0.92rem" }}>
            {storedDbCount > 0 ? `💾 ${storedDbCount} reviews in DB` : "⚡ Extracting to DB…"}
          </div>
        </div>
      )}


      {isLoading && (
        <div className="streaming-status-bar">
          <div className="status-badge">
            <span className="pulse-dot"></span>
            <span>Live Streaming Reviews & Storing in DB...</span>
          </div>
          <div>
            <strong>{data.reviews.length}</strong> reviews loaded
          </div>
        </div>
      )}

        <ReviewTable data={data} />

        <WordCloud data={data} />
      </Container>
    </div>
  );
};

export default AnalyserPipeline;

