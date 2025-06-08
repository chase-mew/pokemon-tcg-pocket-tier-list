import Button from "./Button";
import { createCheckoutSession } from "@invertase/firestore-stripe-payments";
import { MANAGE_SUBSCRIPTION_URL, MONTHLY_PRICE_ID } from "../app/constants";
import { payments } from "../config/firebase";
import useIsPremium from "../app/use-is-premium";
import { useState } from "react";
import Popup from "./Popup";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Premium = () => {
  const { t } = useTranslation();
  const isPremium = useIsPremium();
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Button
        action={async () => {
          setIsOpen(true);
        }}
      >
        Get Premium
      </Button>
      <Popup
        isOpen={isOpen}
        header="premium.title"
        close={() => {
          setIsOpen(false);
        }}
      >
        {!user ? (
          <Button wide action={signInWithGoogle}>
            {t("premium.signIn")}
          </Button>
        ) : !isPremium ? (
          <Button
            wide
            isLoading={isLoading}
            action={async () => {
              setIsLoading(true);
              const session = await createCheckoutSession(payments, {
                price: MONTHLY_PRICE_ID,
              });
              window.location.assign(session.url);
              setIsLoading(false);
            }}
          >
            {t("premium.getPremium")}
          </Button>
        ) : (
          <Button
            wide
            action={() => {
              window.open(MANAGE_SUBSCRIPTION_URL, "_blank")?.focus();
            }}
          >
            {t("premium.manageSubscription")}
          </Button>
        )}
      </Popup>
    </>
  );
};

export default Premium;
