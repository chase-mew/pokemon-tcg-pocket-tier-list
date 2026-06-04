import Button from "./Button";
import { createCheckoutSession } from "@invertase/firestore-stripe-payments";
import {
  FREE_TRIAL_DAYS,
  MANAGE_SUBSCRIPTION_URL,
  MONTHLY_PRICE_ID,
  YEARLY_PRICE_ID,
} from "../app/constants";
import { payments } from "../config/firebase";
import useIsPremium from "../app/use-is-premium";
import { useState } from "react";
import Popup from "./Popup";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import premiumIcon from "../assets/premium.png";
import Tooltip from "./Tooltip";

const ButtonContainer = styled.button`
  cursor: pointer;
`;

const RemoveAdsLink = styled.button`
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--e);
  white-space: nowrap;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const PremiumIcon = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;

  @media (max-width: 900px) {
    width: 3.2rem;
    height: 3.2rem;
  }
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 2.2rem;

  @media (max-width: 900px) {
    font-size: 1.6rem;
    margin: 1.5rem 0;
  }
`;

const TableHeader = styled.th<{ $isFirst?: boolean }>`
  padding: 1.2rem;
  text-align: center;
  border-bottom: 2px solid var(--main);
  color: var(--main);
  font-weight: 600;
  width: ${(props) => (props.$isFirst ? "50%" : "25%")};
  font-size: 2.4rem;

  &:first-child {
    text-align: left;
  }

  @media (max-width: 900px) {
    padding: 0.8rem;
    font-size: 1.8rem;
  }
`;

const TableCell = styled.td`
  padding: 1.2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--main);
  font-size: 2.2rem;

  &:first-child {
    text-align: left;
  }

  @media (max-width: 900px) {
    padding: 0.8rem;
    font-size: 1.6rem;
  }
`;

const PremiumCell = styled(TableCell)`
  color: var(--e);
  font-weight: 500;
`;

const FreeCell = styled(TableCell)`
  color: var(--s);
`;

const CommonCell = styled(TableCell)`
  color: var(--main);
`;

const FeatureCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 0.8rem;

  @media (max-width: 900px) {
    gap: 0.4rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;

  @media (max-width: 900px) {
    gap: 0.8rem;
  }
`;

// Monthly is offered as a quiet secondary option so the annual plan reads as
// the default choice (better LTV / conversion).
const SecondaryPlan = styled.button`
  align-self: center;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: underline;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TrialNote = styled.p`
  margin: 0;
  text-align: center;
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.55);
`;

const Headline = styled.h2`
  margin: 0 0 0.5rem;
  text-align: center;
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--main);

  @media (max-width: 900px) {
    font-size: 2.2rem;
  }
`;

interface Props {
  showUpsell?: boolean;
  // "link" renders a compact "Remove ads" text trigger (used by the ad anchor)
  // instead of the default premium icon / upsell button.
  variant?: "default" | "link";
  linkLabel?: string;
}

const Premium = ({
  showUpsell = false,
  variant = "default",
  linkLabel,
}: Props) => {
  const { t } = useTranslation();
  const isPremium = useIsPremium();
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "yearly" | null>(
    null
  );

  const startCheckout = async (price: string, plan: "monthly" | "yearly") => {
    if (loadingPlan !== null) return;
    setLoadingPlan(plan);
    try {
      // The extension reads `trial_period_days` from the checkout session
      // document root (it writes our params to Firestore verbatim) and maps it
      // to subscription_data.trial_period_days. The typed SDK omits the field,
      // so it's passed through with a cast.
      const session = await createCheckoutSession(payments, {
        price,
        ...(FREE_TRIAL_DAYS > 0
          ? { trial_period_days: FREE_TRIAL_DAYS }
          : {}),
      } as Parameters<typeof createCheckoutSession>[1]);
      window.location.assign(session.url);
    } catch (error) {
      console.error(error);
      setLoadingPlan(null);
    }
  };

  if (isPremium === null) return null;

  const isLink = variant === "link";

  return (
    <>
      {isLink && !isPremium && (
        <RemoveAdsLink onClick={() => setIsOpen(true)}>
          {linkLabel ?? t("ads.removeAds")}
        </RemoveAdsLink>
      )}
      {!isLink && isPremium && (
        <ButtonContainer
          onClick={async () => {
            setIsOpen(true);
          }}
        >
          <PremiumIcon src={premiumIcon} alt="Premium" />
        </ButtonContainer>
      )}
      {!isLink && !isPremium && showUpsell && (
        <Button
          wide
          action={async () => {
            setIsOpen(true);
          }}
          icon={premiumIcon}
        >
          {t("premium.getPremium")}
        </Button>
      )}
      <Popup
        width="80rem"
        isOpen={isOpen}
        header=""
        close={() => {
          setIsOpen(false);
        }}
      >
        <Headline>{t("premium.headline")}</Headline>
        <ComparisonTable>
          <thead>
            <tr>
              <TableHeader $isFirst>{t("premium.features.title")}</TableHeader>
              <TableHeader>{t("premium.features.free")}</TableHeader>
              <TableHeader>{t("premium.features.premium")}</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <FeatureCell>
                {t("premium.features.removeAds.title")}
                <Tooltip text={t("premium.features.removeAds.description")} />
              </FeatureCell>
              <FreeCell>{t("premium.features.removeAds.free")}</FreeCell>
              <PremiumCell>{t("premium.features.removeAds.premium")}</PremiumCell>
            </tr>
            <tr>
              <FeatureCell>
                {t("premium.features.bestDeckFinder.title")}
                <Tooltip
                  text={t("premium.features.bestDeckFinder.description")}
                />
              </FeatureCell>
              <CommonCell>
                {t("premium.features.bestDeckFinder.free")}
              </CommonCell>
              <CommonCell>
                {t("premium.features.bestDeckFinder.premium")}
              </CommonCell>
            </tr>
            <tr>
              <FeatureCell>
                {t("premium.features.exclude.title")}
                <Tooltip text={t("premium.features.exclude.description")} />
              </FeatureCell>
              <CommonCell>{t("premium.features.exclude.free")}</CommonCell>
              <CommonCell>{t("premium.features.exclude.premium")}</CommonCell>
            </tr>
            <tr>
              <FeatureCell>
                {t("premium.features.matchups.title")}
                <Tooltip text={t("premium.features.matchups.description")} />
              </FeatureCell>
              <FreeCell>{t("premium.features.matchups.free")}</FreeCell>
              <CommonCell>{t("premium.features.matchups.premium")}</CommonCell>
            </tr>
            <tr>
              <TableCell>
                {t("premium.features.filters.title")}
                <Tooltip text={t("premium.features.filters.description")} />
              </TableCell>
              <FreeCell>{t("premium.features.filters.free")}</FreeCell>
              <PremiumCell>{t("premium.features.filters.premium")}</PremiumCell>
            </tr>
            <tr>
              <TableCell>
                {t("premium.features.sortBy.title")}
                <Tooltip text={t("premium.features.sortBy.description")} />
              </TableCell>
              <FreeCell>{t("premium.features.sortBy.free")}</FreeCell>
              <PremiumCell>{t("premium.features.filters.premium")}</PremiumCell>
            </tr>

            <tr>
              <FeatureCell>
                {t("premium.features.contact.title")}
                <Tooltip text={t("premium.features.contact.description")} />
              </FeatureCell>
              <FreeCell>{t("premium.features.contact.free")}</FreeCell>
              <PremiumCell>{t("premium.features.contact.premium")}</PremiumCell>
            </tr>
            <tr>
              <FeatureCell>
                {t("premium.features.updated.title")}
                <Tooltip text={t("premium.features.updated.description")} />
              </FeatureCell>
              <FreeCell>{t("premium.features.updated.free")}</FreeCell>
              <PremiumCell>{t("premium.features.updated.premium")}</PremiumCell>
            </tr>
            <tr>
              <FeatureCell>
                {t("premium.features.decks.title")}
                <Tooltip text={t("premium.features.decks.description")} />
              </FeatureCell>
              <FreeCell>{t("premium.features.decks.free")}</FreeCell>
              <PremiumCell>{t("premium.features.decks.premium")}</PremiumCell>
            </tr>
          </tbody>
        </ComparisonTable>
        <ButtonWrapper>
          {!user ? (
            <Button wide action={signInWithGoogle}>
              {t("premium.signIn")}
            </Button>
          ) : !isPremium ? (
            <>
              <Button
                wide
                isLoading={loadingPlan === "yearly"}
                action={() => startCheckout(YEARLY_PRICE_ID, "yearly")}
              >
                {t("premium.getPremiumYearly")}
              </Button>
              <SecondaryPlan
                disabled={loadingPlan !== null}
                onClick={() => startCheckout(MONTHLY_PRICE_ID, "monthly")}
              >
                {t("premium.getPremiumMonthly")}
              </SecondaryPlan>
              <TrialNote>{t("premium.freeTrial")}</TrialNote>
            </>
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
        </ButtonWrapper>
      </Popup>
    </>
  );
};

export default Premium;
