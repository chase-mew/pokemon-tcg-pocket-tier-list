const cardToString = (card: any): string => {
  return `${card.count} ${card.name} ${card.set} ${card.number}`;
};

export default cardToString;
