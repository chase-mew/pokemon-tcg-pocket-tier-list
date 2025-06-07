import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";
import Socials from "./Socials";
import { useTranslation } from "react-i18next";

const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
`;

const Nav = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 4rem;
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--main);
  text-decoration: none;
  opacity: ${(props) => (props.$active ? 1 : 0.7)};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const Header = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <StyledHeader>
      <Logo />
      <Nav>
        <NavItem to="/tier-list" $active={location.pathname === "/tier-list"}>
          {t("header.tierList")}
        </NavItem>
        <NavItem to="/deck" $active={location.pathname === "/deck"}>
          {t("header.bestDeckFinder")}
        </NavItem>
      </Nav>
      <Socials />
    </StyledHeader>
  );
};

export default Header;
