import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import Popup from "./Popup";
import { useState } from "react";
import Button from "./Button";
import { useTranslation } from "react-i18next";

const UserInfo = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.4rem;
  cursor: pointer;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
`;

const ProfilePicture = styled.img`
  width: 7rem;
  height: 7rem;
  border-radius: 50%;
`;

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Text = styled.p`
  font-size: 1.8rem;
  margin: 0;
  color: var(--main);
  font-weight: 500;
`;

const UserAvatar = styled.img`
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;

  @media (max-width: 900px) {
    width: 2.4rem;
    height: 2.4rem;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 3rem;
`;

const UserAccount = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <UserInfo onClick={() => setIsOpen(true)}>
        <UserAvatar
          src={user.photoURL || undefined}
          alt={user.displayName || "User"}
        />
      </UserInfo>
      <Popup
        width="40rem"
        isOpen={isOpen}
        header="userAccount.title"
        close={() => {
          setIsOpen(false);
        }}
      >
        <UserInfoContainer>
          <ProfilePicture
            src={user.photoURL || undefined}
            alt={user.displayName || "User"}
          />
          <DetailsContainer>
            <Text>{user.displayName}</Text>
            <Text>{user.email}</Text>
          </DetailsContainer>
        </UserInfoContainer>
        <ButtonContainer>
          <Button wide action={signOut}>
            {t("userAccount.signOut")}
          </Button>
        </ButtonContainer>
      </Popup>
    </>
  );
};

export default UserAccount;
