import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import useDecks, { FullDeckType, MatchupType } from "../../app/use-decks";
import useMissing from "../../app/use-missing";
import DeckCard from "../../components/DeckCard";
import { MIN_MATCHUP_GAMES, WINRATE_THRESHOLD } from "../../app/config";
import { useEffect, useState } from "react";
import useIsPremium from "../../app/use-is-premium";
import UserAccount from "../../components/UserAccount";

const StyledDeckPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  padding: 3rem;
  gap: 3rem;

  @media (max-width: 900px) {
    padding: 2.4rem;
    flex-direction: column;
    align-items: center;
  }
`;

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
  flex: 1;
  width: calc(100% - 35rem - 3rem);

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const PannelSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.4rem;
  width: 35rem;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const DeckFinderHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  background: var(--e);
  color: var(--bg);
  font-size: 3.2rem;
  font-weight: 500;
  text-align: center;
  padding: 0 4rem;

  @media (max-width: 900px) {
    font-size: 2.4rem;
    height: auto;
    padding: 2rem;
  }
`;

const RelativeStrength = styled.div<{ $relativeScore: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  background: ${(props) => {
    const colors = [
      "var(--s)",
      "var(--a)",
      "var(--b)",
      "var(--c)",
      "var(--d)",
      "var(--e)",
    ];
    const index = Math.floor(props.$relativeScore * (colors.length - 1));
    return colors[index];
  }};
  color: var(--bg);
  font-size: 3.2rem;
  font-weight: 500;
  text-align: center;
  padding: 0 4rem;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    font-size: 2.4rem;
    height: auto;
    padding: 2rem;
  }
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 2.4rem;
  width: 100%;
  max-width: 160rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CardContainer = styled.button`
  position: relative;
  width: 100%;
  cursor: pointer;
`;

const CardImage = styled.img`
  width: 100%;
`;

