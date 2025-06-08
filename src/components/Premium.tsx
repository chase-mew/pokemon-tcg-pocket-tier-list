import Button from "./Button";
import { createCheckoutSession } from "@invertase/firestore-stripe-payments";
import { MANAGE_SUBSCRIPTION_URL, MONTHLY_PRICE_ID } from "../app/constants";
import { payments } from "../config/firebase";
import useIsPremium from "../app/use-is-premium";
import { useState } from "react";
import Popup from "./Popup";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import premiumIcon from "../assets/premium.png";

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

const TableSection = styled.tbody`
  &:not(:last-child) {
    margin-bottom: 2rem;
  }
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
        header="premium.title"
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
          <TableSection>
            <tr>
              <CommonCell>Best Deck Finder</CommonCell>
              <CommonCell>✅</CommonCell>
              <CommonCell>✅</CommonCell>
            </tr>
            <tr>
              <CommonCell>Exclude Cards You Don't Have</CommonCell>
              <CommonCell>✅</CommonCell>
              <CommonCell>✅</CommonCell>
            </tr>
          </TableSection>
          <tr>
            <CommonCell>Deck Strengths/Weaknesses</CommonCell>
            <FreeCell>🚫</FreeCell>
            <CommonCell>✅</CommonCell>
          </tr>
          <TableSection>
            <tr>
              <TableCell>Tier List Update Frequency</TableCell>
              <FreeCell>Weekly</FreeCell>
              <PremiumCell>Hourly</PremiumCell>
            </tr>
            <tr>
              <TableCell>Filters</TableCell>
              <FreeCell>🚫</FreeCell>
              <PremiumCell>✅</PremiumCell>
            </tr>
            <tr>
              <TableCell>Decks on Tier List</TableCell>
              <FreeCell>20 Max</FreeCell>
              <PremiumCell>Up to 100</PremiumCell>
            </tr>
          </TableSection>
        </ComparisonTable>
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
