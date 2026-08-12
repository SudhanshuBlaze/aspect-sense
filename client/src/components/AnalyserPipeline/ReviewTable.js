import React from "react";
import "./AnalyserPipeline.css";
import { Table } from "semantic-ui-react";
import { useTheme } from "../../context/ThemeContext";

const CATEGORY_COLORS = {
  "Service":           { bg: "rgba(99,102,241,0.15)", color: "#818cf8", border: "rgba(99,102,241,0.3)" },
  "Cleanliness":       { bg: "rgba(6,182,212,0.12)",  color: "#22d3ee", border: "rgba(6,182,212,0.3)" },
  "Food & Beverage":   { bg: "rgba(245,158,11,0.12)", color: "#fbbf24", border: "rgba(245,158,11,0.3)" },
  "Value & Pricing":   { bg: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "rgba(139,92,246,0.3)" },
  "Amenities":         { bg: "rgba(14,165,233,0.12)", color: "#38bdf8", border: "rgba(14,165,233,0.3)" },
  "Location":          { bg: "rgba(20,184,166,0.12)", color: "#2dd4bf", border: "rgba(20,184,166,0.3)" },
  "Vibe & Atmosphere": { bg: "rgba(168,85,247,0.12)", color: "#c084fc", border: "rgba(168,85,247,0.3)" },
  "General":           { bg: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "rgba(100,116,139,0.2)" },
};

const CategoryTag = ({ category }) => {
  const style = CATEGORY_COLORS[category] || CATEGORY_COLORS["General"];
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      border: `1px solid ${style.border}`,
      fontSize: "0.72rem",
      padding: "3px 9px",
      borderRadius: 10,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      whiteSpace: "nowrap",
    }}>
      {category || "General"}
    </span>
  );
};

const PolarityBar = ({ polarity }) => {
  if (polarity == null) return null;
  const isPos = polarity > 0;
  const pct = Math.min(Math.abs(polarity) * 100, 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{
        flex: 1, height: 6, borderRadius: 4,
        background: "rgba(148,163,184,0.15)",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 4,
          background: isPos
            ? "linear-gradient(90deg, #10b981, #34d399)"
            : "linear-gradient(90deg, #f43f5e, #fb7185)",
          transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{
        fontSize: "0.88rem", fontWeight: 700, minWidth: 42, textAlign: "right",
        color: isPos ? "#10b981" : "#f43f5e",
      }}>
        {isPos ? "+" : ""}{polarity?.toFixed ? polarity.toFixed(2) : polarity}
      </span>
    </div>
  );
};

const ReviewTable = ({ data }) => {
  const { isDark } = useTheme();

  if (!data?.reviews || data.reviews.length === 0) return null;

  return (
    <div className="table-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif",
            margin: 0, fontSize: "1.25rem", fontWeight: 700, color: "var(--as-text-primary)",
            transition: "color 0.3s ease",
          }}>
            Scraped &amp; Analyzed Reviews
          </h3>
          <p style={{ margin: "3px 0 0", fontSize: "0.88rem", color: "var(--as-text-secondary)", transition: "color 0.3s ease" }}>
            {data.reviews.length} review{data.reviews.length !== 1 ? "s" : ""} processed
          </p>
        </div>
        <div style={{
          background: "rgba(99,102,241,0.15)",
          border: "1px solid rgba(99,102,241,0.3)",
          color: isDark ? "#a5b4fc" : "#4338ca",
          padding: "6px 16px",
          borderRadius: 20,
          fontSize: "0.82rem",
          fontWeight: 700,
        }}>
          ABSA Results
        </div>
      </div>

      <div style={{ maxHeight: "520px", overflowY: "auto" }}>
        <Table celled striped compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: "32%" }}>Original Review</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "28%" }}>Segments</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }}>Aspects &amp; Descriptors</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "20%" }}>Sentiment Polarity</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data.reviews.map((row, index) => {
              const segmented = Array.isArray(row.segmented_reviews)
                ? row.segmented_reviews : [row.segmented_reviews];
              const descList = Array.isArray(row.aspect_with_description)
                ? row.aspect_with_description : [];
              const polList = Array.isArray(row.aspect_with_polarity)
                ? row.aspect_with_polarity : [];

              return (
                <Table.Row key={index}>
                  <Table.Cell style={{ verticalAlign: "top", padding: "0.75rem" }}>
                    <div style={{
                      background: "var(--as-bg-surface)",
                      border: "1px solid var(--as-border)",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      color: "var(--as-text-primary)",
                      fontSize: "0.98rem",
                      lineHeight: 1.65,
                      fontFamily: "'Inter', sans-serif",
                      transition: "background 0.3s ease",
                    }}>
                      {row.reviews}
                    </div>
                  </Table.Cell>

                  <Table.Cell style={{ verticalAlign: "top", padding: "0.75rem" }}>
                    {segmented.map((seg, i) => (
                      <div key={i} style={{
                        background: "var(--as-bg-surface)",
                        border: "1px solid var(--as-border)",
                        borderLeft: "3px solid #6366f1",
                        borderRadius: "8px",
                        padding: "10px 14px",
                        marginBottom: "0.6rem",
                        fontSize: "0.94rem",
                        color: "var(--as-text-primary)",
                        lineHeight: 1.6,
                        boxShadow: "var(--as-shadow-card)",
                        fontFamily: "'Inter', sans-serif",
                        transition: "background 0.3s ease",
                      }}>
                        <span style={{
                          fontSize: "0.74rem",
                          color: isDark ? "#a5b4fc" : "#4338ca",
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          display: "block",
                          marginBottom: "4px",
                        }}>
                          Sentence {i + 1}
                        </span>
                        {seg}
                      </div>
                    ))}
                  </Table.Cell>

                  <Table.Cell style={{ verticalAlign: "top" }}>
                    {descList.length > 0 ? (
                      descList.map((item, i) =>
                        item.aspect && item.description ? (
                          <div key={i} className="aspect-pill desc" style={{ display: "block", marginBottom: "0.5rem", padding: "0.4rem 0.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 3 }}>
                              <CategoryTag category={item.category} />
                              <strong style={{ fontSize: "0.92rem", color: "var(--as-text-primary)" }}>{item.aspect}</strong>
                            </div>
                            <span style={{ fontSize: "0.88rem", color: "var(--as-text-secondary)", lineHeight: 1.5, display: "block", marginTop: 2 }}>→ {item.description}</span>
                          </div>
                        ) : null
                      )
                    ) : (
                      <span style={{ color: "var(--as-text-muted)", fontSize: "0.88rem" }}>—</span>
                    )}
                  </Table.Cell>

                  <Table.Cell style={{ verticalAlign: "top" }}>
                    {polList.length > 0 ? (
                      polList.map((item, i) => {
                        if (!item.aspect) return null;
                        const isPos = item.polarity > 0;
                        return (
                          <div key={i} className={`aspect-pill ${isPos ? "positive" : "negative"}`} style={{ display: "block", marginBottom: "0.5rem", padding: "0.4rem 0.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" }}>
                              <CategoryTag category={item.category} />
                              <strong style={{ fontSize: "0.92rem", color: "var(--as-text-primary)" }}>{item.aspect}</strong>
                            </div>
                            <PolarityBar polarity={item.polarity} />
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ color: "var(--as-text-muted)", fontSize: "0.88rem" }}>—</span>
                    )}
                  </Table.Cell>

                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};

export default ReviewTable;
