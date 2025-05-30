import styled from "styled-components";
import useDecks from "../../app/use-decks";
import DeckCard from "../../components/DeckCard";
import useFilters from "../../app/use-filters";
import ArrowDown from "../../assets/arrow-down.svg";
import { useTranslation } from "react-i18next";

const StyledLandingPage = styled.div`
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

  @media (max-width: 900px) {
    position: relative;
    top: 0;
    right: 0;
    margin: 2rem;
    width: calc(100% - 4rem);
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const EnergySelect = styled.select`
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

const IncludeExContainer = styled.label`
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: var(--main);
  cursor: pointer;
  user-select: none;
  gap: 0.8rem;
`;

const IncludeExCheckbox = styled.input.attrs({ type: "checkbox" })`
  width: 1.6rem;
  height: 1.6rem;
  accent-color: var(--e);
  background: var(--bg);
  border: 2px solid var(--main);
  border-radius: 0.3rem;
  margin-left: 0.8rem;
  cursor: pointer;
`;

const DeckRow = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 0.4rem solid var(--border);

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

const ENERGY_TYPES = [
  "Grass",
  "Fire",
  "Water",
  "Lightning",
  "Psychic",
  "Fighting",
  "Darkness",
  "Metal",
  "Dragon",
  "Colorless",
];

const LandingPage = () => {
  const decks = useDecks();
  const { energy, setEnergy, includeEx, setIncludeEx } = useFilters();
  const { t } = useTranslation();

  if (!decks) return <Loading>Loading...</Loading>;

  const bestScore = decks.reduce(
    (best, deck) => (deck.score > best ? deck.score : best),
    0
  );

  const worstScore = decks.reduce(
    (worst, deck) => (deck.score < worst ? deck.score : worst),
    1000000
  );

  const steps = (bestScore - worstScore) / 6;

  const sTier = decks.filter((deck) => deck.score >= bestScore - steps);
  const aTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps && deck.score >= bestScore - steps * 2
  );
  const bTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps * 2 && deck.score >= bestScore - steps * 3
  );
  const cTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps * 3 && deck.score >= bestScore - steps * 4
  );
  const dTier = decks.filter(
    (deck) =>
      deck.score < bestScore - steps * 4 && deck.score >= bestScore - steps * 5
  );
  const eTier = decks.filter((deck) => deck.score < bestScore - steps * 5);

  return (
    <StyledLandingPage>
      <FilterContainer>
        <EnergySelect
          value={energy ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setEnergy(value === "" ? null : value);
          }}
        >
          <option value="">{t("energyDropdown.all")}</option>
          {ENERGY_TYPES.map((type) => (
            <option key={type} value={type}>
              {t(`energyDropdown.${type}`)}
            </option>
          ))}
        </EnergySelect>
        <IncludeExContainer>
          {t("filter.includeEx")}
          <IncludeExCheckbox
            type="checkbox"
            checked={includeEx}
            onChange={(e) => setIncludeEx(e.target.checked)}
          />
        </IncludeExContainer>
      </FilterContainer>

      <DeckRow>
        <RowHeader $backgroundColor="var(--s)">S</RowHeader>
        <RowContent>
          {sTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--a)">A</RowHeader>
        <RowContent>
          {aTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--b)">B</RowHeader>
        <RowContent>
          {bTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--c)">C</RowHeader>
        <RowContent>
          {cTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--d)">D</RowHeader>
        <RowContent>
          {dTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--e)">E</RowHeader>
        <RowContent>
          {eTier.map((deck) => (
            <DeckCard key={deck.id} deck={deck} />
          ))}
        </RowContent>
      </DeckRow>
    </StyledLandingPage>
  );
};

export default LandingPage;
