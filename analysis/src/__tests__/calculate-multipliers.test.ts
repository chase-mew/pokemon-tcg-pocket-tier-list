import { calculateMultipliers } from "../utils/calculate-multipliers";
import { EXPANSION_RELEASE_DATE } from "../settings";
import { Deck } from "../utils/types";

describe("calculateMultipliers", () => {
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

  it("should calculate correct multipliers for balanced deck distribution", () => {
    const beforeExpansionDate = new Date(EXPANSION_RELEASE_DATE);
    beforeExpansionDate.setDate(beforeExpansionDate.getDate() - 1);
    const afterExpansionDate = new Date(EXPANSION_RELEASE_DATE);
    afterExpansionDate.setDate(afterExpansionDate.getDate() + 1);

    const decks: Deck[] = [
      { ...mockDeck, date: beforeExpansionDate.toISOString() },
      { ...mockDeck, date: beforeExpansionDate.toISOString() },
      { ...mockDeck, date: afterExpansionDate.toISOString() },
      { ...mockDeck, date: afterExpansionDate.toISOString() },
    ];

    const { beforeExpansionMul, afterExpansionMul } =
      calculateMultipliers(decks);

    // With 4 decks total and POST_EXPANSION_PERCENT = 0.95
    // Target before expansion: 4 * 0.05 = 0.2
    // Target after expansion: 4 * 0.95 = 3.8
    // Actual before expansion: 2
    // Actual after expansion: 2
    // Therefore:
    // beforeExpansionMul = 0.2 / 2 = 0.1
    // afterExpansionMul = 3.8 / 2 = 1.9
    expect(beforeExpansionMul).toBeCloseTo(0.1, 5);
    expect(afterExpansionMul).toBeCloseTo(1.9, 5);
  });

  it("should handle decks all before expansion", () => {
    const beforeExpansionDate = new Date(EXPANSION_RELEASE_DATE);
    beforeExpansionDate.setDate(beforeExpansionDate.getDate() - 1);

    const decks: Deck[] = [
      { ...mockDeck, date: beforeExpansionDate.toISOString() },
      { ...mockDeck, date: beforeExpansionDate.toISOString() },
    ];

    const { beforeExpansionMul, afterExpansionMul } =
      calculateMultipliers(decks);

    // With 2 decks total and POST_EXPANSION_PERCENT = 0.95
    // Target before expansion: 2 * 0.05 = 0.1
    // Target after expansion: 2 * 0.95 = 1.9
    // Actual before expansion: 2
    // Actual after expansion: 0
    // Therefore:
    // beforeExpansionMul = 0.1 / 2 = 0.05
    // afterExpansionMul = 1.9 / 0 = Infinity
    expect(beforeExpansionMul).toBeCloseTo(0.05, 5);
    expect(afterExpansionMul).toBe(Infinity);
  });

  it("should handle decks all after expansion", () => {
    const afterExpansionDate = new Date(EXPANSION_RELEASE_DATE);
    afterExpansionDate.setDate(afterExpansionDate.getDate() + 1);

    const decks: Deck[] = [
      { ...mockDeck, date: afterExpansionDate.toISOString() },
      { ...mockDeck, date: afterExpansionDate.toISOString() },
    ];

    const { beforeExpansionMul, afterExpansionMul } =
      calculateMultipliers(decks);

    // With 2 decks total and POST_EXPANSION_PERCENT = 0.95
    // Target before expansion: 2 * 0.05 = 0.1
    // Target after expansion: 2 * 0.95 = 1.9
    // Actual before expansion: 0
    // Actual after expansion: 2
    // Therefore:
    // beforeExpansionMul = 0.1 / 0 = Infinity
    // afterExpansionMul = 1.9 / 2 = 0.95
    expect(beforeExpansionMul).toBe(Infinity);
    expect(afterExpansionMul).toBeCloseTo(0.95, 5);
  });
});
