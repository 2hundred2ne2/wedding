import { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import HauntedText from '@/components/HauntedText.tsx';
import { Heading1 } from '@/components/Text.tsx';
import Wrapper from '@/components/Wrapper.tsx';
import Account from '@/layout/Account/Account.tsx';
import Calendar from '@/layout/Calendar/Calendar.tsx';
import Container from '@/layout/Container.tsx';
import FloatingBar from '@/layout/FloatingBar/FloatingBar.tsx';
import GalleryWrap from '@/layout/Gallery/GalleryWrap.tsx';
import Guestbook from '@/layout/Guestbook/Guestbook.tsx';
import IntroScreen from '@/layout/IntroScreen/IntroScreen.tsx';
import Invitation from '@/layout/Invitation/Invitation.tsx';
import Location from '@/layout/Location/Location.tsx';
import Bridge from '@/layout/Bridge/Bridge.tsx';
import Main from '@/layout/Main/Main.tsx';

function App() {
  const [introDone, setIntroDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const galleryRef = useRef(null);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
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
    <>
      {!introDone && <IntroScreen onComplete={handleIntroComplete} />}
    <Container>
      <Main />
      <Bridge>
        <RibbonImg src="/bridgeribon.png" alt="" />
      </Bridge>
      <InvitationSection>
        <Wrapper>
          <InvitationHeading text="모시는 글" />
          <Invitation />
        </Wrapper>
      </InvitationSection>
      <Wrapper ref={galleryRef}>
        <Heading1>Gallery</Heading1>
        <GalleryWrap />
      </Wrapper>
      <Wrapper>
        <Heading1>마음 전하실 곳</Heading1>
        <Account />
      </Wrapper>
      <Wrapper>
        <Heading1>함께하는 날</Heading1>
        <Calendar />
      </Wrapper>
      <Wrapper>
        <Heading1>오시는 길</Heading1>
        <Location />
      </Wrapper>
      <GuestbookSection>
        <Wrapper>
          <Heading1>신랑 신부에게</Heading1>
          <Guestbook />
        </Wrapper>
      </GuestbookSection>
      <FloatingBar isVisible={isVisible} />
    </Container>
    </>
  );
}

export default App;


const RibbonImg = styled.img`
  width: clamp(120px, 40%, 220px);
  height: auto;
`;

const InvitationSection = styled.div`
  position: relative;
  padding-top: 60px;
  background-image: url('/invitation.jpg');
  background-size: cover;
  background-position: center;
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-color: rgba(255, 255, 255, 0.6);
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

const InvitationHeading = styled(HauntedText)`
  font-family: HSSanTokki20-Regular, serif;
  font-size: 1.5rem;
  margin: 10px;
  white-space: pre-line;
`;

const GuestbookSection = styled.div`
  background-color: #7C8B6A;
  color: #fff;
`;
