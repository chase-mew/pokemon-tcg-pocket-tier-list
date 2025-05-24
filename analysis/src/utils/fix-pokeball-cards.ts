import { Deck } from "./types";

export const fixPokeballCards = (decks: Deck[]): Deck[] => {
  return decks.map((deck) => {
    const cards = deck.cards.map((card) => {
      if (card.name === "Poké Ball" && card.number === "111") {
        return {
          ...card,
          set: "P-A",
          number: "5",
        };
      }
      return card;
    });
    return {
      ...deck,
      cards,
    };
  });
};
