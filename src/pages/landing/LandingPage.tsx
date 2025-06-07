import styled from "styled-components";
import Hero from "./Hero";

const StyledLandingPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 150rem;
`;

const LandingPage = () => {
  return (
    <StyledLandingPage>
      <Hero />
    </StyledLandingPage>
  );
};

export default LandingPage;
