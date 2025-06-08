import { getCurrentUserSubscriptions } from "@invertase/firestore-stripe-payments";
import { useEffect, useState } from "react";
import { payments } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";

const useIsPremium = () => {
  const [isPremium, setIsPremium] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    getCurrentUserSubscriptions(payments, {
      status: "active", // Optional: filter by status
    })
      .then((subscriptions) => {
        setIsPremium(subscriptions.length > 0);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user]);

  return isPremium;
};

export default useIsPremium;
