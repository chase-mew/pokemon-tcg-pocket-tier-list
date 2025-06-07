import styled, { keyframes } from "styled-components";
import Header from "../../components/Header";
import tierList from "../../assets/tier-list.jpeg";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const rainbowAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

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
  gap: 4rem;
`;

const StyledHeader = styled.h1`
  font-size: 6rem;
  font-weight: 600;
`;

const StyledSubheader = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  max-width: 65rem;
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
`;

const ImageContainer = styled.div<{ $rotateX: number; $rotateY: number }>`
  padding: 4px;
  border-radius: 16px;
  background: linear-gradient(
    45deg,
    var(--s),
    var(--a),
    var(--b),
    var(--c),
    var(--d),
    var(--e),
    var(--s)
  );
  background-size: 300% 300%;
  animation: ${rainbowAnimation} 8s ease infinite;
  transform-style: preserve-3d;
  transform: rotateX(${(props) => props.$rotateX}deg)
    rotateY(${(props) => props.$rotateY}deg);
  transition: transform 0.1s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Image = styled.img`
  width: 30dvw;
  object-fit: cover;
  border-radius: 12px;
  display: block;
`;

const Hero = () => {
  const navigate = useNavigate();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 5;

      setRotateX(rotateX);
      setRotateY(rotateY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <StyledHero>
      <Header />
      <Content>
        <TextSection>
          <StyledHeader>
            Pokemon TCG Pocket <br /> Best Decks and Tier List
          </StyledHeader>
          <StyledSubheader>
            Stay ahead of the Pokemon TCG Pocket meta with a data driven deck
            tier list. Built from tournament results, find full lists, mark the
            cards you're missing, and uncover the strongest builds you can craft
            right now.
          </StyledSubheader>
          <div>
            <Button action={() => navigate("/tier-list")}>
              View Tier List
            </Button>
          </div>
        </TextSection>
        <ImageSection ref={containerRef}>
          <ImageContainer $rotateX={rotateX} $rotateY={rotateY}>
            <Image src={tierList} alt="Tier List" />
          </ImageContainer>
        </ImageSection>
      </Content>
    </StyledHero>
  );
};

export default Hero;
