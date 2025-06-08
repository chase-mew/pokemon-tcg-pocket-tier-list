import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div<{ $width?: string }>`
  background: var(--bg);
  color: var(--text);
  padding: 3rem;
  border-radius: 12px;
  max-width: ${(props) => props.$width || "70rem"};
  width: 100%;
  margin: 0 2rem;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 1.25rem;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: none;
  border: none;
  color: var(--text);
  font-size: 2.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  margin: 0 0 2.5rem 0;
  font-size: 2.5rem;
  line-height: 1.2;
`;

interface Props {
  isOpen: boolean;
  header: string;
  close: () => void;
  children: React.ReactNode;
  width?: string;
}

const Popup: React.FC<Props> = ({ isOpen, header, close, children, width }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={close}>
      <ModalContent onClick={(e) => e.stopPropagation()} $width={width}>
        <CloseButton onClick={close}>×</CloseButton>
        <Title>{t(header)}</Title>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Popup;
