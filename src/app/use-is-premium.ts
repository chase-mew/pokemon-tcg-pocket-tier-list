import { getCurrentUserSubscriptions } from "@invertase/firestore-stripe-payments";
import { useEffect, useState } from "react";
import { payments } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const useIsPremium = () => {
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
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
