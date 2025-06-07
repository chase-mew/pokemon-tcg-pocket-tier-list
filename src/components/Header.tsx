import styled from "styled-components";

import Logo from "./Logo";
import Socials from "./Socials";

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
`;

const Header = () => {
  return (
    <StyledHeader>
      <Logo />
      <Socials />
    </StyledHeader>
  );
};

export default Header;
