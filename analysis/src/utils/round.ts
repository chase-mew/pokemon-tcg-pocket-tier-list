export const round = (num: number, places: number) => {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
};
