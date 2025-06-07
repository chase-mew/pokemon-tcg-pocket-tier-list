import { createContext, useState } from "react";

interface MissingContextType {
  missing: string[];
  addMissing: (ids: string[]) => void;
}

export const MissingContext = createContext<MissingContextType>({
  missing: [],
  addMissing: () => {},
});

interface Props {
  children: React.ReactNode;
}

const MissingContextProvider = ({ children }: Props) => {
  const [missing, setMissing] = useState<string[]>([]);

  const addMissing = (ids: string[]) => {
    const newMissing = [...missing, ...ids];
    setMissing(newMissing);
  };

  return (
    <MissingContext.Provider
      value={{
        missing,
        addMissing,
      }}
    >
      {children}
    </MissingContext.Provider>
  );
};

export default MissingContextProvider;
