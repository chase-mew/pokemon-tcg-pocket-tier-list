import {
  NOEX,
  NOEX_PERCENT_CUTOFF,
  WIGGLYTUFF_PERCENT_CUTOFF,
  NO_TRAINER_PERCENT_CUTOFF,
  MAX_DECKS_TO_ANALYZE,
} from "../settings";
import { Deck } from "./types";

export const filterDecks = (decks: Deck[]): Deck[] => {
  return decks
    .filter(
      (deck) => !deck.cards.some((card) => card.name.endsWith(" ex")) || !NOEX
    )
    .filter((deck) =>
      deck.cards.some((card) => card.set !== "A1" && card.set !== "P-A")
    )
    .filter((deck) => {
      const isNoEx = deck.tournamentExPercent < NOEX_PERCENT_CUTOFF;
      return isNoEx === NOEX;
    })
    .filter((deck) => deck.wigglytuffPercent < WIGGLYTUFF_PERCENT_CUTOFF)
    .filter((deck) => deck.noTrainerPercent < NO_TRAINER_PERCENT_CUTOFF)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, MAX_DECKS_TO_ANALYZE);
};
