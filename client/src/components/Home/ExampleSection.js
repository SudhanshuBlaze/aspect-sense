import { Card, Container, Header, Image } from "semantic-ui-react";

const ExampleSection = () => {
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

  return (
    <Container>
      <div className="example-section-container">
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
};

export default ExampleSection;
