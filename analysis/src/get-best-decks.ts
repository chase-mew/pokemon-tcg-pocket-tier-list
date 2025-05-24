import fs from "fs";
import cardToString from "./utils/card-to-string";
import getDecks from "./utils/get-decks";
import getId from "./utils/get-id";
import { calculateDeckScore } from "./utils/calculate-deck-score";
import { calculateCardScores } from "./utils/calculate-card-scores";
import { calculateMatchupResults } from "./utils/calculate-matchup-results";
import { Deck, MatchupData } from "./utils/types";

// Global Variables
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

  const sortedDecks = matchingDecks.sort(
    (a, b) =>
      calculateDeckScore(b, scoredCards, matchingGames, allGames) -
      calculateDeckScore(a, scoredCards, matchingGames, allGames)
  );

  for (const deck of sortedDecks) {
    const id = getId(deck);
    if (idExists[id]) continue;
    const formattedDeck = {
      name: deckName,
      cards: deck.cards,
      score: calculateDeckScore(deck, scoredCards, matchingGames, allGames),
      percentOfGames,
      id,
    };
    bestDecks.push(formattedDeck);
    idExists[id] = true;
  }
}

bestDecks.sort((a, b) => b.score - a.score);

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
}

fs.writeFileSync("./data/best-decks.json", JSON.stringify(bestDecks, null, 2));
fs.writeFileSync(
  "../public/data/best-decks.json",
  JSON.stringify(bestDecks, null, 2)
);
fs.writeFileSync(
  "../public/data/matchup-data.json",
  JSON.stringify(matchupData, null, 2)
);
