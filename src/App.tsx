import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import data from 'data.json';
import messageImg from '@/assets/images/message.jpg';
import partyImg from '@/assets/images/party.jpg';
import ErrorBoundary from '@/components/ErrorBoundary.tsx';
import HauntedText from '@/components/HauntedText.tsx';
import { Heading1 } from '@/components/Text.tsx';
import TypewriterText from '@/components/TypewriterText.tsx';
import Wrapper from '@/components/Wrapper.tsx';
import Account from '@/layout/Account/Account.tsx';
import Calendar from '@/layout/Calendar/Calendar.tsx';
import Container from '@/layout/Container.tsx';
import FloatingBar from '@/layout/FloatingBar/FloatingBar.tsx';
import GalleryWrap from '@/layout/Gallery/GalleryWrap.tsx';
import Guestbook from '@/layout/Guestbook/Guestbook.tsx';
import Invitation from '@/layout/Invitation/Invitation.tsx';
import Location from '@/layout/Location/Location.tsx';
import Main from '@/layout/Main/Main.tsx';
import Reception from '@/layout/Reception/Reception.tsx';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef(null);
  const invitationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // 모시는 글 섹션이 화면 아래에서 올라올수록 배경이 흰 느낌에서 어두워지도록,
  // 스크롤 진행도(0~1)를 CSS 변수로 넘깁니다. (리렌더 없이 style만 바꿉니다.)
  useEffect(() => {
    const el = invitationRef.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - top) / (vh * 0.6)));
      // 제곱으로 완급을 줘서 초반에는 흰 느낌을 오래 유지하고, 뒤쪽에서 빠르게 어두워집니다.
      el.style.setProperty('--invitation-dark', (progress * progress).toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const checkScrollPosition = () => {
    if (galleryRef.current) {
      const { offsetTop } = galleryRef.current;
      const scrollPosition = window.scrollY;

      if (scrollPosition >= offsetTop) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  };

  return (
    <Container>
      <Main />
      <InvitationSection ref={invitationRef}>
        <Wrapper>
          <InvitationHeading text="모시는 글" />
          <Invitation />
        </Wrapper>
      </InvitationSection>
      <Wrapper ref={galleryRef}>
        <Heading1>갤러리</Heading1>
        <GalleryWrap />
      </Wrapper>
      <Wrapper>
        <Heading1>마음 전하실 곳</Heading1>
        <AccountMessageBox>
          <TypewriterText text={data.accountMessage} />
        </AccountMessageBox>
        <Account />
      </Wrapper>
      <CalendarSection>
        <Wrapper>
          <Heading1>함께하는 날</Heading1>
          <Calendar />
        </Wrapper>
      </CalendarSection>
      <Wrapper>
        <Heading1>오시는 길</Heading1>
        <Location />
      </Wrapper>
      <ReceptionSection>
        <Wrapper>
          <ReceptionHeading text="태백 피로연 안내" />
          <Reception />
        </Wrapper>
      </ReceptionSection>
      <GuestbookSection>
        <Wrapper>
          <Heading1>신랑 신부에게</Heading1>
          <MessageImg src={messageImg} alt="" />
          <ErrorBoundary fallback={<GuestbookFallback>방명록을 잠시 불러올 수 없어요.</GuestbookFallback>}>
            <Guestbook />
          </ErrorBoundary>
        </Wrapper>
      </GuestbookSection>
      <FloatingBar isVisible={isVisible} />
    </Container>
  );
}

export default App;

const InvitationSection = styled.div`
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: 60px 0;
  box-sizing: border-box;
  background-image: url('/invitation.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;

  /* --invitation-dark: 스크롤 진행도(0~1). 0이면 흰 막, 1이면 어두운 막이 보입니다. */
  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &::before {
    background-color: rgba(0, 0, 0, 0.45);
    opacity: var(--invitation-dark, 1);
  }

  &::after {
    background-color: rgba(255, 255, 255, 0.75);
    opacity: calc(1 - var(--invitation-dark, 1));
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  && * {
    color: #fff;
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
  }
`;

const InvitationHeading = styled(HauntedText)`
  font-family: 'KotraGothic', sans-serif;
  font-size: 1.5rem;
  margin: 10px;
  white-space: pre-line;
  -webkit-text-stroke: 0.7px currentColor;
`;

const ReceptionHeading = styled(HauntedText)`
  font-family: 'KotraGothic', sans-serif;
  font-size: 1.5rem;
  margin: 10px;
  white-space: pre-line;
  -webkit-text-stroke: 0.7px currentColor;
`;

const AccountMessageBox = styled.div`
  width: 100%;
  margin: 8px 0 12px;
`;

const CalendarSection = styled.div`
  background-color: #fff;
`;

const ReceptionSection = styled.div`
  position: relative;
  min-height: max(100dvh, 800px);
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  background-color: #0b0b0d;
  background-image: url(${partyImg});
  background-size: cover;
  background-position: center bottom;
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.25);
    z-index: 0;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  && * {
    color: #fff;
  }
`;

const GuestbookSection = styled.div`
  background-color: #f5f0e5;
`;

const MessageImg = styled.img`
  width: 100%;
  max-width: 320px;
  margin-bottom: 12px;
`;

const GuestbookFallback = styled.p`
  text-align: center;
  padding: 20px 0;
`;
