import { CardType } from "./use-decks";

const cardToString = (card: CardType) => {
  return `${card.name} ${card.id.toUpperCase().replace("-", " ")}`;
};

export default cardToString;
