import React from "react";
import "./AnalyserPipeline.css";
import { Image, Grid } from "semantic-ui-react";
import { useTheme } from "../../context/ThemeContext";

const WordCloud = ({ data }) => {
  const { isDark } = useTheme();

  if (!data?.positiveCloudImg && !data?.negativeCloudImg) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "var(--as-text-primary)",
        marginBottom: "1.25rem",
        transition: "color 0.3s ease",
      }}>
        Aspect Word Cloud Analysis
      </h3>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column>
            <div className="wordcloud-card positive-cloud">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", justifyContent: "center" }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 8px rgba(16,185,129,0.8)",
                  display: "inline-block",
                }} />
                <h4 style={{ margin: 0, color: isDark ? "#34d399" : "#059669", fontSize: "0.9rem", fontWeight: 700 }}>
                  Positive Aspects
                </h4>
              </div>
              {data.positiveCloudImg ? (
                <Image src={data.positiveCloudImg} alt="Positive Word Cloud" centered rounded
                  style={{ borderRadius: 10 }} />
              ) : (
                <div style={{
                  padding: "3rem",
                  color: "var(--as-text-secondary)",
                  fontSize: "0.88rem",
                  background: "var(--as-bg-surface)",
                  border: "1px solid var(--as-border)",
                  borderRadius: 10,
                  transition: "background 0.3s ease",
                }}>
                  No positive aspects detected yet
                </div>
              )}
            </div>
          </Grid.Column>

          <Grid.Column>
            <div className="wordcloud-card negative-cloud">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem", justifyContent: "center" }}>
                <span style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#f43f5e",
                  boxShadow: "0 0 8px rgba(244,63,94,0.8)",
                  display: "inline-block",
                }} />
                <h4 style={{ margin: 0, color: isDark ? "#fb7185" : "#e11d48", fontSize: "0.9rem", fontWeight: 700 }}>
                  Negative Aspects
                </h4>
              </div>
              {data.negativeCloudImg ? (
                <Image src={data.negativeCloudImg} alt="Negative Word Cloud" centered rounded
                  style={{ borderRadius: 10 }} />
              ) : (
                <div style={{
                  padding: "3rem",
                  color: "var(--as-text-secondary)",
                  fontSize: "0.88rem",
                  background: "var(--as-bg-surface)",
                  border: "1px solid var(--as-border)",
                  borderRadius: 10,
                  transition: "background 0.3s ease",
                }}>
                  No negative aspects detected yet
                </div>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default WordCloud;
