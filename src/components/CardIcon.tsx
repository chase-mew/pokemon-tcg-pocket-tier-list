import styled from "styled-components";
import { CardScoreType } from "../app/use-cards";

const Container = styled.div`
  position: relative;
  height: 100%;

  @media (max-width: 900px) {
    height: auto;
    width: 100%;
    aspect-ratio: 1 / 1;
  }
`;

const StyledCardIcon = styled.div<{ $disabled: boolean }>`
  position: relative;
  border-radius: 1.2rem;
  color: var(--bg);
  display: flex;
  height: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;

  filter: ${(props) => (props.$disabled ? "grayscale(1)" : "none")};
  opacity: ${(props) => (props.$disabled ? 0.5 : 1)};
`;

const CardImage = styled.img`
  position: absolute;
  top: -40%;
  left: 50%;
  transform: translateX(-50%);
  height: 280%;
`;

interface Props {
  card: CardScoreType;
}

const CardIcon = ({ card }: Props) => {
  return (
    <Container>
      <StyledCardIcon $disabled={false}>
        <CardImage key={card.id} src={card.image} alt={card.name} />
      </StyledCardIcon>
    </Container>
  );
};

export default CardIcon;
