import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

// Tracks whether the *current* route has finished rendering meaningful
// publisher content. Ads must never show on loading, error, or otherwise
// content-less screens (AdSense "ads on screens without publisher content"
// policy), so ad components gate on this.
//
// Readiness is stored as the path that was marked ready, and compared against
// the current path. This makes navigation reset readiness automatically (the
// stored path no longer matches) without an effect that could race with the
// next page's "mark ready" effect.
interface ContentReadyValue {
  readyPath: string | null;
  markReady: (path: string) => void;
}

const ContentReadyContext = createContext<ContentReadyValue | undefined>(
  undefined
);

export const ContentReadyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [readyPath, setReadyPath] = useState<string | null>(null);
  const markReady = useCallback((path: string) => setReadyPath(path), []);

  return (
    <ContentReadyContext.Provider value={{ readyPath, markReady }}>
      {children}
    </ContentReadyContext.Provider>
  );
};

const useContentReadyContext = (): ContentReadyValue => {
  const ctx = useContext(ContentReadyContext);
  if (!ctx) {
    throw new Error("ContentReady hooks must be used within ContentReadyProvider");
  }
  return ctx;
};

// For ad components: true only once the current route has marked itself ready.
export const useContentReady = (): boolean => {
  const { readyPath } = useContentReadyContext();
  const { pathname } = useLocation();
  return readyPath === pathname;
};

// For pages: call with `true` once primary content has rendered. Pages that
// never become ready (errors, empty states) simply never show ads.
export const useMarkContentReady = (isReady: boolean): void => {
  const { markReady } = useContentReadyContext();
  const { pathname } = useLocation();
  useEffect(() => {
    if (isReady) markReady(pathname);
  }, [isReady, pathname, markReady]);
};
