import styled from "styled-components";

const Container = styled.div`
  position: relative;
  height: 100%;

  @media (max-width: 900px) {
    height: auto;
    width: 100%;
    aspect-ratio: 1 / 1;
  }
`;

const CardImage = styled.img`
  height: 100%;
`;

interface Props {
  expansionCode: string;
}

const ExpansionIcon = ({ expansionCode }: Props) => {
  const chars = expansionCode.split("");
  const number = chars.find((char) => !isNaN(Number(char)));
  const beforeNumber = chars.slice(0, chars.indexOf(number ?? "")).join("");
  const afterNumber = chars.slice(chars.indexOf(number ?? "") + 1).join("");

  const expansionName = `${beforeNumber.toUpperCase()}${number}${afterNumber}`;

  return (
    <Container>
      <CardImage
        src={`https://assets.pokemon-zone.com/game-assets/UI/Textures/System/Exp/LOGO_expansion_${expansionName}_en_US.webp`}
      />
    </Container>
  );
};

export default ExpansionIcon;
