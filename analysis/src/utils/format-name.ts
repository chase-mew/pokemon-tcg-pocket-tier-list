import { Card } from "./types";
import cardToString from "./card-to-string";

const formatName = (cards: Card[], match: string[]): string => {
  return match
    .map((cardName) => {
      const card = cards.find(
        (card) =>
          cardToString(card) === `2 ${cardName}` ||
          cardToString(card) === `1 ${cardName}`
      );
      if (!card) throw new Error(`Card ${cardName} not found`);
      const padded = card.number.padStart(3, "0");
      const set = card.set === "P-A" ? "PA" : card.set;
      return `${card.name}-${set}-${padded}`;
    })
    .join("&");
};

export default formatName;
