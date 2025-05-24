import cardToString from "../utils/card-to-string";
import { Card } from "../utils/types";

describe("cardToString", () => {
  it("should format a card correctly", () => {
    const card: Card = {
      name: "Pikachu",
      count: 4,
      set: "base",
      number: "58",
    };

    const result = cardToString(card);
    expect(result).toBe("4 Pikachu base 58");
  });

  it("should handle cards with spaces in their name", () => {
    const card: Card = {
      name: "Charizard ex",
      count: 2,
      set: "base",
      number: "12",
    };

    const result = cardToString(card);
    expect(result).toBe("2 Charizard ex base 12");
  });
});
