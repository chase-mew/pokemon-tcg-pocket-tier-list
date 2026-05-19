import { calculateCardScores } from "../utils/calculate-card-scores";

describe("calculateCardScores", () => {
  it("should calculate card scores correctly", () => {
    // Use larger samples so the Wilson lower bound has tight enough intervals
    // for "Red Card" to clearly come out behind "Pikachu" once its
    // RED_CARD_MULTIPLIER penalty is applied.
    const mockCards = {
      Pikachu: { winCount: 1000, totalGames: 2000 },
      "Red Card": { winCount: 1500, totalGames: 2000 },
    };

    const matchingGames = 2000;

    const result = calculateCardScores(mockCards, matchingGames);

    expect(result["Pikachu"].score).toBeDefined();
    expect(result["Red Card"].score).toBeDefined();
    expect(result["Red Card"].score).toBeGreaterThan(result["Pikachu"].score);
  });

  it("shrinks small-sample card scores below large-sample equivalents", () => {
    // Two cards both at 100% appearance / 100% winrate, but one is observed
    // across many more games. The big-sample card should score higher.
    const cards = {
      BigSample: { winCount: 200, totalGames: 200 },
      TinySample: { winCount: 5, totalGames: 5 },
    };
    const result = calculateCardScores(cards, 200);
    expect(result.BigSample.score).toBeGreaterThan(result.TinySample.score);
    expect(result.BigSample.popularity).toBeGreaterThan(
      result.TinySample.popularity
    );
  });
});
