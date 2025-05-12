const fs = require("fs");
const cardToString = require("./utils/card-to-string");
const getEligibleDecks = require("./utils/get-eligible-decks");
const getDecks = require("./utils/get-decks");
const getId = require("./utils/get-id");
const {
  WINRATE_IMPORTANCE,
  POPULARITY_IMPORTANCE,
  CARDS_IN_DECK,
  RED_CARD_MULTIPLIER,
} = require("./settings");

// Global Variables
const decks = getDecks();
const allGames = decks.reduce((acc, deck) => acc + deck.totalGames, 0);
const uniqueDeckNames = decks
  .map((deck) => deck.name)
  .filter((value, index, self) => self.indexOf(value) === index);

// Calculate Best Decks
const bestDecks = [];
const idExists = {};
let matchupResults = {};
for (const deckName of uniqueDeckNames) {
  matchupResults[deckName] = {};
  const matchingDecks = decks.filter((game) => game.name === deckName);
  const matchingGames = matchingDecks.reduce(
    (acc, game) => acc + game.totalGames,
    0
  );
  const percentOfGames = matchingGames / allGames;

  const cards = {};
  for (const deck of matchingDecks) {
    // Updating deck results
    const deckResult = { wins: 0, losses: 0 };
    for (const win of deck.wins) {
      if (!matchupResults[deckName][win]) {
        matchupResults[deckName][win] = deckResult;
      }
      matchupResults[deckName][win].wins += deck.winCount;
    }
    for (const loss of deck.losses) {
      if (!matchupResults[deckName][loss]) {
        matchupResults[deckName][loss] = deckResult;
      }
      matchupResults[deckName][loss].losses += deck.winCount;
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

  const deckScore = (deck) => {
    const popularity = matchingGames / allGames;
    const deckScore =
      deck.cards.reduce(
        (acc, card) => acc + cards[cardToString(card)].score * card.count,
        0
      ) / CARDS_IN_DECK;
    return deckScore * WINRATE_IMPORTANCE + popularity * POPULARITY_IMPORTANCE;
  };

  const eligibleDecks = getEligibleDecks(matchingDecks);
  if (eligibleDecks.length === 0) continue;
  const sortedDecks = eligibleDecks.sort((a, b) => deckScore(b) - deckScore(a));

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

const matchupData = {};
for (const deckName of Object.keys(matchupResults)) {
  matchupData[deckName] = Object.keys(matchupResults[deckName]).map((key) => {
    const winRate =
      matchupResults[deckName][key].wins /
      (matchupResults[deckName][key].wins +
        matchupResults[deckName][key].losses);
    return {
      name: key,
      winRate,
      totalGames:
        matchupResults[deckName][key].wins +
        matchupResults[deckName][key].losses,
    };
  });
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
