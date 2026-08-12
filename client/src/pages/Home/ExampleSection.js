import { Container } from "semantic-ui-react";
import { useTheme } from "../../context/ThemeContext";

const SAMPLE_REVIEW =
  "I went to this restaurant last night and the food was absolutely amazing. However, the service was terrible — the waiter was rude and inattentive. Overall I'd recommend it for the food, but management really needs to address the service quality.";

const ASPECTS = [
  { name: "food",        descriptor: "absolutely amazing",             polarity: 0.91, cat: "Food & Beverage", pos: true },
  { name: "service",     descriptor: "terrible, rude, inattentive",    polarity: -0.82, cat: "Service",        pos: false },
  { name: "management",  descriptor: "needs to address",               polarity: -0.35, cat: "Service",        pos: false },
];

const STEPS = [
  { num: "01", title: "Scrape Reviews",    desc: "Extract reviews from any Google Maps location URL automatically.", icon: "🕸️" },
  { num: "02", title: "Segment & Parse",   desc: "Each review is split into sentences using spaCy's NLP pipeline.", icon: "✂️" },
  { num: "03", title: "Extract Aspects",   desc: "Noun chunks and dependency trees identify aspect-descriptor pairs.", icon: "🔍" },
  { num: "04", title: "Score Sentiment",   desc: "RoBERTa transformer scores each aspect on a 1–10 polarity scale.", icon: "📊" },
];

const ExampleSection = () => {
  const { isDark } = useTheme();

  return (
    <div style={{ background: "var(--as-bg-base)", paddingBottom: "6rem", transition: "background 0.3s ease" }}>
      <Container>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "4rem", paddingTop: "2rem" }}>
          <p style={{
            fontSize: "0.88rem", fontWeight: 800, letterSpacing: "0.12em",
            color: isDark ? "#2dd4bf" : "#0d9488", textTransform: "uppercase", marginBottom: "0.75rem",
          }}>
            How It Works
          </p>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, color: "var(--as-text-primary)",
            letterSpacing: "-0.03em",
            transition: "color 0.3s ease",
          }}>
            From Raw Review to Fine-Grained Insights
          </h2>
        </div>

        {/* Steps row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "1.25rem",
          marginBottom: "4rem",
        }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              background: "var(--as-bg-glass)",
              border: "1px solid var(--as-border)",
              borderRadius: 16,
              padding: "1.75rem 1.5rem",
              position: "relative",
              boxShadow: "var(--as-shadow-card)",
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}>
              <span style={{
                position: "absolute", top: "1rem", right: "1rem",
                fontSize: "0.85rem", fontWeight: 800,
                color: isDark ? "#a5b4fc" : "#4338ca", letterSpacing: "0.08em",
              }}>
                {step.num}
              </span>
              <div style={{ fontSize: 32, marginBottom: "0.75rem" }}>{step.icon}</div>
              <h4 style={{
                color: "var(--as-text-primary)", fontWeight: 800, fontSize: "1.05rem",
                marginBottom: "0.4rem", transition: "color 0.3s ease",
              }}>
                {step.title}
              </h4>
              <p style={{ color: "var(--as-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, transition: "color 0.3s ease" }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Live example */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.75rem",
          alignItems: "start",
        }}
        className="as-example-grid"
        >
          {/* Raw review */}
          <div style={{
            background: "var(--as-bg-glass)",
            border: "1px solid var(--as-border)",
            borderRadius: 18,
            padding: "1.75rem",
            boxShadow: "var(--as-shadow-card)",
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginBottom: "1.25rem",
            }}>
              <div style={{
                width: 9, height: 9, borderRadius: "50%", background: "#f43f5e",
              }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ color: "var(--as-text-secondary)", fontSize: "0.84rem", marginLeft: 8, fontWeight: 700 }}>
                review.txt
              </span>
            </div>
            <p style={{
              color: "var(--as-text-primary)", fontSize: "1.02rem",
              lineHeight: 1.75, fontStyle: "italic",
              transition: "color 0.3s ease",
            }}>
              "{SAMPLE_REVIEW}"
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginTop: "1.25rem",
            }}>
              <span style={{
                background: isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.35)",
                color: isDark ? "#ffffff" : "#4338ca", fontSize: "0.8rem", fontWeight: 700,
                padding: "4px 14px", borderRadius: 20,
              }}>
                Google Maps Review
              </span>
            </div>
          </div>

          {/* Extracted aspects */}
          <div style={{
            background: "var(--as-bg-glass)",
            border: "1px solid var(--as-border)",
            borderRadius: 18,
            padding: "1.75rem",
            boxShadow: "var(--as-shadow-card)",
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}>
            <p style={{
              color: "var(--as-text-primary)", fontSize: "0.88rem", fontWeight: 800,
              letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: "1.25rem", transition: "color 0.3s ease",
            }}>
              Extracted Aspects
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {ASPECTS.map((a, i) => (
                <div key={i} style={{
                  background: "var(--as-bg-surface)",
                  border: `1px solid ${a.pos ? "rgba(16,185,129,0.35)" : "rgba(244,63,94,0.35)"}`,
                  borderRadius: 12,
                  padding: "0.85rem 1.125rem",
                  transition: "background 0.3s ease",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "1.1rem" }}>{a.pos ? "👍" : "👎"}</span>
                      <strong style={{ color: "var(--as-text-primary)", fontSize: "1.02rem", fontWeight: 800 }}>{a.name}</strong>
                      <span style={{
                        background: a.pos ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)",
                        color: a.pos ? (isDark ? "#34d399" : "#059669") : (isDark ? "#fb7185" : "#e11d48"),
                        fontSize: "0.72rem", fontWeight: 700,
                        padding: "3px 8px", borderRadius: 10,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                      }}>
                        {a.cat}
                      </span>
                    </div>
                    <span style={{
                      fontWeight: 800, fontSize: "0.95rem",
                      color: a.pos ? (isDark ? "#34d399" : "#059669") : (isDark ? "#fb7185" : "#e11d48"),
                    }}>
                      {a.polarity > 0 ? "+" : ""}{a.polarity.toFixed(2)}
                    </span>
                  </div>
                  <p style={{ color: "var(--as-text-secondary)", fontSize: "0.92rem", margin: 0, fontWeight: 500 }}>
                    {a.descriptor}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default ExampleSection;
