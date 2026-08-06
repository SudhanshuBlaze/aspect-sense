import React from "react";
import "./AnalyserPipeline.css";
import { Image, Grid, Header } from "semantic-ui-react";

const WordCloud = ({ data }) => {
  if (!data?.positiveCloudImg && !data?.negativeCloudImg) return null;

  return (
    <div style={{ marginTop: "2rem" }}>
      <Header as="h3" style={{ marginBottom: "1rem" }}>
        Aspect Word Cloud Analysis
      </Header>
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column>
            <div className="wordcloud-card">
              <Header as="h4" style={{ color: "#047857", marginBottom: "1rem" }}>
                Positive Aspects Word Cloud
              </Header>
              {data.positiveCloudImg ? (
                <Image src={data.positiveCloudImg} alt="Positive Word Cloud" centered rounded />
              ) : (
                <div style={{ padding: "2rem", color: "#9ca3af" }}>No positive aspects detected yet</div>
              )}
            </div>
          </Grid.Column>

          <Grid.Column>
            <div className="wordcloud-card">
              <Header as="h4" style={{ color: "#b91c1c", marginBottom: "1rem" }}>
                Negative Aspects Word Cloud
              </Header>
              {data.negativeCloudImg ? (
                <Image src={data.negativeCloudImg} alt="Negative Word Cloud" centered rounded />
              ) : (
                <div style={{ padding: "2rem", color: "#9ca3af" }}>No negative aspects detected yet</div>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default WordCloud;
