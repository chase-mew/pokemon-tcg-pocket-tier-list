import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./styles/GlobalStyles";
import { BrowserRouter } from "react-router-dom";
import MissingContextProvider from "./components/MissingContext";
import FilterContextProvider from "./components/FilterContext";
import "./i18n";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MissingContextProvider>
        <FilterContextProvider>
          <GlobalStyles />
          <App />
        </FilterContextProvider>
      </MissingContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
