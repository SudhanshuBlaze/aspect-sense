import { Container } from "semantic-ui-react";
import MenuRight from "./MenuRight";
import { useNavigate } from "react-router-dom";

const STATS = [
  { value: "100%", label: "Free & Open Source" },
  { value: "7",    label: "Aspect Categories" },
  { value: "Live", label: "Real-Time Streaming" },
  { value: "2x",   label: "DB Redundancy" },
];

const LandingSegment = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "linear-gradient(135deg, #0f172a 0%, #1a1040 40%, #0f172a 100%)",
      paddingBottom: "2.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ambient glow blobs */}
      <div style={{
        position: "absolute", top: "10%", left: "15%",
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "15%", right: "10%",
        width: 360, height: 360,
        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "25%",
        width: 200, height: 200,
        background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      <Container>
        <MenuRight />

        {/* Hero Content */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          paddingTop: "3.5rem",
          paddingBottom: "1.5rem",
          gap: "1.5rem",
          animation: "fadeInUp 0.6s ease both",
        }}>

          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.25)",
            border: "1px solid rgba(99,102,241,0.4)",
            borderRadius: 20, padding: "7px 18px",
            fontSize: "0.85rem", color: "#ffffff", fontWeight: 700,
            letterSpacing: "0.06em",
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#6366f1",
              boxShadow: "0 0 8px #6366f1",
              animation: "pulse-ring 2s infinite",
            }} />
            NLP · ABSA · Real-Time Sentiment Intelligence
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(3rem, 6.5vw, 5.2rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            maxWidth: 820,
          }}>
            Aspect-Based{" "}
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Sentiment Analysis
            </span>
            <br />at Scale
          </h1>

          {/* Sub headline */}
          <p style={{
            fontSize: "1.25rem",
            color: "#f1f5f9",
            maxWidth: 620,
            lineHeight: 1.75,
            fontWeight: 400,
          }}>
            Continuously scrape Google Maps reviews and extract fine-grained
            aspect insights — fully open-source, no API keys required.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "0.75rem" }}>
            <button
              onClick={() => navigate("/scrapper_pipeline")}
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                border: "none",
                padding: "16px 36px",
                borderRadius: 12,
                fontSize: "1.02rem",
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                boxShadow: "0 4px 24px rgba(99,102,241,0.5)",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.7)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(99,102,241,0.5)"; }}
            >
              ⚡ Try the Pipeline →
            </button>
            <button
              onClick={() => navigate("/single_review")}
              style={{
                background: "rgba(30,41,59,0.7)",
                color: "#ffffff",
                border: "1.5px solid rgba(148,163,184,0.35)",
                padding: "16px 36px",
                borderRadius: 12,
                fontSize: "1.02rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "rgba(148,163,184,0.35)"; e.currentTarget.style.background = "rgba(30,41,59,0.7)"; }}
            >
              🔍 Analyze a Review
            </button>
          </div>

          {/* Stats bar */}
          <div style={{
            display: "flex", gap: "2px", flexWrap: "wrap", justifyContent: "center",
            background: "rgba(30,41,59,0.85)",
            border: "1px solid rgba(148,163,184,0.2)",
            borderRadius: 14,
            padding: "1.25rem 2.25rem",
            marginTop: "2rem",
          }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "0.5rem 2rem",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(148,163,184,0.2)" : "none",
              }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "1.9rem", fontWeight: 800,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1.1,
                }}>{s.value}</span>
                <span style={{ fontSize: "0.85rem", color: "#f1f5f9", fontWeight: 600, marginTop: 4 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LandingSegment;
