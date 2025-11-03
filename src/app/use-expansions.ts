import { useQuery } from "@tanstack/react-query";
import { EXPANSIONS_URL } from "./constants";

export interface PackType {
  id: string;
  name: string;
  image: string;
}

export interface ExpansionType {
  id: string;
  name: string;
  packs: PackType[];
}

const useExpansions = (): ExpansionType[] | null => {
  const { data: expansions } = useQuery({
    queryKey: ["expansions"],
    queryFn: async () => {
      const response = await fetch(EXPANSIONS_URL);
      return response.json() as Promise<ExpansionType[]>;
    },
  });

  if (!expansions) return null;

  return expansions.filter(
    (expansion) => expansion.id !== "promo" && expansion.id !== "a4b"
  );
};

export default useExpansions;
