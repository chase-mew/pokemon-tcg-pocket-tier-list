import getMultiplier from "../get-multiplier";
import {
  EXPANSION_RELEASE_DATE,
  OLD_MULTIPLIER,
  NEW_MULTIPLIER,
} from "../../settings";
import { Deck } from "../types";

describe("getMultiplier", () => {
  const mockDeck: Deck = {
    id: "test-id",
    cards: [],
    pokemon: 0,
    differentPokemon: 0,
    winCount: 0,
    lossCount: 0,
    totalGames: 0,
    date: new Date().toISOString(),
    tournamentExPercent: 0,
    wigglytuffPercent: 0,
    noTrainerPercent: 0,
    wins: [],
    losses: [],
    name: "Test Deck",
  };

  it("should return beforeExpansionMul for decks before expansion date", () => {
    const beforeExpansionDate = new Date(EXPANSION_RELEASE_DATE);
    beforeExpansionDate.setDate(beforeExpansionDate.getDate() - 1);

    const deck: Deck = {
      ...mockDeck,
      date: beforeExpansionDate.toISOString(),
    };

    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const result = getMultiplier(deck, newestDate, 2, 1);
    expect(result).toBe(2);
  });

  it("should calculate recency multiplier for decks after expansion date", () => {
    const afterExpansionDate = new Date(EXPANSION_RELEASE_DATE);
    afterExpansionDate.setDate(afterExpansionDate.getDate() + 15);

    const deck: Deck = {
      ...mockDeck,
      date: afterExpansionDate.toISOString(),
    };

    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const result = getMultiplier(deck, newestDate, 1, 2);
    const expectedMultiplier = ((OLD_MULTIPLIER + NEW_MULTIPLIER) / 2) * 2;
    expect(result).toBeCloseTo(expectedMultiplier, 1);
  });

  it("should return maximum multiplier for newest decks", () => {
    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    const deck: Deck = {
      ...mockDeck,
      date: newestDate.toISOString(),
    };

    const result = getMultiplier(deck, newestDate, 1, 2);
    expect(result).toBe(NEW_MULTIPLIER * 2);
  });

  it("should return minimum multiplier for oldest post-expansion decks", () => {
    const oldestDate = new Date(EXPANSION_RELEASE_DATE);
    oldestDate.setDate(oldestDate.getDate() + 1);

    const deck: Deck = {
      ...mockDeck,
      date: oldestDate.toISOString(),
    };

    const newestDate = new Date(EXPANSION_RELEASE_DATE);
    newestDate.setDate(newestDate.getDate() + 30);

    // Calculate expected multiplier using the same formula as in getRecencyMultiplier
    const deckDate = oldestDate;
    const timePassed = deckDate.getTime() - EXPANSION_RELEASE_DATE.getTime();
    const totalTime = newestDate.getTime() - EXPANSION_RELEASE_DATE.getTime();
    const datePercentage = timePassed / totalTime;
    const recencyMultiplier =
      datePercentage * (NEW_MULTIPLIER - OLD_MULTIPLIER) + OLD_MULTIPLIER;
    const expectedMultiplier = recencyMultiplier * 2;

    const result = getMultiplier(deck, newestDate, 1, 2);
    expect(result).toBeCloseTo(expectedMultiplier, 5);
  });
});
