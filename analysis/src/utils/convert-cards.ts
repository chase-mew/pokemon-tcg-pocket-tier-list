interface LimitlessCardType {
  count: number;
  name: string;
  set: string;
  number: string;
}

const setCode = (set: string): string => {
  if (set === "P-A") return "pa";
  if (set === "P-B") return "pb";
  return set.toLowerCase();
};

const cardToId = (card: LimitlessCardType): string => {
  const id = card.number;
  const padded = id.padStart(3, "0");
  const output = `${card.count}:${setCode(card.set)}-${padded}`;
  return output;
};

export const convertCardsToIds = (cards: LimitlessCardType[]): string[] => {
  return cards.map((card) => cardToId(card));
};
