import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import useDecks, { FullDeckType, MatchupType } from "../../app/use-decks";
import useMissing from "../../app/use-missing";
import DeckCard from "../../components/DeckCard";
import { MIN_MATCHUP_GAMES } from "../../app/config";

const StyledDeckPage = styled.div`
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4.8rem;
  gap: 8rem;

  @media (max-width: 900px) {
    padding: 2.4rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2.4rem;
`;

const Header = styled.div`
  display: flex;
  display: none;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 8rem;
  background: var(--a);
  color: var(--bg);
  font-size: 5rem;
  font-weight: 500;
`;

const CardList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
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

const Link = styled.button`
  color: var(--main);
  font-weight: 500;
  font-size: 2rem;
  margin-left: 5px;
  text-decoration: underline;
`;

const Matchups = styled.div`
  display: flex;
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
  height: 8rem;
  background: ${(props) => props.$backgroundColor};
  color: var(--bg);
  font-size: 4rem;
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

const MatchupList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  gap: 2.4rem;
  flex: 1;
  width: 100%;

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
  height: 15rem;
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
  color: ${(props) => (props.$winRate > 0.5 ? "var(--e)" : "var(--s)")};

  @media (max-width: 900px) {
    font-size: 2rem;
  }
`;

const DeckPage = () => {
  const deckId = useParams().deckId;
  const decks = useDecks();
  const navigate = useNavigate();
  const { addMissing } = useMissing();

  if (!decks) return <Overlay>Loading...</Overlay>;

  let deck: FullDeckType | undefined = undefined;

  if (deckId) {
    deck = decks.find((deck) => deck.id === deckId);
  } else {
    deck = decks.sort((a, b) => b.score - a.score)[0];
  }

  if (deck === undefined) {
    return (
      <Overlay>
        Not enough cards,{" "}
        <Link onClick={() => navigate("/")}>try another deck</Link>
      </Overlay>
    );
  }

  const uniqueCards =
    deck &&
    deck.cards.filter(
      (card, index, self) => self.findIndex((c) => c.id === card.id) === index
    );

  return (
    <StyledDeckPage>
      <Section>
        <Header>{`#${deck.place} Decklist`}</Header>
        <CardList>
          {uniqueCards.map((card) => (
            <CardContainer key={card.id} onClick={() => addMissing(card.id)}>
              <CardImage src={card.image} alt={card.name} />
              <CardNumber>
                {deck && deck.cards.filter((c) => c.id === card.id).length}
              </CardNumber>
            </CardContainer>
          ))}
        </CardList>
      </Section>
      <Section>
        <Header>Matchups</Header>
        <Matchups>
          <MatchupSection>
            <SubHeader $backgroundColor="var(--e)">Strong Against</SubHeader>
            <MatchupList>
              {deck.matchups
                .filter((matchup) => matchup.totalGames > MIN_MATCHUP_GAMES)
                .filter((matchup) => matchup.winRate > 0.5)
                .filter((matchup) => matchup.name !== deck.name)
                .filter((matchup) =>
                  decks.some((deck) => deck.name === matchup.name)
                )
                .sort((a, b) => b.winRate - a.winRate)
                .sort(
                  (a, b) =>
                    decks.find((deck) => deck.name === a.name)!.place -
                    decks.find((deck) => deck.name === b.name)!.place
                )
                .slice(0, 8)
                .map((matchup: MatchupType) => (
                  <MatchupContainer key={matchup.name}>
                    <DeckCardContainer>
                      <DeckCard
                        deck={decks.find((deck) => deck.name === matchup.name)!}
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
            <SubHeader $backgroundColor="var(--s)">Weak Against</SubHeader>
            <MatchupList>
              {deck.matchups
                .filter((matchup) => !!matchup)
                .filter((matchup) => matchup.totalGames > MIN_MATCHUP_GAMES)
                .filter((matchup) => matchup.winRate < 0.5)
                .filter((matchup) => matchup.name !== deck.name)
                .filter((matchup) =>
                  decks.some((deck) => deck.name === matchup.name)
                )
                .sort((a, b) => a.winRate - b.winRate)
                .slice(0, 8)
                .map((matchup: MatchupType) => (
                  <MatchupContainer key={matchup.name}>
                    <DeckCardContainer>
                      <DeckCard
                        deck={decks.find((deck) => deck.name === matchup.name)!}
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
      </Section>
    </StyledDeckPage>
  );
};

export default DeckPage;
