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

const spinAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  width: 2.4rem;
  height: 2.4rem;
  border: 3px solid var(--bg);
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const StyledButton = styled.button<{ $isLoading: boolean; $wide: boolean }>`
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
  cursor: ${(props) => (props.$isLoading ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  border: 2px solid transparent;
  position: relative;
  width: ${(props) => (props.$wide ? "100%" : "auto")};

  &:hover {
    transform: ${(props) => (props.$isLoading ? "none" : "scale(1.02)")};
    box-shadow: ${(props) =>
      props.$isLoading ? "none" : "0 0 15px rgba(255, 255, 255, 0.3)"};
  }

  &:disabled {
    opacity: 0.7;
  }
`;

interface Props {
  action: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  wide?: boolean;
}

const Button = ({
  action,
  children,
  isLoading = false,
  wide = false,
}: Props) => {
  return (
    <StyledButton
      onClick={action}
      disabled={isLoading}
      $isLoading={isLoading}
      $wide={wide}
    >
      {!isLoading && children}
      {isLoading && <Spinner />}
    </StyledButton>
  );
};

export default Button;
