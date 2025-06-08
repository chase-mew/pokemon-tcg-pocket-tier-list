import styled from "styled-components";
import { useState } from "react";

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 0.8rem;
`;

const TooltipIcon = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  border: 1px solid var(--main);
  color: var(--main);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: help;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const TooltipContent = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 100%;
  margin-bottom: 0.8rem;
  background: var(--bg);
  border: 1px solid var(--main);
  padding: 1.2rem;
  border-radius: 0.4rem;
  font-size: 1.6rem;
  color: var(--main);
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};
  transition: all 0.2s ease;
  z-index: 1000;
  width: 30rem;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 0.6rem;
    border-style: solid;
    border-color: var(--main) transparent transparent transparent;
  }
`;

interface Props {
  text: string;
}

const Tooltip = ({ text }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipContainer>
      <TooltipIcon
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        ?
      </TooltipIcon>
      <TooltipContent $isVisible={isVisible}>{text}</TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
