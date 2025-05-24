import { Card } from "./types";

/**
 * Converts a Card object to a standardized string representation
 * @param card The card object to convert
 * @returns A string in the format "count name set number"
 * @throws Error if required card properties are missing or invalid
 */
const cardToString = (card: Card): string => {
  if (!card) {
    throw new Error("Card object is required");
  }

  const { count, name, set, number } = card;

  if (typeof count !== "number" || count < 0) {
    throw new Error("Invalid card count");
  }

  if (!name?.trim()) {
    throw new Error("Card name is required");
  }

  if (!set?.trim()) {
    throw new Error("Card set is required");
  }

  if (!number?.trim()) {
    throw new Error("Card number is required");
  }

  return `${count} ${name} ${set} ${number}`;
};

export default cardToString;
