import { Container, Header, Segment } from "semantic-ui-react";
import MenuRight from "./MenuRight";

const LandingSegment = () => (
  <Segment inverted textAlign="center" vertical>
    <Container>
      <MenuRight />
      <Header
        as="h1"
        inverted
        content="Aspect Based Sentiment Analysis"
        style={{
          fontSize: "4em",
          fontWeight: "normal",
          marginBottom: 0,
          marginTop: "2em",
        }}
      />
      <Header
        as="h2"
        inverted
        content="Unleash the Power of Sentiment Analysis with Aspect-Based Insights"
        style={{
          fontSize: "1.5em",
          fontWeight: "normal",
          marginTop: "1.5em",
          marginBottom: "3em",
        }}
      />
    </Container>
  </Segment>
);

export default LandingSegment;
