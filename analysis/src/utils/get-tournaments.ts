import fs from "fs";
import { Tournament } from "./types";

const API_KEY = process.env.API_KEY;
const GAME = "POCKET";
const append = `?key=${API_KEY}`;
const BASE = "https://play.limitlesstcg.com/api";
const MIN_GAMES = 100;

const processedTournaments = () => {
  return JSON.parse(
    fs.readFileSync("./data/processed-tournaments.json", "utf-8")
  );
};

export const getTournaments = async () => {
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
