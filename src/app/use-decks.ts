import { useQuery } from "@tanstack/react-query";
import useMissing from "./use-missing";
import useFilters from "./use-filters";
import { useMemo } from "react";
import useIsPremium from "./use-is-premium";
import { getSortValue } from "./sorting-helper";
import { CARDS_URL } from "./constants";

export interface CardType {
  id: string;
  name: string;
  rarity: string;
  pack: string;
  type: string;
  health: number | null;
  stage: string | null;
  craftingCost: number | null;
  image: string;
  ex: string;
}

export interface MatchupType {
  name: string;
  winRate: number;
  totalGames: number;
}

interface PartialDeckType {
  name: string;
  cards: {
    count: number;
    set: string;
    number: string;
    name: string;
  }[];
  score: number;
  percentOfGames: number;
  date: string;
}

export interface FullDeckType {
  id: string;
  name: string;
  cards: CardType[];
  score: number;
  popularity: number;
  strength: number;
  place: number;
  percentOfGames: number;
  matchups: MatchupType[];
  date: Date;
}

interface BestDecksCardType {
  count: number;
  name: string;
  set: string;
  number: string;
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

const cardToId = (card: BestDecksCardType): string => {
  const id = card.number;
  const padded = id.padStart(3, "0");
  const output = `${setCode(card.set)}-${padded}`;
  return output;
};

const useDecks = (): FullDeckType[] | null => {
  const { missing } = useMissing();
  const { energy, includeEx, deckAmount, sortBy } = useFilters();
  const isPremium = useIsPremium();

  const { data: cards } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const response = await fetch(CARDS_URL);
      return response.json();
    },
  });

  const cardsMapping: Record<string, CardType> = useMemo(() => {
    return cards?.reduce((acc: Record<string, CardType>, card: CardType) => {
      acc[card.id] = card;
      return acc;
    }, {});
  }, [cards]);

  const { data: decksData } = useQuery({
    queryKey: ["decks"],
    queryFn: async () => {
      const [decksResponse, matchupDataResponse] = await Promise.all([
        fetch("/data/best-decks.json"),
        fetch("/data/matchup-data.json"),
      ]);

      const [decksData, matchupData] = await Promise.all([
        decksResponse.json(),
        matchupDataResponse.json(),
      ]);

      return { decks: decksData, matchupData };
    },
  });

  if (!cards || !decksData || isPremium === null) return null;

  const { decks, matchupData } = decksData;

  const uniqueDeckNames: string[] = decks.reduce(
    (acc: string[], deck: PartialDeckType) => {
      if (!acc.includes(deck.name)) {
        acc.push(deck.name);
      }
      return acc;
    },
    []
  );

  const uniqueMissing = [...new Set(missing)];

  const bestDecksFiltered = uniqueDeckNames
    .map((name) => {
      const matchingDecks = decks
        .filter((deck: PartialDeckType) => deck.name === name)
        .filter((deck: PartialDeckType) => {
          if (isPremium) return true;
          let now = new Date();
          const date = new Date(deck.date);
          const day = date.getDay();
          const daysAfterMonday = (day + 6) % 7;
          now.setDate(now.getDate() - daysAfterMonday);
          return date <= now;
        })
        .filter((deck: PartialDeckType) => {
          for (const missingCard of uniqueMissing) {
            const matchingCards = deck.cards.reduce(
              (acc: number, card: BestDecksCardType) => {
                const id = cardToId(card);
                if (id === missingCard) {
                  acc += card.count;
                }
                return acc;
              },
              0
            );
            const missingCount = missing.filter(
              (id) => id === missingCard
            ).length;
            if (matchingCards > 2 - missingCount) {
              return false;
            }
          }
          return true;
        })
        .filter((deck: PartialDeckType) => {
          if (energy === null) return true;

          return deck.cards.every((card: BestDecksCardType) => {
            const id = cardToId(card);
            const cardData = cardsMapping[id];
            if (!cardData) throw new Error(`Card not found: ${id}`);
            const cardType = cardData.type;

            // Check if any Pokemon card in the deck matches the energy type
            return cardType === energy || cardType === "Trainer";
          });
        })
        .filter((deck: PartialDeckType) => {
          if (includeEx) return true;
          return deck.cards.every((card: BestDecksCardType) => {
            const id = cardToId(card);
            const cardData = cardsMapping[id];
            if (!cardData) throw new Error(`Card not found: ${id}`);
            if (cardData.type === "Trainer") return true;
            return cardData.ex === "No";
          });
        });

      // sort by highest score
      matchingDecks.sort(
        (a: PartialDeckType, b: PartialDeckType) => b.score - a.score
      );
      const bestDeck = matchingDecks[0];
      return bestDeck;
    })
    .filter((deck) => deck)
    .sort((a, b) => b.percentOfGames - a.percentOfGames)
    .slice(0, deckAmount);

  const highestPopularity =
    bestDecksFiltered.length > 0
      ? bestDecksFiltered.sort((a, b) => b.popularity - a.popularity)[0]
          .popularity
      : 0;
  const highestStrength =
    bestDecksFiltered.length > 0
      ? bestDecksFiltered.sort((a, b) => b.strength - a.strength)[0].strength
      : 0;

  const bestDecks = bestDecksFiltered
    .map((oldDeck, index) => {
      const deckCards = [];
      for (const oldCard of oldDeck.cards) {
        const amount = oldCard.count;
        const id = cardToId(oldCard);
        const card = cardsMapping[id];
        if (!card) {
          throw new Error(`Card not found: ${id}`);
        }
        for (let i = 0; i < amount; i++) {
          deckCards.push(card);
        }
      }
      const matchups = matchupData[oldDeck.name];

      const deck: FullDeckType = {
        id: oldDeck.name.toLowerCase().replace(/\s/g, "-"),
        name: oldDeck.name,
        cards: deckCards,
        score: oldDeck.score,
        popularity: oldDeck.popularity / highestPopularity,
        strength: oldDeck.strength / highestStrength,
        place: index + 1,
        percentOfGames: oldDeck.percentOfGames,
        date: new Date(oldDeck.date),
        matchups,
      };
      return deck;
    })
    .sort((a, b) => getSortValue(b, sortBy) - getSortValue(a, sortBy));

  // return bestDecks;

  // Excluding the decks at the bottom that don't have a double
  let includedDecks = [];
  let hasOneDouble = false;
  for (let i = bestDecks.length - 1; i >= 0; i--) {
    const deck = bestDecks[i];
    if (!hasOneDouble) {
      if (!deck.name.includes("&")) {
        continue;
      } else {
        hasOneDouble = true;
      }
    }
    includedDecks.push(deck);
  }

  return includedDecks.sort(
    (a: FullDeckType, b: FullDeckType) =>
      getSortValue(b, sortBy) - getSortValue(a, sortBy)
  );
};

export default useDecks;
