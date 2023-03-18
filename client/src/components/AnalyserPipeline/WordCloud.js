import React from "react";
import { Image, Grid, Header } from "semantic-ui-react";

const WordCloud = ({ data }) => {
  return (
    data.negativeCloudImg && (
      <>
        <Header as="h2" style={{ marginTop: 20 }}>
          Word Clouds
        </Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Image src={data.positiveCloudImg} alt="Positive Word Cloud" />
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                Positive Word Cloud
              </div>
            </Grid.Column>
            <Grid.Column>
              <Image src={data.negativeCloudImg} alt="Negative Word Cloud" />
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                Negative Word Cloud
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  );
};

export default WordCloud;
