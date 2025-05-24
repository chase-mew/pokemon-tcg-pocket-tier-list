import fs from "fs";
import { getTournaments } from "./utils/get-tournaments";
import getTournamentDecks from "./utils/get-tournament-decks";
import { round } from "./utils/round";

const _currentDecks = () => {
  return JSON.parse(fs.readFileSync("./data/decks.json", "utf-8"));
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
    const decks = await getTournamentDecks(t as any);
    const currentDecks = _currentDecks();
    const newDecks = [...currentDecks, ...decks];
    fs.writeFileSync("./data/decks.json", JSON.stringify(newDecks));
    const processed = JSON.parse(
      fs.readFileSync("./data/processed-tournaments.json", "utf-8")
    );
    processed.push(t);
    fs.writeFileSync(
      "./data/processed-tournaments.json",
      JSON.stringify(processed)
    );
    console.log(`${round((i / tournaments.length) * 100, 2)}%`);
  }
};

downloadDecks();
