import styled from "styled-components";
import Header from "../../components/Header";
import tierList from "../../assets/tier-list.jpeg";

const StyledHero = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  align-items: center;
  flex: 1;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 2rem;
`;

const StyledHeader = styled.h1`
  font-size: 6rem;
  font-weight: 600;
`;

const StyledSubheader = styled.h2`
  font-size: 2rem;
  font-weight: 600;
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = styled.img`
  width: 30dvw;
  object-fit: cover;
`;

const Hero = () => {
  return (
    <StyledHero>
      <Header />
      <Content>
        <TextSection>
          <StyledHeader>
            Pokemon TCG Pocket Best Decks and Tier List
          </StyledHeader>
          <StyledSubheader>
            Stay ahead of the Pokemon TCG Pocket meta with a data driven deck
            tier list. Built from tournament results, find full lists, mark the
            cards you're missing, and uncover the strongest builds you can craft
            right now.
          </StyledSubheader>
        </TextSection>
        <ImageSection>
          <Image src={tierList} alt="Tier List" />
        </ImageSection>
      </Content>
    </StyledHero>
  );
};

export default Hero;
