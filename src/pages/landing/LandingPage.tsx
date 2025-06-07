import styled from "styled-components";
import Hero from "./Hero";
import Header from "../../components/Header";
import Features from "./Features";
import BestDeckFinder from "./BestDeckFinder";

const StyledLandingPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150rem;
  margin: 0 auto;
  background-color: var(--bg);
`;

const LandingPage = () => {
  return (
    <StyledLandingPage>
      <Hero />
      <Features />
      <BestDeckFinder />
      <Header />
    </StyledLandingPage>
  );
};

export default LandingPage;
