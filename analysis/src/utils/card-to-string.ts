import { Card } from "./types";

const cardToString = (card: Card): string => {
  return `${card.count} ${card.name} ${card.set} ${card.number}`;
};

export default cardToString;
