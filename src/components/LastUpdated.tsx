import styled from "styled-components";
import { LAST_UPDATED } from "../app/last-updated";
import dateformat from "dateformat";
import { useTranslation } from "react-i18next";

const StyledLastUpdated = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  font-size: 1.4rem;
  color: var(--main);
`;

const LastUpdated = () => {
  const { t } = useTranslation();

  return (
    <StyledLastUpdated>
      {t("lastUpdated")} {dateformat(LAST_UPDATED, "yyyy/mm/dd h:MM tt")}
    </StyledLastUpdated>
  );
};

export default LastUpdated;
