import "./Home.css";

import ApiCards from "./ApiCards";
import LandingSegment from "./LandingSegment";
import ExampleSection from "./ExampleSection";

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
