import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import data from 'data.json';

const SWAY_DURATION = 3000;

const Main = () => {
  const { greeting } = data;
  const [showGirl2, setShowGirl2] = useState(false);

  useEffect(() => {
    const cycle = () => {
      const t1 = setTimeout(() => setShowGirl2(true), 750);
      const t2 = setTimeout(() => setShowGirl2(false), 2250);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    };

    const clear = cycle();
    const interval = setInterval(cycle, SWAY_DURATION);
    return () => { clear?.(); clearInterval(interval); };
  }, []);

  return (
    <MainWrapper>
      <MainTitle>{greeting.title}</MainTitle>
      <SubTitle>{greeting.eventDetail}</SubTitle>
      <CharacterRow>
        <BoyImg src="/boy.png" alt="" />
        <GirlContainer>
          <GirlImg src="/girl.png" alt="" visible={!showGirl2} />
          <GirlImg src="/girl2.png" alt="" visible={showGirl2} />
        </GirlContainer>
      </CharacterRow>
      <BottomDecor src="/mainbackground-bottom.png" alt="" />
    </MainWrapper>
  );
};

export default Main;

const sway = keyframes`
  0%   { transform: translateX(-20px); }
  50%  { transform: translateX(20px); }
  100% { transform: translateX(-20px); }
`;

const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0 40px;
  background-image: url('/mainbackground.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const CharacterRow = styled.div`
  position: absolute;
  bottom: clamp(60px, 10vw, 120px);
  left: 0;
  right: 0;
  height: clamp(260px, 70vw, 400px);
`;

const BoyImg = styled.img`
  position: absolute;
  bottom: 25%;
  left: 2%;
  width: 90%;
  max-width: 420px;
  height: auto;
  animation: ${sway} ${SWAY_DURATION}ms ease-in-out infinite;
  z-index: 2;
`;

const GirlContainer = styled.div`
  position: absolute;
  bottom: 25%;
  right: 2%;
  width: 48%;
  max-width: 420px;
  height: 100%;
  z-index: 1;
`;

const GirlImg = styled.img<{ visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.8s ease-in-out;
`;

const BottomDecor = styled.img`
  position: absolute;
  bottom: 0;
  left: 0;
  width: clamp(280px, 100vw, 560px);
  height: auto;
  z-index: 10;
  pointer-events: none;
`;

const MainTitle = styled.p`
  font-family: 'Nanum Pen Script', cursive;
  font-size: clamp(2.5rem, 9vw, 3.8rem);
  color: #7C8B6A;
  line-height: 120%;
  white-space: pre-line;
  margin: 0;
  margin-top: clamp(-350px, -80vw, -200px);
  margin-left: clamp(20px, 25vw, 120px);
  margin-bottom: clamp(10px, 3vw, 20px);
`;

const SubTitle = styled.p`
  font-size: clamp(1.1rem, 4vw, 1.5rem);
  color: #7C8B6A;
  line-height: 140%;
  white-space: pre-line;
  margin: 0;
  margin-left: clamp(20px, 25vw, 120px);
`;
