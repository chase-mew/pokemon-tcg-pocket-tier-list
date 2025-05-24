import getDeckName from "../utils/get-deck-name";
import { Deck } from "../utils/types";

describe("getDeckName", () => {
  it("should return correct name for a deck with two main cards", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Gyarados ex",
          count: 2,
          set: "A1a",
          number: "18",
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
    expect(result).toBe("Gyarados ex-A1a-018&Giratina ex-A2b-035");
  });

  it("should return correct name for a deck with one main card", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Bronzong",
          count: 2,
          set: "A2a",
          number: "59",
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
    expect(result).toBe("Bronzong-A2a-059");
  });

  it("should return correct name for a deck with one main card and one side card", () => {
    const deck: Deck = {
      id: "test-id",
      name: "Test Deck",
      cards: [
        {
          name: "Gyarados ex",
          count: 2,
          set: "A1a",
          number: "18",
        },
        {
          name: "Greninja",
          count: 1,
          set: "A1",
          number: "89",
        },
      ],
      pokemon: 3,
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
    expect(result).toBe("Gyarados ex-A1a-018");
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
