export const EXPANSION_NAMES = {
  a1: "Genetic Apex",
  a1a: "Mythical Island",
  pa: "Promo-A",
  a2: "Space-Time Smackdown",
  a2a: "Triumphant Light",
  a2b: "Shining Revelry",
  a3: "Celestial Guardians",
  a3a: "Extradimensional Crisis",
  a3b: "Eevee Grove",
  a4: "Wisdom of Sea and Sky",
  a4a: "Secluded Springs",
  b1: "Mega Rising",
};

export const EXPANSION_CODES = Object.keys(EXPANSION_NAMES);

export const getExpansionName = (expansion: string) => {
  return EXPANSION_NAMES[expansion as keyof typeof EXPANSION_NAMES];
};
