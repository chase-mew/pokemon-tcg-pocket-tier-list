import fs from "fs";
import cardToString from "./utils/card-to-string";
import getDecks from "./utils/get-decks";
import getId from "./utils/get-id";
import { calculateDeckScore } from "./utils/calculate-deck-score";
import { calculateCardScores } from "./utils/calculate-card-scores";
import { calculateMatchupResults } from "./utils/calculate-matchup-results";
import { Deck, MatchupData } from "./utils/types";
import { convertCardsToIds } from "./utils/convert-cards";
import { MIN_WINRATE_THRESHOLD } from "./settings";

const CARDS_API =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json";

const run = async () => {
  const cardsPromise = fetch(CARDS_API);
  const allDecks = getDecks();

  const qualifiedDecks = allDecks.filter(
    (deck: Deck) =>
      deck.totalGames > 0 &&
      deck.winCount / deck.totalGames >= MIN_WINRATE_THRESHOLD
  );

  console.log(
    `Qualified decks (>=${MIN_WINRATE_THRESHOLD * 100}% winrate): ${qualifiedDecks.length} / ${allDecks.length}`
  );

  const allQualifiedGames = qualifiedDecks.reduce(
    (acc: number, deck: Deck) => acc + deck.totalGames,
    0
  );

  const uniqueDeckNames = qualifiedDecks
    .map((deck: Deck) => deck.name)
    .filter(
      (value: string, index: number, self: string[]) =>
        self.indexOf(value) === index
    );

  // Calculate Best Decks
  const bestDecks = [];
  const idExists: Record<string, boolean> = {};
  let matchupResults: Record<
    string,
    Record<string, { wins: number; losses: number }>
  > = {};

  for (const deckName of uniqueDeckNames) {
    matchupResults[deckName] = {};

    // Qualified decks for this archetype (80%+ winrate)
    const matchingQualifiedDecks = qualifiedDecks.filter(
      (game: Deck) => game.name === deckName
    );
    const matchingQualifiedGames = matchingQualifiedDecks.reduce(
      (acc: number, game: Deck) => acc + game.totalGames,
      0
    );
    const percentOfGames = matchingQualifiedGames / allQualifiedGames;

    const cards: Record<
      string,
      { winCount: number; totalGames: number; score?: number }
    > = {};
    for (const deck of matchingQualifiedDecks) {
      for (const card of deck.cards) {
        const cardName = cardToString(card);
        if (cards[cardName]) {
          cards[cardName].winCount += deck.winCount;
          cards[cardName].totalGames += deck.totalGames;
        } else {
          cards[cardName] = {
            winCount: deck.winCount,
            totalGames: deck.totalGames,
          };
        }
      }
    }

    // Calculate card scores from qualified decks
    const scoredCards = calculateCardScores(cards, matchingQualifiedGames);

    // Calculate matchup results from ALL decks (unfiltered) so winrates are accurate
    matchupResults[deckName] = calculateMatchupResults(allDecks, deckName);

    // Build lists from qualified decks only
    const lists: any = [];
    for (const deck of matchingQualifiedDecks) {
      const id = getId(deck);
      if (idExists[id]) continue;
      const deckScore = calculateDeckScore(
        deck,
        scoredCards,
        matchingQualifiedGames,
        allQualifiedGames
      );
      const formattedList = {
        cards: convertCardsToIds(deck.cards),
        score: deckScore.score,
        strength: deckScore.strength,
      };
      lists.push(formattedList);
      idExists[id] = true;
    }

    const deckScore = calculateDeckScore(
      matchingQualifiedDecks[0],
      scoredCards,
      matchingQualifiedGames,
      allQualifiedGames
    );
    bestDecks.push({
      name: deckName,
      lists,
      popularity: deckScore.popularity,
      percentOfGames,
    });
  }

  const matchupData: Record<string, MatchupData[]> = {};
  for (const deckName of Object.keys(matchupResults)) {
    matchupData[deckName] = Object.keys(matchupResults[deckName]).map(
      (opponent: string) => {
        const { wins, losses } = matchupResults[deckName][opponent];
        const totalGames = wins + losses;
        const winRate = wins / totalGames;
        return {
          name: opponent,
          winRate,
          totalGames,
        };
      }
    );
    const totalWinRate = Object.values(matchupResults[deckName]).reduce(
      (acc, matchup) => acc + matchup.wins,
      0
    );
    const totalLosses = Object.values(matchupResults[deckName]).reduce(
      (acc, matchup) => acc + matchup.losses,
      0
    );
    const totalGames = totalWinRate + totalLosses;
    const winRate = totalWinRate / totalGames;
    matchupData[deckName].push({
      name: "Total",
      winRate,
      totalGames,
    });
  }

  const allCards: Record<string, { winCount: number; totalGames: number }> = {};
  for (const deck of qualifiedDecks) {
    for (const card of deck.cards) {
      const cardName = cardToString(card);
      if (allCards[cardName]) {
        allCards[cardName].winCount += deck.winCount;
        allCards[cardName].totalGames += deck.totalGames;
      } else {
        allCards[cardName] = {
          winCount: deck.winCount,
          totalGames: deck.totalGames,
        };
      }
    }
  }
  const cardScores = calculateCardScores(allCards, allQualifiedGames);
  const cardScoresList: { name: string; score: number; popularity: number }[] =
    Object.entries(cardScores).map(([cardName, { score, popularity }]) => ({
      name: cardName,
      score,
      popularity,
    }));
  cardScoresList.sort((a, b) => b.score - a.score);

  const cardsRequest = await cardsPromise;
  const cards = (await cardsRequest.json()) as any[];
  const cardIds = cards.map((card: any) => card.id);
  const idExistsInApi: Record<string, boolean> = cardIds.reduce(
    (acc: Record<string, boolean>, id: string) => {
      acc[id] = true;
      return acc;
    },
    {}
  );

  for (const deck of bestDecks) {
    for (const list of deck.lists) {
      for (const card of list.cards) {
        const parts = card.split(":");
        const id = parts[1];
        if (!idExistsInApi[id]) {
          throw new Error(`Card not found in API: ${id}`);
        }
      }
    }
  }

  fs.writeFileSync(
    "./data/card-scores.json",
    JSON.stringify(cardScoresList, null, 2)
  );
  fs.writeFileSync(
    "../public/data/card-scores.json",
    JSON.stringify(cardScoresList, null, 2)
  );
  fs.writeFileSync(
    "./data/best-decks.json",
    JSON.stringify(bestDecks, null, 2)
  );
  fs.writeFileSync(
    "../public/data/best-decks.json",
    JSON.stringify(bestDecks, null, 2)
  );
  fs.writeFileSync(
    "../public/data/matchup-data.json",
    JSON.stringify(matchupData, null, 2)
  );
  fs.writeFileSync(
    "../src/app/last-updated.ts",
    `export const LAST_UPDATED = new Date("${new Date().toISOString()}");`
  );
};

run();
