import styled from "styled-components";
import { SOCIALS } from "../app/constants";

const Container = styled.div`
  display: flex;
  gap: 2rem;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
`;

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Socials = () => {
  return (
    <Container>
      {SOCIALS.map((social) => (
        <Link
          key={social.url}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
        >
          <Icon src={social.icon} alt={social.alt} />
        </Link>
      ))}
    </Container>
  );
};

export default Socials;
