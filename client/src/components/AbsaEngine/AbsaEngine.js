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
    if (p == null) return { label: "—", color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)" };
    if (p >= 0.3 || (typeof p === "number" && p >= 6.5)) {
      return { label: "Positive", color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.35)" };
    }
    if (p <= -0.2 || (typeof p === "number" && p <= 4)) {
      return { label: "Negative", color: "#f43f5e", bg: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.35)" };
    }
    return { label: "Neutral", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.35)" };
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
                        ? "linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.25))"
                        : "rgba(30,41,59,0.75)",
                      border: engine === eng.key
                        ? "2px solid #818cf8"
                        : "1px solid rgba(148,163,184,0.25)",
                      borderRadius: 12,
                      padding: "14px 16px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      fontFamily: "'Inter', sans-serif",
                      boxShadow: engine === eng.key ? "0 0 20px rgba(99,102,241,0.35)" : "none",
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
                      color: engine === eng.key ? "#c7d2fe" : "#94a3b8",
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
                rows={7}
                style={{
                  width: "100%",
                  background: "rgba(15,23,42,0.85)",
                  border: "1.5px solid rgba(148,163,184,0.25)",
                  borderRadius: 12,
                  color: "#ffffff",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.98rem",
                  padding: "14px 16px",
                  resize: "vertical",
                  outline: "none",
                  lineHeight: 1.65,
                  transition: "all 0.2s ease",
                }}
                onFocus={e => e.target.style.borderColor = "#818cf8"}
                onBlur={e => e.target.style.borderColor = "rgba(148,163,184,0.25)"}
              />
            </div>

            {/* Sample reviews */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ color: "#f8fafc", fontSize: "0.92rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                Try a sample review:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {SAMPLE_REVIEWS.map((sr, i) => (
                  <button key={i} onClick={() => setReview(sr)} style={{
                    background: "rgba(30,41,59,0.75)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: 10,
                    color: "#cbd5e1",
                    textAlign: "left",
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    lineHeight: 1.5,
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = "#ffffff";
                    e.currentTarget.style.borderColor = "#818cf8";
                    e.currentTarget.style.background = "rgba(99,102,241,0.18)";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = "#cbd5e1";
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.2)";
                    e.currentTarget.style.background = "rgba(30,41,59,0.75)";
                    e.currentTarget.style.transform = "none";
                  }}
                  >
                    "{sr}"
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
                background: (!review.trim() || isLoading)
                  ? "rgba(99,102,241,0.2)"
                  : "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                border: (!review.trim() || isLoading) ? "1px solid rgba(99,102,241,0.25)" : "none",
                borderRadius: 12,
                color: (!review.trim() || isLoading) ? "#818cf8" : "#ffffff",
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.05rem",
                fontWeight: 800,
                padding: "14px",
                cursor: (!review.trim() || isLoading) ? "not-allowed" : "pointer",
                boxShadow: (!review.trim() || isLoading) ? "none" : "0 4px 20px rgba(168, 85, 247, 0.45)",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                letterSpacing: "0.03em",
              }}
              onMouseEnter={e => {
                if (review.trim() && !isLoading) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 6px 28px rgba(168, 85, 247, 0.6)";
                }
              }}
              onMouseLeave={e => {
                if (review.trim() && !isLoading) {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(168, 85, 247, 0.45)";
                }
              }}
            >
              {isLoading ? "⚡ Analyzing Aspects..." : "✨ Run ABSA Analysis"}
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
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28,
                }}>
                  🔍
                </div>
                <div>
                  <h4 style={{ color: "#f8fafc", fontWeight: 700, margin: "0 0 0.4rem", fontSize: "1.1rem" }}>
                    Ready for Analysis
                  </h4>
                  <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: 320, margin: 0 }}>
                    Select a model engine and paste a customer review to see extracted aspect-descriptor pairs and sentiment scores.
                  </p>
                </div>
              </div>
            )}

            {isLoading && (
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "0.5rem" }}>
                  <div style={{
                    width: 24, height: 24, border: "3px solid rgba(99,102,241,0.2)",
                    borderTop: "3px solid #818cf8", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <span style={{ color: "#a5b4fc", fontSize: "0.95rem", fontWeight: 700 }}>
                    Running {engine === "hf" ? "RoBERTa Transformer" : "spaCy Dependency"} Engine...
                  </span>
                </div>

                {/* Shimmer Skeletons */}
                {[1, 2, 3].map((s) => (
                  <div key={s} className="absa-skeleton-card">
                    <div className="absa-skeleton-line" style={{ width: "40%", height: 16, borderRadius: 6 }} />
                    <div className="absa-skeleton-line" style={{ width: "70%", height: 12, borderRadius: 4 }} />
                    <div className="absa-skeleton-line" style={{ width: "100%", height: 6, borderRadius: 3 }} />
                  </div>
                ))}
              </div>
            )}

            {response && response.length === 0 && (
              <div style={{ padding: "3rem 2rem", textAlign: "center", color: "#cbd5e1" }}>
                <div style={{ fontSize: 40, marginBottom: "0.75rem" }}>😶</div>
                <h4 style={{ color: "#f8fafc", fontWeight: 700, margin: "0 0 0.5rem" }}>No Aspects Detected</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.92rem" }}>Try adjusting your review text or switching the NLP engine.</p>
              </div>
            )}

            {response && response.length > 0 && (
              <div style={{ padding: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h4 style={{ color: "#f8fafc", fontFamily: "'Outfit', sans-serif", fontWeight: 700, margin: 0, fontSize: "1.15rem" }}>
                    Extracted Aspect Insights
                  </h4>
                  <span style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: "#c7d2fe", fontSize: "0.8rem", fontWeight: 800,
                    padding: "4px 14px", borderRadius: 20,
                  }}>
                    {response.length} aspect{response.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {response.map((item, i) => {
                    const catStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS["General"];
                    const pol = item.polarity;
                    const { label: sentLabel, color: sentColor, bg: sentBg, border: sentBorder } = polarityLabel(pol);
                    const isPos = pol > 0;
                    const pct = Math.min(Math.abs(typeof pol === "number" ? pol : 0) * 100, 100);

                    return (
                      <div key={i} style={{
                        background: "rgba(15,23,42,0.75)",
                        border: `1.5px solid ${sentBorder}`,
                        borderRadius: 14,
                        padding: "1.1rem 1.25rem",
                        animation: `fadeInUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.06}s both`,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
                            <span style={{
                              background: catStyle.bg, color: catStyle.color,
                              fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px",
                              borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.06em",
                            }}>
                              {item.category || "General"}
                            </span>
                            <strong style={{ color: "#ffffff", fontSize: "1.02rem", fontWeight: 800 }}>
                              {item.aspect}
                            </strong>
                          </div>

                          <span style={{
                            background: sentBg,
                            border: `1px solid ${sentBorder}`,
                            color: sentColor,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            padding: "3px 12px",
                            borderRadius: 12,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                          }}>
                            {sentLabel}
                          </span>
                        </div>

                        {item.descriptor && (
                          <p style={{ color: "#e2e8f0", fontSize: "0.9rem", margin: "0 0 12px", lineHeight: 1.5, fontWeight: 500 }}>
                            <span style={{ color: "#94a3b8", fontWeight: 600 }}>Descriptor: </span>
                            "{item.descriptor}"
                          </p>
                        )}

                        {pol != null && (
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ flex: 1, height: 6, borderRadius: 4, background: "rgba(148,163,184,0.12)" }}>
                              <div style={{
                                width: `${pct}%`, height: "100%", borderRadius: 4,
                                background: isPos
                                  ? "linear-gradient(90deg, #10b981, #34d399)"
                                  : "linear-gradient(90deg, #f43f5e, #fb7185)",
                                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                              }} />
                            </div>
                            <span style={{ color: sentColor, fontWeight: 800, fontSize: "0.85rem", minWidth: 42, textAlign: "right" }}>
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
