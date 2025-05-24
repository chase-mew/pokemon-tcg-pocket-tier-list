import fs from "fs";
import { Pairing, Tournament } from "./types";

// State

// Facts
const API_KEY = process.env.API_KEY;
const GAME = "POCKET";
const append = `?key=${API_KEY}`;
const BASE = "https://play.limitlesstcg.com/api";

// Config
const MIN_GAMES = 100;

const processedTournaments = () => {
  return JSON.parse(
    fs.readFileSync("./data/processed-tournaments.json", "utf-8")
  );
};

const _currentDecks = () => {
  return JSON.parse(fs.readFileSync("./data/decks.json", "utf-8"));
};

// {
//     game: 'DCG',
//     name: 'LIGA PHOENIX LA PLATA 100 51°',
//     date: '2024-11-10T18:30:00.000Z',
//     format: null,
//     id: '672fc6e40947ec3b5d19d54d',
//     players: 10,
//     organizerId: 281
//   }
const getTournaments = async () => {
  const res = await fetch(
    `${BASE}/tournaments${append}&limit=10000&game=${GAME}`
  );
  const tournaments: Tournament[] = (await res.json()) as Tournament[];
  const processedTournamentIds = processedTournaments().map(
    (t: Tournament) => t.id
  );
  return tournaments
    .filter(
      (tournament) => tournament.players && tournament.players >= MIN_GAMES
    )
    .filter((tournament) => !processedTournamentIds.includes(tournament.id));
};

// [
//     {
//         "round": 1,
//         "phase": 1,
//         "table": 1,
//         "winner": "shoji300",
//         "player1": "hedilily",
//         "player2": "shoji300"
//     },
//     ...
//     {
//         "phase": 2,
//         "round": 12,
//         "match": "T2-1",
//         "winner": "espel",
//         "player1": "harun",
//         "player2": "espel"
//     }
// ]
const getPairings = async (tournament: Tournament) => {
  const res = await fetch(
    `${BASE}/tournaments/${tournament.id}/pairings${append}`
  );
  const pairings: Pairing[] = (await res.json()) as Pairing[];
  return pairings.map((pairing) => {
    return {
      winner: `${tournament.id}-${pairing.winner}`,
      loser: `${tournament.id}-${
        pairing.player1 === pairing.winner ? pairing.player2 : pairing.player1
      }`,
    };
  });
};

// {
//   name: 'KingHeracross',
//   country: 'US',
//   decklist: { pokemon: [Array], trainer: [Array] },
//   deck: {
//     id: 'ninetales-rapidash-a1',
//     name: 'Ninetales Rapidash',
//     icons: [Array]
//   },
//   placing: 1,
//   player: 'kingheracross',
//   record: { wins: 6, losses: 0, ties: 1 },
//   drop: null
// },
const getDecks = async (tournament: Tournament) => {
  const res = await fetch(
    `${BASE}/tournaments/${tournament.id}/standings${append}`
  );
  const decks_: any = await res.json();

  const decks = decks_.filter(
    (deck: any) =>
      !!deck.decklist &&
      !!deck.decklist.pokemon &&
      !!deck.decklist.trainer &&
      !!deck.record &&
      !!deck.record.wins &&
      !!deck.record.losses
  );

  const amountWithEx = decks.filter((deck: any) => {
    return deck.decklist.pokemon.some((card: any) => card.name.endsWith(" ex"));
  }).length;
  const tournamentExPercent = amountWithEx / decks.length;
  const amountWithWigglytuff = decks.filter((deck: any) => {
    return deck.decklist.pokemon.some((card: any) =>
      card.name.includes("Wigglytuff ex")
    );
  });
  const wigglytuffPercent = amountWithWigglytuff.length / decks.length;
  const noTrainerPercent =
    decks.filter((deck: any) => deck.decklist.trainer.length === 0).length /
    decks.length;

  const pairings = await getPairings(tournament);

  return decks.map((deck: any) => {
    const id = `${tournament.id}-${deck.player}`;
    const wins = pairings
      .filter((pairing) => {
        return pairing.winner === id;
      })
      .map((pairing) => {
        return pairing.loser;
      });
    const losses = pairings
      .filter((pairing) => {
        return pairing.loser === id;
      })
      .map((pairing) => {
        return pairing.winner;
      });

    return {
      id,
      cards: [...deck.decklist.pokemon, ...deck.decklist.trainer],
      pokemon: deck.decklist.pokemon.reduce((acc: number, card: any) => {
        return acc + card.count;
      }, 0),
      differentPokemon: deck.decklist.pokemon.length,
      winCount: deck.record.wins,
      lossCount: deck.record.losses,
      totalGames: deck.record.wins + deck.record.losses,
      date: tournament.date,
      tournamentExPercent,
      wigglytuffPercent,
      noTrainerPercent,
      wins,
      losses,
    };
  });
};

const round = (num: number, places: number) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};

const downloadDecks = async () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.error("API_KEY not set");
    return;
  }
  const tournaments = await getTournaments();
  console.log("Downloaded tournaments");
  console.log(`${tournaments.length} to process`);
  for (let i = 0; i < tournaments.length; i++) {
    const tournament = tournaments[i];
    const t = {
      id: tournament.id,
      date: new Date(tournament.date),
    };
    const decks = await getDecks(t as any);
    const currentDecks = _currentDecks();
    const newDecks = [...currentDecks, ...decks];
    fs.writeFileSync("./data/decks.json", JSON.stringify(newDecks));
    const processed = processedTournaments();
    processed.push(t);
    fs.writeFileSync(
      "./data/processed-tournaments.json",
      JSON.stringify(processed)
    );
    console.log(`${round((i / tournaments.length) * 100, 2)}%`);
  }
};

downloadDecks();
