import { round } from "../utils/round";

describe("round", () => {
  it("should round to specified decimal places", () => {
    expect(round(3.14159, 2)).toBe(3.14);
    expect(round(3.14159, 3)).toBe(3.142);
    expect(round(3.14159, 0)).toBe(3);
  });

  it("should handle negative numbers", () => {
    expect(round(-3.14159, 2)).toBe(-3.14);
    expect(round(-3.14159, 3)).toBe(-3.142);
  });

  it("should handle zero", () => {
    expect(round(0, 2)).toBe(0);
    expect(round(0, 3)).toBe(0);
  });
});
