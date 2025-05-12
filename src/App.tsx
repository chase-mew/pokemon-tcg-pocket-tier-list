import { Outlet, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/landing/LandingPage";
import DeckPage from "./pages/deck/DeckPage";
import Footer from "./components/Footer";

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
      <Footer />
    </StyledApp>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />

          <Route path="deck">
            <Route index element={<DeckPage />} />
            <Route path=":deckId" element={<DeckPage />} />
          </Route>

          <Route path="*" element={<LandingPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
