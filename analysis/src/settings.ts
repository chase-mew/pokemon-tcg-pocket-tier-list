export const DEBUG: boolean = false;
export const NOEX: boolean = false;
export const OPPONENT_BATTLE: boolean = false;
export const OLD_MULTIPLIER: number = 1;
export const CARDS_IN_DECK: number = 20;
export const RED_CARD_MULTIPLIER: number = 0.9;
export const EXPANSION_RELEASE_DATE: Date = new Date("2025-10-31");
export const POST_EXPANSION_PERCENT: number = 0.95;
export const NOEX_PERCENT_CUTOFF: number = 0.2;
export const WIGGLYTUFF_PERCENT_CUTOFF: number = 0.1;
export const NO_TRAINER_PERCENT_CUTOFF: number = 0.1;
export const MIN_GAMES_IN_TOURNAMENT: number = 50;

const NOW = new Date();
const SECONDS_IN_WEEK = 7 * 24 * 60 * 60 * 1000;
const TIME_PASSED = NOW.getTime() - EXPANSION_RELEASE_DATE.getTime();
const WEEKS_LIVE = TIME_PASSED / SECONDS_IN_WEEK;
console.log("WEEKS_LIVE:", WEEKS_LIVE);

const _WINRATE_IMPORTANCE = 0.4 + WEEKS_LIVE * 0.067;
export const WINRATE_IMPORTANCE = Math.min(_WINRATE_IMPORTANCE, 0.7);
export const POPULARITY_IMPORTANCE: number = 1 - WINRATE_IMPORTANCE;
console.log("WINRATE_IMPORTANCE:", WINRATE_IMPORTANCE);

export const NEW_MULTIPLIER: number = 1 + WEEKS_LIVE / 2;
console.log("NEW_MULTIPLIER:", NEW_MULTIPLIER);
