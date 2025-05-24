import {
  NOEX,
  NOEX_PERCENT_CUTOFF,
  WIGGLYTUFF_PERCENT_CUTOFF,
  NO_TRAINER_PERCENT_CUTOFF,
} from "../settings";
import { Deck } from "./types";

export const filterDecks = (decks: Deck[]): Deck[] => {
  return decks
    .filter(
      (deck) => !deck.cards.some((card) => card.name.endsWith(" ex")) || !NOEX
    )
    .filter((deck) => {
      const isNoEx = deck.tournamentExPercent < NOEX_PERCENT_CUTOFF;
      return isNoEx === NOEX;
    })
    .filter((deck) => deck.wigglytuffPercent < WIGGLYTUFF_PERCENT_CUTOFF)
    .filter((deck) => deck.noTrainerPercent < NO_TRAINER_PERCENT_CUTOFF);
};
