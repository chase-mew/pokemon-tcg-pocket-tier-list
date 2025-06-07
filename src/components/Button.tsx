import styled, { keyframes } from "styled-components";

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

const StyledButton = styled.button`
  height: 5.4rem;
  padding: 0 3.2rem;
  border-radius: 0.8rem;
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
  color: var(--bg);
  font-size: 2.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
`;

interface Props {
  action: () => void;
  children: React.ReactNode;
}

const Button = ({ action, children }: Props) => {
  return <StyledButton onClick={action}>{children}</StyledButton>;
};

export default Button;
