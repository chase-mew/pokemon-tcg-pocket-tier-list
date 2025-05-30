import { createContext, useState } from "react";

interface FilterContextType {
  energy: string | null;
  setEnergy: (energy: string | null) => void;
}

export const FilterContext = createContext<FilterContextType>({
  energy: null,
  setEnergy: () => {},
});

interface Props {
  children: React.ReactNode;
}

const FilterContextProvider = ({ children }: Props) => {
  const [energy, setEnergy] = useState<string | null>(null);

  return (
    <FilterContext.Provider
      value={{
        energy,
        setEnergy: (energy) => {
          console.log("setting energy", energy);
          setEnergy(energy);
        },
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
