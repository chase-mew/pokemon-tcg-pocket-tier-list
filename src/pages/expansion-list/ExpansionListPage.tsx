import styled from "styled-components";
import useCards from "../../app/use-cards";
import ExpansionIcon from "../../components/ExpansionIcon";
import useExpansions, {
  ExpansionType,
  PackType,
} from "../../app/use-expansions";

const StyledExpansionListPage = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  @media (max-width: 900px) {
    height: auto;
  }
`;

const DeckRow = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  border-bottom: 0.4rem solid var(--border);

  /* Gradient on right side */
  @media (min-width: 900px) {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100%;
      background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--bg));
    }
  }

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const RowHeader = styled.div<{ $backgroundColor: string }>`
  height: 100%;
  aspect-ratio: 1 / 1;
  background: ${(props) => props.$backgroundColor};
  color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.3rem;
  font-weight: 400;

  @media (max-width: 900px) {
    width: 100%;
    height: 8rem;
  }
`;

const RowContent = styled.div`
  height: 100%;
  flex: 1;
  padding: 1.5rem 2rem;
  display: flex;
  gap: 2rem;
  width: 100%;

  @media (min-width: 900px) {
    overflow-x: auto;
  }

  @media (max-width: 900px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 2rem;
  }
`;

const Loading = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: 500;
`;

const ExpansionListPage = () => {
  const cards = useCards(1_000_000);
  const expansions = useExpansions();

  if (!cards || !expansions) return <Loading>Loading...</Loading>;

  interface PackData {
    expansionId: string;
    packId: string;
    packName: string;
    packImage: string;
    totalScore: number;
  }

  const expansionData: PackData[] = expansions
    .reduce(
      (
        acc: { expansionId: string; pack: PackType }[],
        expansion: ExpansionType
      ) => {
        return [
          ...acc,
          ...expansion.packs.map((pack) => ({
            expansionId: expansion.id,
            pack: pack,
          })),
        ];
      },
      []
    )
    .map((data: { expansionId: string; pack: PackType }) => {
      return {
        expansionId: data.expansionId,
        packId: data.pack.id,
        packName: data.pack.name,
        packImage: data.pack.image,
        totalScore: cards
          .filter((card) => {
            return (
              card.set === data.expansionId &&
              (card.pack === data.pack.name ||
                card.pack.toLowerCase().includes("shared"))
            );
          })
          .reduce((acc, card) => acc + card.score, 0),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
  const bestScore = expansionData[0].totalScore;

  const worstScore = expansionData[expansionData.length - 1].totalScore;

  const steps = (bestScore - worstScore) / 6;

  const sTier = expansionData.filter(
    (data) => data.totalScore >= bestScore - steps
  );
  const aTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps &&
      data.totalScore >= bestScore - steps * 2
  );
  const bTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps * 2 &&
      data.totalScore >= bestScore - steps * 3
  );
  const cTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps * 3 &&
      data.totalScore >= bestScore - steps * 4
  );
  const dTier = expansionData.filter(
    (data) =>
      data.totalScore < bestScore - steps * 4 &&
      data.totalScore >= bestScore - steps * 5
  );
  const eTier = expansionData.filter(
    (data) => data.totalScore < bestScore - steps * 5
  );

  return (
    <StyledExpansionListPage>
      <DeckRow>
        <RowHeader $backgroundColor="var(--s)">S</RowHeader>
        <RowContent>
          {sTier.map((data) => (
            <ExpansionIcon key={data.packId} image={data.packImage} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--a)">A</RowHeader>
        <RowContent>
          {aTier.map((data) => (
            <ExpansionIcon key={data.packId} image={data.packImage} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--b)">B</RowHeader>
        <RowContent>
          {bTier.map((data) => (
            <ExpansionIcon key={data.packId} image={data.packImage} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--c)">C</RowHeader>
        <RowContent>
          {cTier.map((data) => (
            <ExpansionIcon key={data.packId} image={data.packImage} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--d)">D</RowHeader>
        <RowContent>
          {dTier.map((data) => (
            <ExpansionIcon key={data.packId} image={data.packImage} />
          ))}
        </RowContent>
      </DeckRow>
      <DeckRow>
        <RowHeader $backgroundColor="var(--e)">E</RowHeader>
        <RowContent>
          {eTier.map((data) => (
            <ExpansionIcon key={data.packId} image={data.packImage} />
          ))}
        </RowContent>
      </DeckRow>
    </StyledExpansionListPage>
  );
};

export default ExpansionListPage;
