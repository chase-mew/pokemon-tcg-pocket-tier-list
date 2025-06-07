import { useState } from "react";
import styled from "styled-components";
import InfoIcon from "./InfoIcon";
import InfoModal from "./InfoModal";
import { useLocation } from "react-router-dom";
import { SOCIALS } from "../app/constants";

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 16px;
`;

const IconLink = styled.a`
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const IconButton = styled.button`
  color: var(--text);
  opacity: 0.7;
  transition: opacity 0.2s;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Footer = () => {
  const location = useLocation();

  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  if (location.pathname === "/") return null;

  return (
    <FooterContainer>
      <IconButton
        onClick={() => setIsInfoModalOpen(true)}
        aria-label="Information about this website"
      >
        <InfoIcon />
      </IconButton>

      {SOCIALS.map((social) => (
        <IconLink
          key={social.url}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
        >
          <Icon src={social.icon} alt={social.alt} />
        </IconLink>
      ))}

      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </FooterContainer>
  );
};

export default Footer;