const CardNumber = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--s);
  color: var(--bg);
  height: 4rem;
  width: 4rem;
  transform: translate(30%, 30%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2.8rem;
  font-weight: 500;
  border-radius: 50%;

  @media (max-width: 900px) {
    height: 3rem;
    width: 3rem;
    font-size: 2rem;
  }
`;

const Overlay = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
`;

const StyledLink = styled(Link)`
  color: var(--main);
  font-weight: 500;
  font-size: 2rem;
  margin-left: 5px;
  text-decoration: underline;
`;

const Matchups = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2.4rem;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const SubHeader = styled.div<{ $backgroundColor: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  background: ${(props) => props.$backgroundColor};
  color: var(--bg);
  font-size: 2.8rem;
  font-weight: 500;
  opacity: 0.9;
`;

const MatchupSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 2.4rem;
  height: auto;

  @media (max-width: 900px) {
    width: 100%;
  }
`;

const MatchupList = styled.div<{ $blur?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1.2rem;
  flex: 1;
  width: 100%;
  filter: ${(props) => (props.$blur ? "blur(10px) saturate(1.2)" : "none")};

  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  }
`;

const MatchupContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 1.2rem;
`;

const DeckCardContainer = styled.div`
  position: relative;
  height: 10rem;
  aspect-ratio: 1 / 1;

  @media (max-width: 900px) {
    height: 12rem;
  }
`;

const MatchupLabel = styled.div<{ $winRate: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 2.4rem;
  font-weight: 500;
  color: ${(props) =>
    props.$winRate > WINRATE_THRESHOLD ? "var(--e)" : "var(--s)"};

  @media (max-width: 900px) {
    font-size: 2rem;
  }
`;

const KeyStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const KeyStat = styled.div`
  font-size: 2.4rem;
  font-weight: 400;
`;

const KeyStatValue = styled.span`
  font-size: 2.4rem;
  font-weight: 500;
`;

const DeckPage = () => {
  const deckId = useParams().deckId;
  const decks = useDecks();
  const { addMissing } = useMissing();
  const { t } = useTranslation();
  const [bestScore, setBestScore] = useState<number | null>(null);
  const isPremium = useIsPremium();

  useEffect(() => {
    if (deckId) return;
    if (bestScore) return;
    if (!decks) return;
    const bestDeck = decks.sort((a, b) => b.score - a.score)[0];
    setBestScore(bestDeck.score);
  }, [deckId, decks, bestScore]);

  if (!decks) return <Overlay>Loading...</Overlay>;

  let deck: FullDeckType | undefined = undefined;

  if (deckId) {
    deck = decks.find((deck) => deck.id === deckId);
  } else {
    deck = decks.sort((a, b) => b.score - a.score)[0];
  }

  const relativeScore = deck ? deck.score / (bestScore ?? 1) : 0;

  if (!deck) {
    return (
      <Overlay>
        {t("deckPage.notEnoughCards")},{" "}
        <StyledLink to="/tier-list">{t("deckPage.tryAnotherDeck")}</StyledLink>
      </Overlay>
    );
  }

  const uniqueCards =
    deck &&
    deck.cards.filter(
      (card, index, self) => self.findIndex((c) => c.id === card.id) === index
    );

  const isDeckFinderMode = !deckId;

  return (
    <StyledDeckPage>
      <CardSection>
        {isDeckFinderMode && (
          <>
            <DeckFinderHeader>
              {t("deckPage.deckFinderHeader")}
            </DeckFinderHeader>
            <RelativeStrength $relativeScore={relativeScore}>
              {t("deckPage.relativeStrength")}{" "}
              {`${(relativeScore * 100).toFixed(0)}%`}
            </RelativeStrength>
          </>
        )}
        <CardList>
          {uniqueCards.map((card) => (
            <CardContainer
              key={card.id}
              onClick={() => {
                if (!deck) return;
                const count = deck.cards.filter((c) => c.id === card.id).length;
                if (count === 1) {
                  addMissing([card.id, card.id]);
                } else {
                  addMissing([card.id]);
                }
              }}
            >
              <CardImage src={card.image} alt={card.name} />
              <CardNumber>
                {deck && deck.cards.filter((c) => c.id === card.id).length}
              </CardNumber>
            </CardContainer>
          ))}
        </CardList>
      </CardSection>
      {!isDeckFinderMode && (
        <PannelSection>
          <UserAccount showUpsell hideIfPremium />
          <Matchups>
            <MatchupSection>
              <SubHeader $backgroundColor="var(--c)">
                {t("deckPage.keyStats")}
              </SubHeader>
              <KeyStats>
                <KeyStat>
                  {t("deckPage.strength")}:{" "}
                  <KeyStatValue>{(deck.strength * 10).toFixed(1)}</KeyStatValue>
                </KeyStat>
                <KeyStat>
                  {t("deckPage.popularity")}:{" "}
                  <KeyStatValue>
                    {(deck.popularity * 10).toFixed(1)}
                  </KeyStatValue>
                </KeyStat>
                <KeyStat>
                  {t("deckPage.winRate")}:{" "}
                  <KeyStatValue>
                    {(
                      deck.matchups.find((matchup) => matchup.name === "Total")!
                        .winRate * 100
                    ).toFixed(0)}
                    %
                  </KeyStatValue>
                </KeyStat>
              </KeyStats>
            </MatchupSection>
            <MatchupSection>
              <SubHeader $backgroundColor="var(--e)">
                {t("deckPage.strongAgainst")}
              </SubHeader>
              <MatchupList $blur={!isPremium}>
                {deck.matchups
                  .filter((matchup) => matchup.totalGames > MIN_MATCHUP_GAMES)
                  .filter((matchup) => matchup.winRate > WINRATE_THRESHOLD)
                  .filter((matchup) => deck && matchup.name !== deck.name)
                  .filter((matchup) =>
                    decks.some((deck) => deck.name === matchup.name)
                  )
                  .sort((a, b) => b.winRate - a.winRate)
                  .sort(
                    (a, b) =>
                      decks.find((deck) => deck.name === a.name)!.place -
                      decks.find((deck) => deck.name === b.name)!.place
                  )
                  .slice(0, 6)
                  .map((matchup: MatchupType) => (
                    <MatchupContainer key={matchup.name}>
                      <DeckCardContainer>
                        <DeckCard
                          deck={
                            decks.find((deck) => deck.name === matchup.name)!
                          }
                        />
                      </DeckCardContainer>
                      <MatchupLabel $winRate={matchup.winRate}>
                        {`${(matchup.winRate * 100).toFixed(0)}%`}
                      </MatchupLabel>
                    </MatchupContainer>
                  ))}
              </MatchupList>
            </MatchupSection>
            <MatchupSection>
              <SubHeader $backgroundColor="var(--s)">
                {t("deckPage.weakAgainst")}
              </SubHeader>
              <MatchupList $blur={!isPremium}>
                {deck.matchups
                  .filter((matchup) => !!matchup)
                  .filter((matchup) => matchup.totalGames > MIN_MATCHUP_GAMES)
                  .filter((matchup) => matchup.winRate <= WINRATE_THRESHOLD)
                  .filter((matchup) => deck && matchup.name !== deck.name)
                  .filter((matchup) =>
                    decks.some((deck) => deck.name === matchup.name)
                  )
                  .sort((a, b) => a.winRate - b.winRate)
                  .slice(0, 6)
                  .map((matchup: MatchupType) => (
                    <MatchupContainer key={matchup.name}>
                      <DeckCardContainer>
                        <DeckCard
                          deck={
                            decks.find((deck) => deck.name === matchup.name)!
                          }
                        />
                      </DeckCardContainer>
                      <MatchupLabel $winRate={matchup.winRate}>
                        {`${(matchup.winRate * 100).toFixed(0)}%`}
                      </MatchupLabel>
                    </MatchupContainer>
                  ))}
              </MatchupList>
            </MatchupSection>
          </Matchups>
        </PannelSection>
      )}
    </StyledDeckPage>
  );
};

export default DeckPage;
