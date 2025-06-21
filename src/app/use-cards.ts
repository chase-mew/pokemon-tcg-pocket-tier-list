import { useQuery } from "@tanstack/react-query";
import { CARDS_URL } from "./constants";
import { CardType } from "../contexts/DecksContext";

export interface CardScoreType extends CardType {
  score: number;
  popularity: number;
}

export const setCode = (set: string): string => {
  if (set === "A1") return "a1";
  if (set === "A1a") return "a1a";
  if (set === "A2") return "a2";
  if (set === "A2a") return "a2a";
  if (set === "A2b") return "a2b";
  if (set === "P-A") return "pa";
  if (set === "A3") return "a3";
  if (set === "A3a") return "a3a";
  throw new Error(`Unknown set code: ${set}`);
};

const cardNameToId = (name: string): string => {
  const parts = name.split(" ");
  const id = parts[parts.length - 1];
  const padded = id.padStart(3, "0");
  const set = parts[parts.length - 2];
  return `${setCode(set)}-${padded}`;
};

const useCards = (): CardScoreType[] | null => {
  const { data: cardData } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await fetch(CARDS_URL);
      return response.json() as Promise<CardType[]>;
    },
  });

  const { data: cards } = useQuery({
    queryKey: ["card-scores"],
    queryFn: async () => {
      const response = await fetch("/data/card-scores.json");
      return response.json() as Promise<CardScoreType[]>;
    },
  });

  if (!cardData || !cards) return null;

  const sortedCards = cards.sort((a, b) => b.popularity - a.popularity);

  const outputCards: CardScoreType[] = [];
  for (const card of sortedCards) {
    if (outputCards.length >= 18) break;
    const id = cardNameToId(card.name);
    if (outputCards.find((c) => c.id === id)) continue;
    const cardInfo = cardData.find((c: CardType) => c.id === id);
    if (!cardInfo) throw new Error(`Card not found: ${id}`);
    // Square root of score
    const score = Math.sqrt(card.score);
    outputCards.push({
      ...cardInfo,
      score,
      popularity: card.popularity,
    });
  }
  return outputCards;
};

export default useCards;
