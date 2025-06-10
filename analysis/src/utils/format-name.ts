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

export const formatMatch = (match: string[]) => {
  return match
    .map((cardName) => {
      const cardNameParts = cardName.split(" ");
      const id = cardNameParts[cardNameParts.length - 1];
      const setRaw = cardNameParts[cardNameParts.length - 2];
      const set = setRaw === "P-A" ? "PA" : setRaw;
      const idLength = id.length;
      const nameLength = cardName.length - idLength - setRaw.length - 2;
      const name = cardName.slice(0, nameLength);
      const paddedId = id.padStart(3, "0");
      return `${name}-${set}-${paddedId}`;
    })
    .join("&");
};
