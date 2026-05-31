import { getCurrentUserSubscriptions } from "@invertase/firestore-stripe-payments";
import { useEffect, useState } from "react";
import { payments } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const useIsPremium = () => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    // During react-snap prerendering, leave premium status unresolved (null) so
    // the prerendered HTML matches the client's initial hydration render and
    // avoids hydration mismatches on premium-dependent UI.
    const isPrerender =
      typeof navigator !== "undefined" &&
      /ReactSnap/i.test(navigator.userAgent);
    if (isPrerender) return;

    if (loading) return;
    if (!user) {
      setIsPremium(false);
      return;
    }
    getCurrentUserSubscriptions(payments, {
      status: "active", // Optional: filter by status
    })
      .then((subscriptions) => {
        setIsPremium(subscriptions.length > 0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user, loading]);

  return isPremium;
};

export default useIsPremium;
