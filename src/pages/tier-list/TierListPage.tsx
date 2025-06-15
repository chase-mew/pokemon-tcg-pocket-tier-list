import styled from "styled-components";
import useDecks from "../../app/use-decks";
import DeckCard from "../../components/DeckCard";
import useFilters from "../../app/use-filters";
import ArrowDown from "../../assets/arrow-down.svg";
import { useTranslation } from "react-i18next";
import useIsPremium from "../../app/use-is-premium";
import UserAccount from "../../components/UserAccount";
import { SortBy } from "../../components/FilterContext";
import { getSortValue } from "../../app/sorting-helper";

const StyledTierListPage = styled.div`
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

const DeckAmountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.4rem;
  color: var(--main);
`;

const DeckAmountSelect = styled(EnergySelect)`
  min-width: 8rem;
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
  const {
    energy,
    setEnergy,
    includeEx,
    setIncludeEx,
    deckAmount,
    setDeckAmount,
    sortBy,
    setSortBy,
  } = useFilters();
  const { t } = useTranslation();
  const isPremium = useIsPremium();

  if (!decks) return <Loading>Loading...</Loading>;

  const bestScore = getSortValue(decks[0], sortBy);

  const worstScore = getSortValue(decks[decks.length - 1], sortBy);

  const steps = (bestScore - worstScore) / 6;

  const sTier = decks.filter(
    (deck) => getSortValue(deck, sortBy) >= bestScore - steps
  );
  const aTier = decks.filter(
    (deck) =>
      getSortValue(deck, sortBy) < bestScore - steps &&
      getSortValue(deck, sortBy) >= bestScore - steps * 2
  );
  const bTier = decks.filter(
    (deck) =>
      getSortValue(deck, sortBy) < bestScore - steps * 2 &&
      getSortValue(deck, sortBy) >= bestScore - steps * 3
  );
  const cTier = decks.filter(
    (deck) =>
      getSortValue(deck, sortBy) < bestScore - steps * 3 &&
      getSortValue(deck, sortBy) >= bestScore - steps * 4
  );
  const dTier = decks.filter(
    (deck) =>
      getSortValue(deck, sortBy) < bestScore - steps * 4 &&
      getSortValue(deck, sortBy) >= bestScore - steps * 5
  );
  const eTier = decks.filter(
    (deck) => getSortValue(deck, sortBy) < bestScore - steps * 5
  );

  return (
    <StyledTierListPage>
      <FilterContainer>
        <UserAccount showUpsell />
        {isPremium && (
          <>
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
            <DeckAmountContainer>
              {t("filter.deckAmount")}
              <DeckAmountSelect
                value={deckAmount}
                onChange={(e) => setDeckAmount(Number(e.target.value))}
              >
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((amount) => (
                  <option key={amount} value={amount}>
                    {amount}
                  </option>
                ))}
              </DeckAmountSelect>
            </DeckAmountContainer>
            <DeckAmountContainer>
              {t("filter.sortBy")}
              <DeckAmountSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
              >
                {[SortBy.SCORE, SortBy.POPULARITY, SortBy.STRENGTH].map(
                  (sortByOption) => (
                    <option key={sortByOption} value={sortByOption}>
                      {t(`filter.${sortByOption}`)}
                    </option>
                  )
                )}
              </DeckAmountSelect>
            </DeckAmountContainer>
          </>
        )}
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
    </StyledTierListPage>
  );
};

export default LandingPage;
