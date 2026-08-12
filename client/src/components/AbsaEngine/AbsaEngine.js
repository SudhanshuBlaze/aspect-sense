import axios from "axios";
import { useState } from "react";
import "./AbsaEngine.css";
import MenuRight from "../../pages/Home/MenuRight";
import HeaderDesc from "../../ui/HeaderDesc";
import { Container } from "semantic-ui-react";

const CATEGORY_COLORS = {
  "Service":           { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" },
  "Cleanliness":       { bg: "rgba(6,182,212,0.12)",   color: "#22d3ee" },
  "Food & Beverage":   { bg: "rgba(245,158,11,0.12)",  color: "#fbbf24" },
  "Value & Pricing":   { bg: "rgba(139,92,246,0.12)",  color: "#a78bfa" },
  "Amenities":         { bg: "rgba(14,165,233,0.12)",  color: "#38bdf8" },
  "Location":          { bg: "rgba(20,184,166,0.12)",  color: "#2dd4bf" },
  "Vibe & Atmosphere": { bg: "rgba(168,85,247,0.12)",  color: "#c084fc" },
  "General":           { bg: "rgba(100,116,139,0.12)", color: "#94a3b8" },
};

const ENGINES = [
  { key: "hf",    label: "Hugging Face", subtitle: "RoBERTa Transformer", icon: "🤗" },
  { key: "spacy", label: "spaCy",        subtitle: "Dependency Parsing",  icon: "🧠" },
];

const SAMPLE_REVIEWS = [
  "The swimming pool was extremely clean and well maintained. Room service was very prompt and helpful.",
  "Seafood at the restaurant was absolutely delicious, but the taxi service was overpriced.",
  "Beautiful beach view from the resort balcony. The staff was warm and friendly.",
];

const AbsaEngine = () => {
  const [response, setResponse] = useState(null);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [engine, setEngine] = useState("hf");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!review.trim()) return;
    setIsLoading(true);
    setResponse(null);
    try {
      const result = await axios.get(`http://localhost:8000/${engine}_absa`, {
        params: { review },
      });
      setResponse(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error(error);
      setResponse([]);
    } finally {
      setIsLoading(false);
    }
  };

  const polarityLabel = (p) => {
    if (p == null) return { label: "—", color: "#64748b" };
    if (p >= 0.5 || p >= 7)  return { label: "Positive", color: "#34d399" };
    if (p <= -0.3 || p <= 3) return { label: "Negative", color: "#fb7185" };
    return { label: "Neutral", color: "#fbbf24" };
  };

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh" }}>
      <Container>
        <MenuRight />
      </Container>

      <Container style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
        <HeaderDesc
          header="Single Review ABSA Engine"
          description="Paste any customer review and choose your NLP engine to extract fine-grained aspect-descriptor pairs, domain categories, and sentiment polarity scores."
        />

        <div className="absa-split-layout">
          {/* === LEFT PANEL: Input === */}
          <div className="absa-input-panel">
            {/* Engine Toggle */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#f8fafc", fontSize: "0.92rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                Analysis Engine
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {ENGINES.map(eng => (
                  <button
                    key={eng.key}
                    onClick={() => setEngine(eng.key)}
                    style={{
                      flex: 1,
                      background: engine === eng.key
                        ? "linear-gradient(135deg, rgba(99,102,241,0.32), rgba(139,92,246,0.25))"
                        : "rgba(30,41,59,0.75)",
                      border: engine === eng.key
                        ? "2px solid #6366f1"
                        : "1px solid rgba(148,163,184,0.25)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: engine === eng.key ? "0 0 20px rgba(99,102,241,0.3)" : "none",
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: "0.5rem", lineHeight: 1 }}>{eng.icon}</div>
                    <div style={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      marginBottom: "0.25rem",
                      lineHeight: 1.3,
                    }}>
                      {eng.label}
                    </div>
                    <div style={{
                      color: engine === eng.key ? "#a5b4fc" : "#cbd5e1",
                      fontSize: "0.88rem",
                      lineHeight: 1.4,
                      fontWeight: 600,
                    }}>
                      {eng.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>


            {/* Textarea */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ color: "#f8fafc", fontSize: "0.92rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Review Text
              </p>
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="Paste your customer review here…"
                rows={8}
                style={{
                  width: "100%",
                  background: "rgba(15,23,42,0.85)",
                  border: "1.5px solid rgba(148,163,184,0.25)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "1rem",
                  padding: "14px 16px",
                  resize: "vertical",
                  outline: "none",
                  lineHeight: 1.65,
                  transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "rgba(148,163,184,0.25)"}
              />
            </div>

            {/* Sample reviews */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#f8fafc", fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem" }}>
                Try a sample:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {SAMPLE_REVIEWS.map((sr, i) => (
                  <button key={i} onClick={() => setReview(sr)} style={{
                    background: "rgba(30,41,59,0.85)",
                    border: "1px solid rgba(148,163,184,0.25)",
                    borderRadius: 10,
                    color: "#ffffff",
                    textAlign: "left",
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: "0.92rem",
                    lineHeight: 1.5,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "rgba(148,163,184,0.25)"; e.currentTarget.style.background = "rgba(30,41,59,0.85)"; }}
                  >
                    "{sr.substring(0, 80)}…"
                  </button>
                ))}
              </div>
            </div>


            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={!review.trim() || isLoading}
              style={{
                width: "100%",
                background: (!review.trim() || isLoading) ? "rgba(99,102,241,0.25)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: (!review.trim() || isLoading) ? "1px solid rgba(99,102,241,0.3)" : "none",
                borderRadius: 12,
                color: (!review.trim() || isLoading) ? "#a5b4fc" : "#ffffff",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                padding: "14px",
                cursor: (!review.trim() || isLoading) ? "not-allowed" : "pointer",
                boxShadow: (!review.trim() || isLoading) ? "none" : "0 4px 24px rgba(99,102,241,0.5)",
                transition: "all 0.2s",
                letterSpacing: "0.02em",
              }}
            >
              {isLoading ? "⏳ Analyzing…" : "🔍 Run ABSA Analysis"}
            </button>
          </div>

          {/* === RIGHT PANEL: Results === */}
          <div className="absa-results-panel">
            {!response && !isLoading && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", textAlign: "center",
                color: "#cbd5e1", gap: "1rem", padding: "2rem",
              }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6 }}>
                  Results will appear here after you run the analysis.
                </p>
              </div>
            )}

            {isLoading && (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", height: "100%", gap: "1rem",
              }}>
                <div style={{
                  width: 40, height: 40, border: "3px solid rgba(99,102,241,0.2)",
                  borderTop: "3px solid #6366f1",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                <p style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                  Running {engine === "hf" ? "RoBERTa" : "spaCy"} analysis…
                </p>
              </div>
            )}

            {response && response.length === 0 && (
              <div style={{ padding: "2rem", textAlign: "center", color: "#cbd5e1" }}>
                <div style={{ fontSize: 36, marginBottom: "0.75rem" }}>😶</div>
                <p style={{ fontSize: "0.95rem" }}>No aspects could be extracted from this review.</p>
              </div>
            )}

            {response && response.length > 0 && (
              <div style={{ padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h4 style={{ color: "#f8fafc", fontFamily: "'Outfit', sans-serif", fontWeight: 700, margin: 0 }}>
                    Extracted Aspects
                  </h4>
                  <span style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#a5b4fc", fontSize: "0.78rem", fontWeight: 700,
                    padding: "4px 14px", borderRadius: 20,
                  }}>
                    {response.length} aspect{response.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {response.map((item, i) => {
                    const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["General"];
                    const pol = item.polarity;
                    const { label: sentLabel, color: sentColor } = polarityLabel(pol);
                    const isPos = pol > 0;
                    const pct = Math.min(Math.abs(typeof pol === "number" ? pol : 0) * 100, 100);

                    return (
                      <div key={i} style={{
                        background: "rgba(15,23,42,0.7)",
                        border: `1px solid ${isPos ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.25)"}`,
                        borderRadius: 12,
                        padding: "1rem 1.125rem",
                        animation: `fadeInUp 0.3s ease ${i * 0.06}s both`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                            <span style={{
                              background: catStyle.bg, color: catStyle.color,
                              fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px",
                              borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.05em",
                            }}>
                              {item.category || "General"}
                            </span>
                            <strong style={{ color: "#f8fafc", fontSize: "0.95rem" }}>
                              {item.aspect}
                            </strong>
                          </div>
                          <span style={{ color: sentColor, fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap", marginLeft: 8 }}>
                            {sentLabel}
                          </span>
                        </div>

                        {item.descriptor && (
                          <p style={{ color: "#cbd5e1", fontSize: "0.85rem", margin: "0 0 10px", lineHeight: 1.5 }}>
                            → {item.descriptor}
                          </p>
                        )}


                        {pol != null && (
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ flex: 1, height: 5, borderRadius: 4, background: "rgba(148,163,184,0.1)" }}>
                              <div style={{
                                width: `${pct}%`, height: "100%", borderRadius: 4,
                                background: isPos ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#f43f5e,#fb7185)",
                                transition: "width 0.5s ease",
                              }} />
                            </div>
                            <span style={{ color: sentColor, fontWeight: 800, fontSize: "0.82rem", minWidth: 36, textAlign: "right" }}>
                              {typeof pol === "number" ? (pol > 0 ? "+" : "") + pol.toFixed(2) : pol}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AbsaEngine;
