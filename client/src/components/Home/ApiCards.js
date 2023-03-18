import { Card, Container } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const ApiCards = () => {
  const navigate = useNavigate();
  const cardDetails = [
    {
      header: "Single Review ABSA",
      description:
        "Performs Aspect-Based Sentiment Analysis (ABSA) for a single review using either GPT-3 or Spacy based engine. Returns the sentiment polarity and aspect category for each sentence in the review.",
      route: "/single_review",
    },
    {
      header: "Review Scraper ABSA",
      description:
        "Scrape reviews from a Google maps URL and generate Aspect-Based Sentiment Analysis (ABSA) for each review along with a word cloud.",
      route: "/scrapper_pipeline",
    },
  ];

  return (
    <Container style={{ marginTop: "3em" }}>
      <Card.Group doubling itemsPerRow={2}>
        {cardDetails.map((card, idx) => (
          <Card key={idx} raised link onClick={() => navigate(card.route)}>
            <Card.Content>
              <Card.Header>{card.header}</Card.Header>
              <Card.Description>{card.description}</Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </Container>
  );
};

export default ApiCards;
