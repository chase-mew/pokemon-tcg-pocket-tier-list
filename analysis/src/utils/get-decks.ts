import fs from "fs";
import getMultiplier from "./get-multiplier";
import { filterDecks } from "./filter-decks";
import { populateDeckNames } from "./populate-deck-names";
import { updateDeckResults } from "./update-deck-results";
import { calculateMultipliers } from "./calculate-multipliers";
import { fixPokeballCards } from "./fix-pokeball-cards";
import { Deck } from "./types";

const getDecks = () => {
  const decksWithoutNames_: Deck[] = JSON.parse(
    fs.readFileSync("./data/decks.json", "utf-8")
  );

  const filteredDecks = filterDecks(decksWithoutNames_);
  const { decks: decksWithNames, idToName } = populateDeckNames(filteredDecks);
  const decksWithResults = updateDeckResults(decksWithNames, idToName);

  const totalGames = decksWithResults.reduce(
    (acc, deck) => acc + deck.totalGames,
    0
  );
  console.log("Sample Games:", (totalGames / 2).toLocaleString());

  let dates = decksWithResults.map((deck) => new Date(deck.date));
  dates = dates.filter((date, index) => dates.indexOf(date) === index);
  const newestDate = dates.reduce(
    (acc, date) => (date > acc ? date : acc),
    new Date(0)
  );

  const { beforeExpansionMul, afterExpansionMul } =
    calculateMultipliers(decksWithResults);

  let output = decksWithResults.map((deck) => {
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

  return fixPokeballCards(output);
};

export default getDecks;
