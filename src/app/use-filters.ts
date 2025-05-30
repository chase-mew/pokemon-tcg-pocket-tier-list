import { useContext } from "react";
import { FilterContext } from "../components/FilterContext";

const useFilters = () => {
  return useContext(FilterContext);
};

export default useFilters;
