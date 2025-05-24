import { calculateMatchupResults } from "../utils/calculate-matchup-results";
import { Deck } from "../utils/types";

describe("calculateMatchupResults", () => {
  it("should calculate matchup results correctly", () => {
    const mockDecks: Deck[] = [
      {
        id: "test-1",
        name: "Test Deck",
        cards: [],
        pokemon: 0,
        differentPokemon: 0,
        winCount: 1,
        lossCount: 1,
        totalGames: 2,
        date: "2024-01-01",
        tournamentExPercent: 0,
        wigglytuffPercent: 0,
        noTrainerPercent: 0,
        wins: ["Opponent1"],
        losses: ["Opponent2"],
      },
      {
        id: "test-2",
        name: "Test Deck",
        cards: [],
        pokemon: 0,
        differentPokemon: 0,
        winCount: 1,
        lossCount: 0,
        totalGames: 1,
        date: "2024-01-01",
        tournamentExPercent: 0,
        wigglytuffPercent: 0,
        noTrainerPercent: 0,
        wins: ["Opponent2"],
        losses: [],
      },
    ];

    const result = calculateMatchupResults(mockDecks, "Test Deck");

    expect(result["Opponent1"].wins).toBe(1);
    expect(result["Opponent1"].losses).toBe(0);
    expect(result["Opponent2"].wins).toBe(1);
    expect(result["Opponent2"].losses).toBe(1);
  });
});
