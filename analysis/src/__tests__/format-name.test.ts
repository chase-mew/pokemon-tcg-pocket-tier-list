import formatName from "../utils/format-name";
import { Card } from "../utils/types";

describe("formatName", () => {
  it("should format a single card name correctly", () => {
    const cards: Card[] = [
      {
        name: "Pikachu",
        count: 2,
        set: "base",
        number: "58",
      },
    ];
    const match = ["Pikachu base 58"];

    const result = formatName(cards, match);
    expect(result).toBe("Pikachu-base-058");
  });

  it("should format multiple card names correctly", () => {
    const cards: Card[] = [
      {
        name: "Pikachu",
        count: 2,
        set: "base",
        number: "58",
      },
      {
        name: "Charizard ex",
        count: 1,
        set: "base",
        number: "12",
      },
    ];
    const match = ["Pikachu base 58", "Charizard ex base 12"];

    const result = formatName(cards, match);
    expect(result).toBe("Pikachu-base-058&Charizard ex-base-012");
  });

  it("should handle P-A set code correctly", () => {
    const cards: Card[] = [
      {
        name: "Professor's Research",
        count: 2,
        set: "P-A",
        number: "7",
      },
    ];
    const match = ["Professor's Research PA 7"];

    const result = formatName(cards, match);
    expect(result).toBe("Professor's Research-PA-007");
  });

  it("should throw error when card is not found", () => {
    const cards: Card[] = [
      {
        name: "Pikachu",
        count: 2,
        set: "base",
        number: "58",
      },
    ];
    const match = ["Charizard base 4"];

    expect(() => formatName(cards, match)).toThrow(
      "Card Charizard base 4 not found"
    );
  });
});
