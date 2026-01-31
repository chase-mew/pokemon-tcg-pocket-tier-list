import { Card } from "./types";

const formatName = (cards: Card[], match: string[]): string => {
  return match
    .map((cardName) => {
      const cardNameParts = cardName.split(" ");
      const id = cardNameParts[cardNameParts.length - 1];
      const padded = id.padStart(3, "0");
      const newCardNameParts = [...cardNameParts.slice(0, -1), padded];
      const newCardName = newCardNameParts.join("-").toLowerCase();
      return newCardName;
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
      let set = setRaw === "P-A" ? "PA" : setRaw;
      set = set === "P-B" ? "PB" : set;
      const idLength = id.length;
      const nameLength = cardName.length - idLength - setRaw.length - 2;
      const name = cardName.slice(0, nameLength);
      const paddedId = id.padStart(3, "0");
      return `${name}-${set}-${paddedId}`;
    })
    .join("&");
};
