import styled from '@emotion/styled';
import data from 'data.json';
import { Caption, PointTitle } from '@/components/Text.tsx';
import { ILocationInfo } from '@/types/data.ts';

const Address = () => {
  const { locationInfo } = data;
  return (
    <WayWrapper>
      {locationInfo?.map((item: ILocationInfo) => {
        const { title, desc } = item;
        return (
          <Way key={title}>
            <BoldTitle>{title}</BoldTitle>
            <Caption>{desc}</Caption>
          </Way>
        );
      })}
    </WayWrapper>
  );
};

export default Address;

const WayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0px;
  gap: 20px;
`;

// 서초바탕에는 굵은 글씨체가 없고 font-synthesis도 꺼져 있어 font-weight가 먹지 않으므로,
// 글자 테두리를 입혀서 굵게 보이게 합니다. 굵기는 stroke 값으로 조절합니다.
const BoldTitle = styled(PointTitle)`
  -webkit-text-stroke: 0.6px currentColor;
`;

const Way = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;
