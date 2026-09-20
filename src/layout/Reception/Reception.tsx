import styled from '@emotion/styled';
import data from 'data.json';
import HauntedText from '@/components/HauntedText.tsx';
import { ILocationInfo } from '@/types/data.ts';

const Reception = () => {
  const { receptionMessage, receptionInfo } = data;
  return (
    <ReceptionWrapper>
      <HauntedText text={receptionMessage} />
      {receptionInfo?.map((item: ILocationInfo) => {
        const { title, desc } = item;
        return (
          <Info key={title}>
            <InfoTitle text={title} />
            <HauntedText text={desc} />
          </Info>
        );
      })}
    </ReceptionWrapper>
  );
};

export default Reception;

const ReceptionWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0px;
  gap: 20px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoTitle = styled(HauntedText)`
  font-family: 'SeochoBatang-Regular', serif;
  line-height: 1.6;
`;
