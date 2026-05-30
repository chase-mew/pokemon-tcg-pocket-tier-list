import { useEffect, useState } from "react";

const QUERY = "(max-width: 900px)";

// Tracks whether the viewport is at the app's mobile breakpoint (900px).
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(
    () =>
      typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
};

export default useIsMobile;
