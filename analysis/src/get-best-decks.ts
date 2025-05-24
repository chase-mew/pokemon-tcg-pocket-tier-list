import fs from "fs";
import cardToString from "./utils/card-to-string";
import getDecks from "./utils/get-decks";
import getId from "./utils/get-id";
import {
  WINRATE_IMPORTANCE,
  POPULARITY_IMPORTANCE,
  CARDS_IN_DECK,
  RED_CARD_MULTIPLIER,
} from "./settings";
import { Card, Deck, MatchupData, MatchupResult } from "./utils/types";

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
let matchupResults: Record<string, Record<string, MatchupResult>> = {};
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
    // Updating deck results
    for (const opponent of deck.wins) {
      if (!matchupResults[deckName][opponent]) {
        matchupResults[deckName][opponent] = { wins: 0, losses: 0 };
      }
      matchupResults[deckName][opponent].wins += 1;
    }
    for (const opponent of deck.losses) {
      if (!matchupResults[deckName][opponent]) {
        matchupResults[deckName][opponent] = { wins: 0, losses: 0 };
      }
      matchupResults[deckName][opponent].losses += 1;
    }

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

  // Calculating card scores
  for (const card in cards) {
    const cardData = cards[card];
    const winRate = cardData.winCount / cardData.totalGames;
    const popularity = cardData.totalGames / matchingGames;
    const isRedCard = card.toLowerCase().includes("red card");
    const multiplier = isRedCard ? RED_CARD_MULTIPLIER : 1;
    cards[card].score =
      (winRate * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE) *
      multiplier;
  }

  const deckScore = (deck: Deck) => {
    const popularity = matchingGames / allGames;
    const deckScore =
      deck.cards.reduce(
        (acc: number, card: Card) =>
          acc + (cards[cardToString(card)]?.score || 0) * card.count,
        0
      ) / CARDS_IN_DECK;
    return deckScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  };

  const sortedDecks = matchingDecks.sort((a, b) => deckScore(b) - deckScore(a));

  for (const deck of sortedDecks) {
    const id = getId(deck);
    if (idExists[id]) continue;
    const formattedDeck = {
      name: deckName,
      cards: deck.cards,
      score: deckScore(deck),
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
