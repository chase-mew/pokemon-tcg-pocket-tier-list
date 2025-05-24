import { Deck } from "../types";

const getId = (deck: Deck) => {
  const cards = deck.cards.map(
    (card) => `${card.count}-${card.name}-${card.set}-${card.number}`
  );
  const deckString = cards.join(",");
  const hash = require("crypto").createHash("sha256");
  return hash.update(deckString).digest("hex");
};

export default getId;
