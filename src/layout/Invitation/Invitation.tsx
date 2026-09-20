import styled from '@emotion/styled';
import data from 'data.json';
import Host from '../Contact/Host.tsx';
import RoundButton from '@/components/RoundButton.tsx';
import HauntedText from '@/components/HauntedText.tsx';

const WEDDING_DURATION_HOURS = 2;

// weddingDate("YYYY-MM-DDTHH:mm:ss")는 KST 기준 벽시계 시간이므로,
// 브라우저 로컬 타임존에 영향받지 않도록 Date.UTC로 파싱/연산만 하고
// ctz=Asia/Seoul로 실제 타임존을 구글 캘린더에 알려준다.
const toGoogleDate = (date: Date) =>
  date.toISOString().replace(/[-:]/g, '').split('.')[0];

const getGoogleCalendarLink = () => {
  const { weddingDate, eventDetail } = data.greeting;
  const [datePart, timePart] = weddingDate.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);

  const start = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const end = new Date(start.getTime() + WEDDING_DURATION_HOURS * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: '명지 ♥ 민석 결혼식',
    dates: `${toGoogleDate(start)}/${toGoogleDate(end)}`,
    details: eventDetail,
    location: data.mapInfo.address1,
    ctz: 'Asia/Seoul',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const Invitation = () => {
  const { greeting } = data;
  return (
    <InvitationWrapper>
      <HauntedText text={greeting.message} />
      <Host />
      <HauntedText text={greeting.eventDetail} />
      <RoundButton
        target="_blank"
        href={getGoogleCalendarLink()}
        rel="noreferrer">
        구글 캘린더 추가하기
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
