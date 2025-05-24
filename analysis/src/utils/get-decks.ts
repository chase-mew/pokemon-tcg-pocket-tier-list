import fs from "fs";
import getMultiplier from "./get-multiplier";
import { filterDecks } from "./filter-decks";
import { populateDeckNames } from "./populate-deck-names";
import { updateDeckResults } from "./update-deck-results";
import { calculateMultipliers } from "./calculate-multipliers";
import { fixPokeballCards } from "./fix-pokeball-cards";
import { Deck } from "./types";

const readDecksFromFile = (): Deck[] => {
  try {
    const fileContent = fs.readFileSync("./data/decks.json", "utf-8");
    const decks = JSON.parse(fileContent);
    if (!Array.isArray(decks)) {
      throw new Error("Decks data is not an array");
    }
    return decks;
  } catch (error) {
    throw new Error(
      `Failed to read decks file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

const calculateTotalGames = (decks: Deck[]): number => {
  return decks.reduce((acc, deck) => acc + deck.totalGames, 0);
};

const getNewestDate = (decks: Deck[]): Date => {
  const uniqueDates = [...new Set(decks.map((deck) => deck.date))];
  return uniqueDates.reduce(
    (newest, date) => (new Date(date) > newest ? new Date(date) : newest),
    new Date(0)
  );
};

const applyMultipliers = (
  decks: Deck[],
  newestDate: Date,
  beforeExpansionMul: number,
  afterExpansionMul: number
): Deck[] => {
  return decks.map((deck) => {
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
      wins: deck.wins || [],
      losses: deck.losses || [],
    };
  });
};

const getDecks = (): Deck[] => {
  const rawDecks = readDecksFromFile();
  const filteredDecks = filterDecks(rawDecks);
  const { decks: decksWithNames, idToName } = populateDeckNames(filteredDecks);
  const decksWithResults = updateDeckResults(decksWithNames, idToName);

  const totalGames = calculateTotalGames(decksWithResults);
  console.log("Sample Games:", (totalGames / 2).toLocaleString());

  const newestDate = getNewestDate(decksWithResults);
  const { beforeExpansionMul, afterExpansionMul } =
    calculateMultipliers(decksWithResults);

  const decksWithMultipliers = applyMultipliers(
    decksWithResults,
    newestDate,
    beforeExpansionMul,
    afterExpansionMul
  );

  return fixPokeballCards(decksWithMultipliers);
};

export default getDecks;
