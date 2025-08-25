import { Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TierListPage from "./pages/tier-list/TierListPage";
import DeckPage from "./pages/deck/DeckPage";
import LandingPage from "./pages/landing/LandingPage";
import { AuthProvider } from "./contexts/AuthContext";
import { DecksProvider } from "./contexts/DecksContext";
import CardsListPage from "./pages/cards-list/CardsListPage";
import ExpansionListPage from "./pages/expansion-list/ExpansionListPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

const StyledApp = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg);
`;

const Layout = () => {
  return (
    <StyledApp>
      <Outlet />
    </StyledApp>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DecksProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="tier-list" element={<TierListPage />} />
              <Route path="cards-list" element={<CardsListPage />} />
              <Route path="expansion-list" element={<ExpansionListPage />} />
              <Route path="deck">
                <Route index element={<DeckPage />} />
                <Route path=":deckId" element={<DeckPage />} />
              </Route>

              <Route path="*" element={<LandingPage />} />
            </Route>
          </Routes>
        </DecksProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
