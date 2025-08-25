import styled from "styled-components";
import UserAccount from "../../components/UserAccount";
import useCards from "../../app/use-cards";
import ArrowDown from "../../assets/arrow-down.svg";
import useFilters from "../../app/use-filters";
import { EXPANSION_CODES, getExpansionName } from "../../app/expansion-names";
import ExpansionIcon from "../../components/ExpansionIcon";

const StyledExpansionListPage = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    height: auto;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: absolute;
  top: 2rem;
  right: 2rem;
  gap: 1.5rem;
  z-index: 10;

  @media (max-width: 900px) {
    position: relative;
    top: 0;
    right: 0;
    margin: 2rem;
    width: calc(100% - 4rem);
    justify-content: space-between;
    align-items: center;
  }
`;

const DeckRow = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 0.4rem solid var(--border);

  /* Gradient on right side */
  @media (min-width: 900px) {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--bg));
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const RowHeader = styled.div<{ $backgroundColor: string }>`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: ${(props) => props.$backgroundColor};
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.3rem;
  font-weight: 400;

  @media (max-width: 900px) {
    width: 100%;
    height: 8rem;
  }
`;

const RowContent = styled.div`
  height: 100%;
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 2rem;
  width: 100%;

  @media (min-width: 900px) {
    overflow-x: auto;
  }

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 2rem;
  }
`;

const Loading = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
`;

const Dropdown = styled.select`
  padding: 0.8rem 4rem 0.8rem 1.2rem;
  font-size: 1.6rem;
  border-radius: 0.4rem;
  background: var(--bg);
  color: var(--main);
  border: 1px solid var(--main);
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url(${ArrowDown});
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  background-size: 1.2em 1.2em;

  &:hover {
    border-color: var(--a);
  }
`;

const ExpansionListPage = () => {
  const cards = useCards();
  const { expansion, setExpansion } = useFilters();

  if (!cards) return <Loading>Loading...</Loading>;

  interface ExpansionData {
    code: string;
    totalScore: number;
  }

  const expansionData: ExpansionData[] = EXPANSION_CODES.filter(
    (code) => code !== "pa"
  )
    .map((code) => {
      return {
        code: code,
        totalScore: cards
          .filter((card) => card.set === code)
          .reduce((acc, card) => acc + card.score, 0),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const bestScore = expansionData[0].totalScore;

  const worstScore = expansionData[expansionData.length - 1].totalScore;

  const steps = (bestScore - worstScore) / 6;

  const sTier = expansionData.filter(
    (data) => data.totalScore >= bestScore - steps
  );
  const aTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps &&
      data.totalScore >= bestScore - steps * 2
  );
  const bTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps * 2 &&
      data.totalScore >= bestScore - steps * 3
  );
  const cTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps * 3 &&
      data.totalScore >= bestScore - steps * 4
  );
  const dTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps * 4 &&
      data.totalScore >= bestScore - steps * 5
  );
  const eTier = expansionData.filter(
    (data) => data.totalScore < bestScore - steps * 5
  );

  return (
    <StyledExpansionListPage>
      <FilterContainer>
        <UserAccount showUpsell />
        <Dropdown
          value={expansion ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setExpansion(value === "" ? null : value);
          }}
        >
          <option value="">All</option>
          {EXPANSION_CODES.map((code) => (
            <option key={code} value={code}>
              {getExpansionName(code)}
            </option>
          ))}
        </Dropdown>
      </FilterContainer>
      <DeckRow>
        <RowHeader $backgroundColor="var(--s)">S</RowHeader>
        <RowContent>
          {sTier.map((data) => (
            <ExpansionIcon key={data.code} expansionCode={data.code} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--a)">A</RowHeader>
        <RowContent>
          {aTier.map((data) => (
            <ExpansionIcon key={data.code} expansionCode={data.code} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--b)">B</RowHeader>
        <RowContent>
          {bTier.map((data) => (
            <ExpansionIcon key={data.code} expansionCode={data.code} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--c)">C</RowHeader>
        <RowContent>
          {cTier.map((data) => (
            <ExpansionIcon key={data.code} expansionCode={data.code} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--d)">D</RowHeader>
        <RowContent>
          {dTier.map((data) => (
            <ExpansionIcon key={data.code} expansionCode={data.code} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--e)">E</RowHeader>
        <RowContent>
          {eTier.map((data) => (
            <ExpansionIcon key={data.code} expansionCode={data.code} />
          ))}
        </RowContent>
      </DeckRow>
    </StyledExpansionListPage>
  );
};

export default ExpansionListPage;
