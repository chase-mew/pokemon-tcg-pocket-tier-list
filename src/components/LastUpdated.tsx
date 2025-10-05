import styled from "styled-components";
import { LAST_UPDATED } from "../app/last-updated";
import dateformat from "dateformat";

const StyledLastUpdated = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  font-size: 1.4rem;
  color: var(--main);
`;

const LastUpdated = () => {
  return (
    <StyledLastUpdated>
      Last updated: {dateformat(LAST_UPDATED, "yyyy-mm-dd HH:MM:ss")}
    </StyledLastUpdated>
  );
};

export default LastUpdated;
