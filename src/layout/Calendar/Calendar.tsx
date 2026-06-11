import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import data from 'data.json';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const Calendar = () => {
  const { greeting } = data;
  const eventDate = new Date(greeting.weddingDate);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = eventDate.getFullYear();
  const month = eventDate.getMonth();
  const startIdx = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((startIdx + total) / 7) * 7;

  const cells = Array.from({ length: cellCount }, (_, i) => {
    const dayNum = i - startIdx + 1;
    const dayDate = new Date(year, month, dayNum);
    const isCurrent = dayNum > 0 && dayNum <= total && dayDate.getMonth() === month;
    const isHighlight = isCurrent && isSameDay(dayDate, eventDate);

    return (
      <Cell key={i} isSunday={i % 7 === 0} isSaturday={i % 7 === 6}>
        {isCurrent ? (
          isHighlight ? (
            <HeartAnimate>
              <svg viewBox="0 0 24 24" width="100%" height="100%" fill="#ef7baf">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </HeartAnimate>
          ) : (
            <>{dayNum}</>
          )
        ) : (
          ''
        )}
      </Cell>
    );
  });

  const renderCountdown = () => {
    const diff = eventDate.getTime() - now.getTime();
    const dayDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    const isPast = dayDiff < 0;

    if (dayDiff === 0) {
      return <Point>❤️ 오늘이 바로 그날 ❤️</Point>;
    } else if (!isPast) {
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      return (
        <>
          우리 결혼식까지 <Point>{dayDiff}일</Point> {hours}시간 {mins}분 {secs}초 남았어요.
        </>
      );
    } else {
      return (
        <>
          저희 부부, 어느덧 <Point>+{Math.abs(dayDiff)}일차</Point> 입니다.
        </>
      );
    }
  };

  return (
    <CalendarWrapper>
      <MonthTitle>
        {year}년 {month + 1}월
      </MonthTitle>
      <Grid>
        {WEEK_DAYS.map((day, i) => (
          <WeekDay key={day} isSunday={i === 0} isSaturday={i === 6}>
            {day}
          </WeekDay>
        ))}
        {cells}
      </Grid>
      <Countdown>{renderCountdown()}</Countdown>
    </CalendarWrapper>
  );
};

export default Calendar;

const heartBlink = keyframes`
  0% { opacity: 1; transform: scale(1); }
  30% { opacity: 0.5; transform: scale(1.16); }
  60% { opacity: 1; transform: scale(1); }
  100% { opacity: 1; transform: scale(1); }
`;

const CalendarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const MonthTitle = styled.p`
  font-family: HSSanTokki20-Regular, serif;
  font-size: 1.2rem;
  color: #e88ca6;
  margin: 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  width: 100%;
  max-width: 320px;
  padding: 16px 8px;
  border-top: 1px solid #f3d4de;
  border-bottom: 1px solid #f3d4de;
`;

const WeekDay = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  padding: 4px 0;
  color: ${(props) => (props.isSunday ? '#e88ca6' : props.isSaturday ? '#8ca6e8' : '#333')};
`;

const Cell = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 0.9rem;
  color: ${(props) => (props.isSunday ? '#e88ca6' : props.isSaturday ? '#8ca6e8' : '#333')};
`;

const HeartAnimate = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  animation: ${heartBlink} 1.5s infinite;
`;

const Countdown = styled.p`
  font-size: 0.95rem;
  margin: 0;
  text-align: center;
`;

const Point = styled.span`
  color: #ef7baf;
  font-weight: 600;
`;
