import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useMissing from "../app/use-missing";
import useFilters from "../app/use-filters";
import { useMemo } from "react";
import useIsPremium from "../app/use-is-premium";
import { getSortValue } from "../app/sorting-helper";
import { CARDS_URL } from "../app/constants";
import useExpansions from "../app/use-expansions";

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
  set: string;
}

export interface MatchupType {
  name: string;
  winRate: number;
  totalGames: number;
}

interface PartialList {
  cards: string[];
  score: number;
  strength: number;
}

interface PartialDeckType {
  name: string;
  lists: PartialList[];
  percentOfGames: number;
  popularity: number;
}

interface FullList {
  cards: CardType[];
  score: number;
  strength: number;
}

export interface FullDeckType {
  id: string;
  name: string;
  lists: FullList[];
  bestList: FullList;
  score: number;
  popularity: number;
  strength: number;
  percentOfGames: number;
  matchups: MatchupType[];
  iconPrimary: CardType;
  iconSecondary: CardType | null;
}

interface DecksContextType {
  decks: FullDeckType[] | null;
  loading: boolean;
}

const DecksContext = createContext<DecksContextType | undefined>(undefined);

const cardToId = (card: string): string => {
  return card.split(":")[1];
};

const cardToCount = (card: string): number => {
  return parseInt(card.split(":")[0]);
};

const maxStrength = (deck: PartialDeckType): number => {
  return deck.lists.reduce((curr: number, list: PartialList) => {
    if (list.strength > curr) return list.strength;
    return curr;
  }, 0);
};

const maxScore = (deck: PartialDeckType): number => {
  return deck.lists.reduce((curr: number, list: PartialList) => {
    if (list.score > curr) return list.score;
    return curr;
  }, 0);
};

export const DecksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { missing } = useMissing();
  const { energy, includeEx, deckAmount, sortBy, latestExpansionCards } = useFilters();
  const isPremium = useIsPremium();
  const expansions = useExpansions();

  const { data: cards, isLoading: cardsLoading } = useQuery({
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

  const { data: decksData, isLoading: decksLoading } = useQuery({
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

  const latestExpansionId = useMemo(() => {
    return expansions && expansions.length > 0
      ? expansions[expansions.length - 1].id
      : null;
  }, [expansions]);

  const decks = useMemo(() => {
    if (!cards || !decksData || isPremium === null) return null;

    const { decks, matchupData } = decksData;

    const uniqueMissing = [...new Set(missing)];

    const decksFiltered = decks
      .map((deck: PartialDeckType) => {
        const filteredLists = deck.lists
          .filter((deck: PartialList) => {
            for (const missingCard of uniqueMissing) {
              const matchingCards = deck.cards.reduce(
                (acc: number, card: string) => {
                  const id = cardToId(card);
                  if (id === missingCard) {
                    acc += cardToCount(card);
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
          .filter((deck: PartialList) => {
            if (energy === null) return true;

            return deck.cards.every((card: string) => {
              const id = cardToId(card);
              const cardData = cardsMapping[id];
              if (!cardData) throw new Error(`Card not found: ${id}`);
              const cardType = cardData.type;

              // Check if any Pokemon card in the deck matches the energy type
              return cardType === energy || cardType === "Trainer";
            });
          })
          .filter((deck: PartialList) => {
            if (includeEx) return true;
            return deck.cards.every((card: string) => {
              const id = cardToId(card);
              const cardData = cardsMapping[id];
              if (!cardData) throw new Error(`Card not found: ${id}`);
              if (cardData.type === "Trainer") return true;
              return cardData.ex === "No";
            });
          })
          .filter((deck: PartialList) => {
            if (latestExpansionCards === null || latestExpansionId === null) return true;

            let cardsFromLatestExpansion = 0;
            for (const card of deck.cards) {
              const id = cardToId(card);
              const cardData = cardsMapping[id];
              if (!cardData) throw new Error(`Card not found: ${id}`);
              const setId = cardData.id.split("-")[0];
              if (setId === latestExpansionId) {
                cardsFromLatestExpansion += cardToCount(card);
              }
            }

            return cardsFromLatestExpansion >= latestExpansionCards;
          });

        return {
          ...deck,
          lists: filteredLists,
        };
      })
      .filter((deck: PartialDeckType) => deck.lists.length > 0)
      .sort(
        (a: PartialDeckType, b: PartialDeckType) =>
          b.percentOfGames - a.percentOfGames
      )
      .slice(0, 29);

    const highestPopularity =
      decksFiltered.length > 0
        ? decksFiltered.sort(
          (a: PartialDeckType, b: PartialDeckType) =>
            b.popularity - a.popularity
        )[0].popularity
        : 0;
    const highestStrength =
      decksFiltered.length > 0
        ? decksFiltered
          .map((deck: PartialDeckType) => maxStrength(deck))
          .sort((a: number, b: number) => b - a)[0]
        : 0;

    const fullDecks = decksFiltered
      .map((oldDeck: PartialDeckType) => {
        const matchups = matchupData[oldDeck.name];

        const lists: FullList[] = oldDeck.lists.map((oldList: PartialList) => {
          const newCards: CardType[] = [];
          for (const oldCard of oldList.cards) {
            const amount = cardToCount(oldCard);
            const id = cardToId(oldCard);
            const card = cardsMapping[id];
            if (!card) {
              throw new Error(`Card not found: ${id}`);
            }
            for (let i = 0; i < amount; i++) {
              newCards.push(card);
            }
          }
          return {
            score: oldList.score,
            strength: oldList.strength,
            cards: newCards,
          };
        });

        const cardNames = oldDeck.name.split("&");
        const cardIds = cardNames.map((cardName) => {
          const cardNameParts = cardName.split("-");
          const cardIdParts = [cardNameParts[cardNameParts.length - 2], cardNameParts[cardNameParts.length - 1]];
          return cardIdParts.join("-");
        });

        const deck: FullDeckType = {
          id: oldDeck.name.toLowerCase().replace(/\s/g, "-"),
          name: oldDeck.name,
          lists,
          bestList: lists.sort(
            (a: FullList, b: FullList) => b.score - a.score
          )[0],
          score: maxScore(oldDeck),
          popularity: oldDeck.popularity / highestPopularity,
          strength: maxStrength(oldDeck) / highestStrength,
          percentOfGames: oldDeck.percentOfGames,
          matchups,
          iconPrimary: cardsMapping[cardIds[0]],
          iconSecondary: cardsMapping[cardIds[1]],
        };
        return deck;
      })
      .sort(
        (a: FullDeckType, b: FullDeckType) =>
          getSortValue(b, sortBy) - getSortValue(a, sortBy)
      );

    if (energy !== null) {
      return fullDecks.sort((a: FullDeckType, b: FullDeckType) =>
        getSortValue(b, sortBy) - getSortValue(a, sortBy)
      );
    }

    // Excluding the decks at the bottom that don't have a double
    let includedDecks = [];
    let hasOneDouble = false;
    for (let i = fullDecks.length - 1; i >= 0; i--) {
      const deck = fullDecks[i];
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
  }, [
    cards,
    decksData,
    isPremium,
    missing,
    energy,
    includeEx,
    deckAmount,
    sortBy,
    cardsMapping,
    latestExpansionCards,
    latestExpansionId,
  ]);

  const value = {
    decks,
    loading: cardsLoading || decksLoading,
  };

  return (
    <DecksContext.Provider value={value}>{children}</DecksContext.Provider>
  );
};

export const useDecks = () => {
  const context = useContext(DecksContext);
  if (context === undefined) {
    throw new Error("useDecks must be used within a DecksProvider");
  }
  return context;
};
