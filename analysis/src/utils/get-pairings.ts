import { Pairing, Tournament } from "./types";

const API_KEY = process.env.API_KEY;
const append = `?key=${API_KEY}`;
const BASE = "https://play.limitlesstcg.com/api";

export const getPairings = async (tournament: Tournament) => {
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
