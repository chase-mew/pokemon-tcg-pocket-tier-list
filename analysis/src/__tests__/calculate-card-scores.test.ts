import { calculateCardScores } from "../utils/calculate-card-scores";

describe("calculateCardScores", () => {
  it("should calculate card scores correctly", () => {
    const mockCards = {
      Pikachu: { winCount: 10, totalGames: 20 },
      "Red Card": { winCount: 15, totalGames: 20 },
    };

    const matchingGames = 20;

    const result = calculateCardScores(mockCards, matchingGames);

    expect(result["Pikachu"].score).toBeDefined();
    expect(result["Red Card"].score).toBeDefined();
    expect(result["Red Card"].score).toBeGreaterThan(result["Pikachu"].score);
  });
});
