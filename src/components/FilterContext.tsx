import { createContext, useState } from "react";

interface FilterContextType {
  energy: string | null;
  setEnergy: (energy: string | null) => void;
  includeEx: boolean;
  setIncludeEx: (include: boolean) => void;
}

export const FilterContext = createContext<FilterContextType>({
  energy: null,
  setEnergy: () => {},
  includeEx: true,
  setIncludeEx: () => {},
});

interface Props {
  children: React.ReactNode;
}

const FilterContextProvider = ({ children }: Props) => {
  const [energy, setEnergy] = useState<string | null>(null);
  const [includeEx, setIncludeEx] = useState<boolean>(true);

  return (
    <FilterContext.Provider
      value={{
        energy,
        setEnergy: (energy) => {
          setEnergy(energy);
        },
        includeEx,
        setIncludeEx: (include) => {
          setIncludeEx(include);
        },
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
