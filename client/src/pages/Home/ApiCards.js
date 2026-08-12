import { Container } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const CARDS = [
  {
    icon: "🔍",
    header: "Single Review ABSA Engine",
    description:
      "Paste any review and run aspect-based sentiment analysis using the open-source Hugging Face transformer (cardiffnlp/twitter-roberta) or spaCy dependency engine. Returns aspect → descriptor → sentiment per sentence.",
    tags: ["HuggingFace Transformer", "spaCy NLP", "1-10 Polarity Score"],
    route: "/single_review",
    accent: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    glow: "rgba(99,102,241,0.25)",
  },
  {
    icon: "⚡",
    header: "Review Scraper & Real-Time Analyser",
    description:
      "Enter a Google Maps location or URL to stream live reviews in real time, classify aspects into 7 domain categories, and persist everything into MongoDB + SQLite — continuously in the background.",
    tags: ["Real-Time SSE Streaming", "7 Taxonomy Categories", "MongoDB + SQLite"],
    route: "/scrapper_pipeline",
    accent: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
    glow: "rgba(14,165,233,0.2)",
  },
];

const ApiCards = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div style={{ background: "var(--as-bg-base)", paddingTop: "2.5rem", paddingBottom: "4rem", transition: "background 0.3s ease" }}>
      <Container>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p style={{
            fontSize: "0.88rem", fontWeight: 800, letterSpacing: "0.12em",
            color: isDark ? "#818cf8" : "#4f46e5", textTransform: "uppercase", marginBottom: "0.75rem",
          }}>
            Explore the Tools
          </p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, color: "var(--as-text-primary)",
            letterSpacing: "-0.03em", marginBottom: "0.75rem",
            transition: "color 0.3s ease",
          }}>
            Two Powerful Analysis Modes
          </h2>
          <p style={{ color: "var(--as-text-secondary)", fontSize: "1.1rem", maxWidth: 520, margin: "0 auto", lineHeight: 1.6, transition: "color 0.3s ease" }}>
            Whether you want to analyze a single review or scrape thousands — AspectSense has you covered.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "1.75rem",
        }}>
          {CARDS.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              style={{
                background: "var(--as-bg-glass)",
                border: "1px solid var(--as-border)",
                borderRadius: 20,
                padding: "2.25rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(12px)",
                boxShadow: "var(--as-shadow-card)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 20px 48px ${card.glow}, var(--as-shadow-card)`;
                e.currentTarget.style.borderColor = isDark ? "rgba(148,163,184,0.35)" : "rgba(99,102,241,0.35)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--as-shadow-card)";
                e.currentTarget.style.borderColor = "var(--as-border)";
              }}
            >
              {/* Top gradient strip */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                background: card.accent,
              }} />

              {/* Icon badge */}
              <div style={{
                width: 54, height: 54,
                background: card.accent,
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26,
                marginBottom: "1.25rem",
                boxShadow: `0 4px 16px ${card.glow}`,
              }}>
                {card.icon}
              </div>

              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.3rem",
                fontWeight: 800,
                color: "var(--as-text-primary)",
                marginBottom: "0.75rem",
                lineHeight: 1.3,
                transition: "color 0.3s ease",
              }}>
                {card.header}
              </h3>

              <p style={{
                color: "var(--as-text-secondary)",
                fontSize: "1.02rem",
                lineHeight: 1.7,
                marginBottom: "1.5rem",
                transition: "color 0.3s ease",
              }}>
                {card.description}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.75rem" }}>
                {card.tags.map((tag, ti) => (
                  <span key={ti} style={{
                    background: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: isDark ? "#ffffff" : "#4338ca",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    padding: "5px 14px",
                    borderRadius: 20,
                    letterSpacing: "0.03em",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA link */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: "0.98rem", fontWeight: 800,
                color: isDark ? "#818cf8" : "#4f46e5",
              }}>
                Open tool →
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ApiCards;
