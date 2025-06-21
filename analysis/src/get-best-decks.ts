import fs from "fs";
import cardToString from "./utils/card-to-string";
import getDecks from "./utils/get-decks";
import getId from "./utils/get-id";
import { calculateDeckScore } from "./utils/calculate-deck-score";
import { calculateCardScores } from "./utils/calculate-card-scores";
import { calculateMatchupResults } from "./utils/calculate-matchup-results";
import { Deck, MatchupData } from "./utils/types";
import { EXPANSION_RELEASE_DATE } from "./settings";
import { convertCardsToIds } from "./utils/convert-cards";

const decks = getDecks();
const allGames = decks.reduce(
  (acc: number, deck: Deck) => acc + deck.totalGames,
  0
);

const uniqueDeckNames = decks
  .map((deck: Deck) => deck.name)
  .filter(
    (value: string, index: number, self: string[]) =>
      self.indexOf(value) === index
  );

// Calculate Best Decks
const bestDecks = [];
const idExists: Record<string, boolean> = {};
let matchupResults: Record<
  string,
  Record<string, { wins: number; losses: number }>
> = {};

for (const deckName of uniqueDeckNames) {
  matchupResults[deckName] = {};
  const matchingDecks = decks.filter((game: Deck) => game.name === deckName);
  const matchingGames = matchingDecks.reduce(
    (acc: number, game: Deck) => acc + game.totalGames,
    0
  );
  const percentOfGames = matchingGames / allGames;

  const cards: Record<
    string,
    { winCount: number; totalGames: number; score?: number }
  > = {};
  for (const deck of matchingDecks) {
    // Updating card results
    for (const card of deck.cards) {
      const cardName = cardToString(card);
      if (cards[cardName]) {
        cards[cardName].winCount += deck.winCount;
        cards[cardName].totalGames += deck.totalGames;
      } else {
        cards[cardName] = {
          winCount: deck.winCount,
          totalGames: deck.totalGames,
        };
      }
    }
  }

  // Calculate card scores
  const scoredCards = calculateCardScores(cards, matchingGames);

  // Calculate matchup results
  matchupResults[deckName] = calculateMatchupResults(decks, deckName);

  const lists: any = [];
  for (const deck of matchingDecks) {
    const id = getId(deck);
    if (idExists[id]) continue;
    const deckScore = calculateDeckScore(
      deck,
      scoredCards,
      matchingGames,
      allGames
    );
    const formattedList = {
      cards: convertCardsToIds(deck.cards),
      score: deckScore.score,
      strength: deckScore.strength,
    };
    lists.push(formattedList);
    idExists[id] = true;
  }

  const deckScore = calculateDeckScore(
    matchingDecks[0],
    scoredCards,
    matchingGames,
    allGames
  );
  bestDecks.push({
    name: deckName,
    lists,
    popularity: deckScore.popularity,
    percentOfGames,
  });
}

console.log(bestDecks[0]);

const matchupData: Record<string, MatchupData[]> = {};
for (const deckName of Object.keys(matchupResults)) {
  matchupData[deckName] = Object.keys(matchupResults[deckName]).map(
    (opponent: string) => {
      const { wins, losses } = matchupResults[deckName][opponent];
      const totalGames = wins + losses;
      const winRate = wins / totalGames;
      return {
        name: opponent,
        winRate,
        totalGames,
      };
    }
  );
  const totalWinRate = Object.values(matchupResults[deckName]).reduce(
    (acc, matchup) => acc + matchup.wins,
    0
  );
  const totalLosses = Object.values(matchupResults[deckName]).reduce(
    (acc, matchup) => acc + matchup.losses,
    0
  );
  const totalGames = totalWinRate + totalLosses;
  const winRate = totalWinRate / totalGames;
  matchupData[deckName].push({
    name: "Total",
    winRate,
    totalGames,
  });
}

// Card scores for all games
const decksSinceLastExpansion = decks.filter(
  (deck) => new Date(deck.date) > EXPANSION_RELEASE_DATE
);
const allCards: Record<string, { winCount: number; totalGames: number }> = {};
for (const deck of decksSinceLastExpansion) {
  for (const card of deck.cards) {
    const cardName = cardToString(card);
    if (allCards[cardName]) {
      allCards[cardName].winCount += deck.winCount;
      allCards[cardName].totalGames += deck.totalGames;
    } else {
      allCards[cardName] = {
        winCount: deck.winCount,
        totalGames: deck.totalGames,
      };
    }
  }
}
const totalGamesSinceLastExpansion = decksSinceLastExpansion.reduce(
  (acc, deck) => acc + deck.totalGames,
  0
);
const cardScores = calculateCardScores(allCards, totalGamesSinceLastExpansion);
const cardScoresList: { name: string; score: number; popularity: number }[] =
  Object.entries(cardScores).map(([cardName, { score, popularity }]) => ({
    name: cardName,
    score,
    popularity,
  }));
cardScoresList.sort((a, b) => b.score - a.score);

fs.writeFileSync(
  "./data/card-scores.json",
  JSON.stringify(cardScoresList, null, 2)
);
fs.writeFileSync(
  "../public/data/card-scores.json",
  JSON.stringify(cardScoresList, null, 2)
);
fs.writeFileSync("./data/best-decks.json", JSON.stringify(bestDecks, null, 2));
fs.writeFileSync(
  "../public/data/best-decks.json",
  JSON.stringify(bestDecks, null, 2)
);
fs.writeFileSync(
  "../public/data/matchup-data.json",
  JSON.stringify(matchupData, null, 2)
);
