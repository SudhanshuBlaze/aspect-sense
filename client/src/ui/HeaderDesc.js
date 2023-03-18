import { Header, Segment } from "semantic-ui-react";
const HeaderDesc = ({ header, description, as = "h1" }) => {
  return (
    <Segment textAlign="center" style={{ marginTop: 20, marginBottom: 40 }}>
      <Header as={as}>{header}.</Header>
      <p style={{ textAlign: "left" }}>{description}</p>
    </Segment>
  );
};

export default HeaderDesc;
