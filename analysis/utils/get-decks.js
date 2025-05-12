const fs = require("fs");
const getDeckName = require("./get-deck-name");
const getMultiplier = require("./get-multiplier");

const {
  NOEX,
  EXPANSION_RELEASE_DATE,
  POST_EXPANSION_PERCENT,
  NOEX_PERCENT_CUTOFF,
  WIGGLYTUFF_PERCENT_CUTOFF,
  NO_TRAINER_PERCENT_CUTOFF,
} = require("../settings");

const getDecks = () => {
  const decksWithoutNames_ = JSON.parse(fs.readFileSync("./data/decks.json"));

  const decksWithoutNames = decksWithoutNames_
    .filter(
      (deck) => !deck.cards.some((card) => card.name.endsWith(" ex")) || !NOEX
    )
    .filter((deck) => {
      const isNoEx = deck.tournamentExPercent < NOEX_PERCENT_CUTOFF;
      return isNoEx === NOEX;
    })
    .filter((deck) => deck.wigglytuffPercent < WIGGLYTUFF_PERCENT_CUTOFF)
    .filter((deck) => deck.noTrainerPercent < NO_TRAINER_PERCENT_CUTOFF);

  // Populating deck names
  let decksWithNames = [];
  const idToName = {};
  for (const deck of decksWithoutNames) {
    const name = getDeckName(deck);
    if (!name) continue;
    idToName[deck.id] = name;
    decksWithNames.push({
      ...deck,
      name,
    });
  }

  // Updating wins and losses with deck names
  decksWithNames = decksWithNames.map((deck) => {
    return {
      ...deck,
      wins: deck.wins.map((win) => idToName[win]).filter((name) => name),
      losses: deck.losses.map((loss) => idToName[loss]).filter((name) => name),
    };
  });

  const totalGames = decksWithNames.reduce(
    (acc, deck) => acc + deck.totalGames,
    0
  );
  console.log("Sample Games:", (totalGames / 2).toLocaleString());

  let dates = decksWithNames.map((deck) => new Date(deck.date));
  dates = dates.filter((date, index) => dates.indexOf(date) === index);
  const newestDate = dates.reduce((acc, date) => (date > acc ? date : acc));
  const totalDeckCount = decksWithNames.length;
  const deckCountBeforeExpansion = decksWithNames.filter(
    (deck) => new Date(deck.date) < EXPANSION_RELEASE_DATE
  ).length;
  const deckCountAfterExpansion = decksWithNames.filter(
    (deck) => new Date(deck.date) >= EXPANSION_RELEASE_DATE
  ).length;
  const targetDeckCountAfterExpansion = totalDeckCount * POST_EXPANSION_PERCENT;
  const targetDeckCountBeforeExpansion =
    totalDeckCount * (1 - POST_EXPANSION_PERCENT);
  const beforeExpansionMul =
    targetDeckCountBeforeExpansion / deckCountBeforeExpansion;
  const afterExpansionMul =
    targetDeckCountAfterExpansion / deckCountAfterExpansion;

  let output = decksWithNames.map((deck) => {
    const multiplier = getMultiplier(
      deck,
      newestDate,
      beforeExpansionMul,
      afterExpansionMul
    );
    return {
      ...deck,
      totalGames: deck.totalGames * multiplier,
      winCount: deck.winCount * multiplier,
    };
  });

  // Fixing issue with double Poke Balls
  return output.map((deck) => {
    const cards = deck.cards.map((card) => {
      if (card.name === "Poké Ball" && card.number === "111") {
        return {
          ...card,
          set: "P-A",
          number: "5",
        };
      }
      return card;
    });
    return {
      ...deck,
      cards,
    };
  });
};

module.exports = getDecks;
