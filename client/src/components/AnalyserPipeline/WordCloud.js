import React from "react";
import "./AnalyserPipeline.css";
import { Image, Grid } from "semantic-ui-react";

const WordCloud = ({ data }) => {
  if (!data?.positiveCloudImg && !data?.negativeCloudImg) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: "1.1rem",
        fontWeight: 700,
        color: "#f1f5f9",
        marginBottom: "1.25rem",
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
                <h4 style={{ margin: 0, color: "#34d399", fontSize: "0.9rem", fontWeight: 700 }}>
                  Positive Aspects
                </h4>
              </div>
              {data.positiveCloudImg ? (
                <Image src={data.positiveCloudImg} alt="Positive Word Cloud" centered rounded
                  style={{ borderRadius: 10 }} />
              ) : (
                <div style={{
                  padding: "3rem",
                  color: "#cbd5e1",
                  fontSize: "0.88rem",
                  background: "rgba(15,23,42,0.4)",
                  borderRadius: 10,
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
                <h4 style={{ margin: 0, color: "#fb7185", fontSize: "0.9rem", fontWeight: 700 }}>
                  Negative Aspects
                </h4>
              </div>
              {data.negativeCloudImg ? (
                <Image src={data.negativeCloudImg} alt="Negative Word Cloud" centered rounded
                  style={{ borderRadius: 10 }} />
              ) : (
                <div style={{
                  padding: "3rem",
                  color: "#cbd5e1",
                  fontSize: "0.88rem",
                  background: "rgba(15,23,42,0.4)",
                  borderRadius: 10,
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
