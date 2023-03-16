import "./Home.css";
import {
  Container,
  Header,
  Card,
  Image,
  Segment,
  Menu,
  Icon,
  Button,
} from "semantic-ui-react";

const cardDetails = [
  {
    header: "Card 1",
    description:
      "This is the first card. It contains some sample content that you can replace with your own.",
  },
  {
    header: "Card 2",
    description:
      "This is the second card. It contains some sample content that you can replace with your own.",
  },
  {
    header: "Card 3",
    description:
      "This is the third card. It contains some sample content that you can replace with your own.",
  },
];

const exampleReview = {
  text: "I went to this restaurant last night and the food was amazing. However, the service was terrible. The waiter was rude and inattentive. Overall, I would recommend this place for the food, but the service needs improvement.",
  aspects: [
    {
      name: "food",
      descriptors: ["amazing"],
      polarity: "positive",
    },
    {
      name: "service",
      descriptors: ["terrible", "rude", "inattentive", "needs improvement"],
      polarity: "negative",
    },
  ],
};

const MenuRight = () => (
  <Menu inverted pointing secondary size="large">
    <Menu.Item position="right">
      <Button as="a" inverted>
        Log in
      </Button>
      <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
        Sign Up
      </Button>
    </Menu.Item>
  </Menu>
);

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

const ExampleSection = () => (
  <Container>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ width: "50%" }}>
        <Header
          as="h2"
          content="Example: Analyzing Restaurant Reviews"
          style={{ fontSize: "2em", fontWeight: "normal" }}
        />
        <p style={{ fontSize: "1.1em" }}>
          Let's say you're a restaurant owner and you want to know how people
          feel about the food, service, ambiance, and other aspects of your
          restaurant. With aspect-based sentiment analysis, you can analyze
          customer reviews to get insights into each aspect of your business.
          Here's an example:
        </p>
      </div>

      <Card style={{ width: "40%" }} fluid>
        <Image
          src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
          size="small"
          wrapped
        />
        <Card.Content extra>
          <Card.Description>{exampleReview.text}</Card.Description>
        </Card.Content>
        <Card.Content>
          {exampleReview.aspects.map((aspect, index) => (
            <div key={index}>
              <b>{aspect.name}:</b> {aspect.descriptors.join(", ")} (
              {aspect.polarity})
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  </Container>
);

const ApiCards = () => (
  <Container style={{ marginTop: "3em" }}>
    <Card.Group itemsPerRow={3} style={{ marginBottom: "3em" }}>
      {cardDetails.map(card => (
        <Card>
          <Card.Content>
            <Card.Header>{card.header}</Card.Header>
            <Card.Description>{card.description}</Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  </Container>
);

const Home = () => {
  return (
    <>
      <LandingSegment />
      <ApiCards />
      <ExampleSection />
    </>
  );
};

export default Home;
