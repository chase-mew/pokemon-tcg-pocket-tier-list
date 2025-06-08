import Button from "./Button";
import { createCheckoutSession } from "@invertase/firestore-stripe-payments";
import {
  FREE_DECK_AMOUNT,
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

const PremiumIcon = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const ComparisonTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 2.2rem;
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
`;

interface Props {
  showUpsell?: boolean;
}

const Premium = ({ showUpsell = false }: Props) => {
  const { t } = useTranslation();
  const isPremium = useIsPremium();
  const { user, signInWithGoogle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isPremium && (
        <ButtonContainer
          onClick={async () => {
            setIsOpen(true);
          }}
        >
          <PremiumIcon src={premiumIcon} alt="Premium" />
        </ButtonContainer>
      )}
      {!isPremium && showUpsell && (
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
        <ComparisonTable>
          <thead>
            <tr>
              <TableHeader $isFirst>Feature</TableHeader>
              <TableHeader>Free</TableHeader>
              <TableHeader>Premium</TableHeader>
            </tr>
          </thead>
          <tr>
            <FeatureCell>
              Best Deck Finder
              <Tooltip text="Find the strongest deck you can build with your cards" />
            </FeatureCell>
            <CommonCell>✅</CommonCell>
            <CommonCell>✅</CommonCell>
          </tr>
          <tr>
            <FeatureCell>
              Exclude Cards You Don't Have
              <Tooltip text="Filter out cards you don't own to live update the tier list with what you have" />
            </FeatureCell>
            <CommonCell>✅</CommonCell>
            <CommonCell>✅</CommonCell>
          </tr>
          <tr>
            <FeatureCell>
              Deck Strengths/Weaknesses
              <Tooltip text="For each deck, see which decks it is strong against and weak against, including winrates" />
            </FeatureCell>
            <FreeCell>🚫</FreeCell>
            <CommonCell>✅</CommonCell>
          </tr>
          <tr>
            <TableCell>
              Deck Filters
              <Tooltip text="Filter decks by Energy or no Ex cards, useful for helping beat some of those Solo Battles" />
            </TableCell>
            <FreeCell>🚫</FreeCell>
            <PremiumCell>✅</PremiumCell>
          </tr>
          <tr>
            <FeatureCell>
              Tier List Updated
              <Tooltip text="How often the tier list is updated with new data. Faster updates help you stay ahead of the meta." />
            </FeatureCell>
            <FreeCell>Weekly</FreeCell>
            <PremiumCell>Hourly</PremiumCell>
          </tr>
          <tr>
            <FeatureCell>
              Decks on Tier List
              <Tooltip text="Number of decks shown in the tier list. More decks means more options for you to choose from." />
            </FeatureCell>
            <FreeCell>{FREE_DECK_AMOUNT}</FreeCell>
            <PremiumCell>Up to 100</PremiumCell>
          </tr>
        </ComparisonTable>
        {!user ? (
          <Button wide action={signInWithGoogle}>
            {t("premium.signIn")}
          </Button>
        ) : !isPremium ? (
          <>
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
              {t("premium.getPremiumMonthly")}
            </Button>
            <Button
              wide
              isLoading={isLoading}
              action={async () => {
                setIsLoading(true);
                const session = await createCheckoutSession(payments, {
                  price: YEARLY_PRICE_ID,
                });
                window.location.assign(session.url);
                setIsLoading(false);
              }}
            >
              {t("premium.getPremiumYearly")}
            </Button>
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
      </Popup>
    </>
  );
};

export default Premium;
