import styled from '@emotion/styled';
import data from 'data.json';
import Host from '../Contact/Host.tsx';
import RoundButton from '@/components/RoundButton.tsx';
import HauntedText from '@/components/HauntedText.tsx';

const Invitation = () => {
  const { greeting } = data;
  return (
    <InvitationWrapper>
      <HauntedText text={greeting.message} />
      <Host />
      <HauntedText text={greeting.eventDetail} />
      {/* TODO: 구글캘린더 추가하기 기능을 넣는다면 링크 수정 */}
      <RoundButton
        target="_blank"
        href=""
        rel="noreferrer">
        <HauntedText text="구글 캘린더 추가하기" inline />
      </RoundButton>
    </InvitationWrapper>
  );
};

export default Invitation;

const InvitationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
