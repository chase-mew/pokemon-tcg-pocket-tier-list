import { useQuery } from "@tanstack/react-query";
import { CARDS_URL } from "./constants";
import { CardType } from "../contexts/DecksContext";
import useFilters from "./use-filters";
import useMissing from "./use-missing";

export interface CardScoreType extends CardType {
  count: number;
  score: number;
  popularity: number;
}

export const setCode = (set: string): string => {
  if (set === "P-A") return "pa";
  return set.toLowerCase();
};

const cardNameToCount = (name: string): number => {
  const parts = name.split(" ");
  const count = parts[0];
  return parseInt(count ?? "0");
};

const cardNameToId = (name: string): string => {
  const parts = name.split(" ");
  const id = parts[parts.length - 1];
  const padded = id.padStart(3, "0");
  const set = parts[parts.length - 2];
  return `${setCode(set)}-${padded}`;
};

const cardNameToSet = (name: string): string => {
  const parts = name.split(" ");
  return setCode(parts[parts.length - 2]);
};

const useCards = (amount: number = 30): CardScoreType[] | null => {
  const { expansion } = useFilters();
  const { missing: collected } = useMissing();

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

  const sortedCards = cards
    .filter((card) => {
      const id = cardNameToId(card.name);
      const count = cardNameToCount(card.name);
      const collectedCount = collected.filter((m) => m === id).length;
      return count - collectedCount > 0;
    })
    .sort((a, b) => b.score - a.score);

  const outputCards: CardScoreType[] = [];
  for (const card of sortedCards) {
    const set = cardNameToSet(card.name);
    if (expansion && set !== expansion) continue;
    const id = cardNameToId(card.name);
    const count = cardNameToCount(card.name);
    if (outputCards.find((c) => c.id === id)) continue;
    const cardInfo = cardData.find((c: CardType) => c.id === id);
    if (!cardInfo) throw new Error(`Card not found: ${id}`);
    // Square root of score
    const score = Math.pow(card.score, 1 / 2);
    outputCards.push({
      ...cardInfo,
      score,
      popularity: card.popularity,
      set,
      count,
    });
  }

  return outputCards
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, amount)
    .sort((a, b) => b.score - a.score);
};

export default useCards;
