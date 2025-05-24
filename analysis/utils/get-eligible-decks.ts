import cardToString from "./card-to-string";
import { Deck } from "../types";

const EXCLUDE: string[] = [
  // "2 Koga A1 222",
  // "2 Mewtwo A1 128",
  // "2 Charizard A1 35",
  // "1 Charizard A1 35",
  // "2 Marowak ex A1 153",
  // "2 Articuno A1 83",
  // "2 Machamp ex A1 146",
];

const getEligibleDecks = (decks: Deck[]) => {
  return decks.filter(
    (deck) =>
      !EXCLUDE.some((exclude) =>
        deck.cards.map((card) => cardToString(card)).includes(exclude)
      )
  );
};

export default getEligibleDecks;
