import getDeckName from "../utils/get-deck-name";
import { Deck } from "../utils/types";

describe("getDeckName", () => {
  it("should return correct name for a deck with two main cards", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Mimikyu ex",
          count: 2,
          set: "B2",
          number: "73",
        },
        {
          name: "Giratina ex",
          count: 2,
          set: "A2b",
          number: "35",
        },
      ],
      pokemon: 4,
      differentPokemon: 2,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      wigglytuffPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const result = getDeckName(deck);
    expect(result).toBe("mimikyu-ex-b2-073&giratina-ex-a2b-035");
  });

  it("should return the canonical archetype name regardless of the card variant in the deck", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Magnezone",
          count: 2,
          set: "A2",
          number: "53",
        },
      ],
      pokemon: 2,
      differentPokemon: 1,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      wigglytuffPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const result = getDeckName(deck);
    expect(result).toBe("magnezone-ex-b3-054");
  });

  it("should group different variants of the same archetype under one name", () => {
    const exVariant: Deck = {
      id: "ex-variant",
      name: "Test Deck",
      cards: [
        { name: "Magnezone ex", count: 2, set: "B3", number: "54" },
        { name: "Miraidon ex", count: 2, set: "B3a", number: "19" },
      ],
      pokemon: 4,
      differentPokemon: 2,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      wigglytuffPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const b1aVariant: Deck = {
      ...exVariant,
      id: "b1a-variant",
      cards: [
        { name: "Magnezone", count: 2, set: "B1a", number: "26" },
        { name: "Miraidon ex", count: 2, set: "B3a", number: "19" },
      ],
    };

    expect(getDeckName(b1aVariant)).toBe(getDeckName(exVariant));
    expect(getDeckName(b1aVariant)).toBe("magnezone-ex-b3-054&miraidon-ex-b3a-019");
  });

  it("should return correct name for a deck with one main card and one side card", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Suicune ex",
          count: 2,
          set: "A4a",
          number: "20",
        },
        {
          name: "Greninja",
          count: 2,
          set: "A1",
          number: "89",
        },
      ],
      pokemon: 4,
      differentPokemon: 2,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      wigglytuffPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const result = getDeckName(deck);
    expect(result).toBe("suicune-ex-a4a-020&greninja-a1-089");
  });

  it("should return null for a deck with no matching cards", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Random Card",
          count: 2,
          set: "A1",
          number: "1",
        },
      ],
      pokemon: 2,
      differentPokemon: 1,
      winCount: 0,
      lossCount: 0,
      totalGames: 0,
      date: "2024-03-20",
      tournamentExPercent: 0,
      wigglytuffPercent: 0,
      noTrainerPercent: 0,
      wins: [],
      losses: [],
    };

    const result = getDeckName(deck);
    expect(result).toBeNull();
  });
});
