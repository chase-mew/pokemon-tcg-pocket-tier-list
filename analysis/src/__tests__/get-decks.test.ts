import getDecks from "../utils/get-decks";

describe("getDecks", () => {
  it("should return decks", () => {
    const decks = getDecks();
    expect(decks.length).toBeGreaterThan(0);

    const randomDeck = decks[Math.floor(Math.random() * decks.length)];
    expect(randomDeck.id).toBeDefined();
    expect(randomDeck.id.length).toBeGreaterThan(10);
    expect(randomDeck.cards.length).toBeGreaterThan(0);
    expect(
      randomDeck.cards.every(
        (card) => card.name && typeof card.name === "string"
      )
    ).toBe(true);
    expect(
      randomDeck.cards.every(
        (card) => card.count && typeof card.count === "number" && card.count > 0
      )
    ).toBe(true);
    expect(
      randomDeck.cards.every((card) => card.set && typeof card.set === "string")
    ).toBe(true);
    expect(
      randomDeck.cards.every(
        (card) => card.number && typeof card.number === "string"
      )
    ).toBe(true);
    expect(randomDeck.pokemon).toBeGreaterThan(0);
    expect(randomDeck.differentPokemon).toBeGreaterThan(0);
    expect(randomDeck.winCount).toBeDefined();
    expect(randomDeck.lossCount).toBeDefined();
    expect(randomDeck.totalGames).toBeGreaterThan(0);
    expect(new Date(randomDeck.date).toISOString()).toBeDefined();
    expect(randomDeck.tournamentExPercent).toBeDefined();
    expect(randomDeck.wigglytuffPercent).toBeDefined();
    expect(randomDeck.noTrainerPercent).toBeDefined();
    expect(randomDeck.wins).toBeDefined();
    expect(randomDeck.wins.length + randomDeck.wins.length).toBeGreaterThan(0);
    expect(randomDeck.losses).toBeDefined();
    expect(randomDeck.name).toBeDefined();
    expect(randomDeck.name.length).toBeGreaterThan(0);
  });
});
