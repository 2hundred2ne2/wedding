import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import images from './Images.ts';

const SLIDE_DURATION = 3000;

const Main = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <MainWrapper>
      {images.map((image, i) => (
        <SlideImg key={image.alt} src={image.source} alt="" visible={i === index} />
      ))}
      <Scrim />
      <NameOverlay>
        <Name>minseok</Name>
        <And>and</And>
        <Name>myeongji</Name>
      </NameOverlay>
      <Details>
        <span>November 1, 2026</span>
        <span>11 o'clock</span>
        <span>Amanti hotel, Seoul</span>
      </Details>
      <Dots>
        {images.map((image, i) => (
          <Dot key={image.alt} active={i === index} />
        ))}
      </Dots>
    </MainWrapper>
  );
};

export default Main;

const MainWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
`;

const SlideImg = styled.img<{ visible: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.8s ease-in-out;
`;

// 어떤 사진이 떠 있어도 이름 글씨가 항상 잘 보이도록 은은한 그라데이션을 얹습니다.
const Scrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.18) 0%,
    rgba(0, 0, 0, 0.02) 35%,
    rgba(0, 0, 0, 0.05) 60%,
    rgba(0, 0, 0, 0.32) 100%
  );
  z-index: 1;
`;

const NameOverlay = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(2px, 1.2vw, 8px);
  color: #fff;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
`;

const Name = styled.p`
  font-family: 'Noto Serif KR', serif;
  font-weight: 700;
  font-size: clamp(1.6rem, 7.5vw, 2.6rem);
  letter-spacing: 0.06em;
  margin: 0;
  line-height: 1.1;
`;

const And = styled.p`
  font-family: 'Noto Serif KR', serif;
  font-weight: 500;
  font-size: clamp(0.8rem, 2.6vw, 1.05rem);
  letter-spacing: 0.1em;
  margin: 0;
  opacity: 0.85;
`;

const Details = styled.div`
  position: absolute;
  top: 72%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #fff;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.4);
  font-family: 'Noto Serif KR', serif;
  font-size: clamp(0.7rem, 2.2vw, 0.85rem);
  letter-spacing: 0.15em;
  opacity: 0.85;
`;

const Dots = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  z-index: 3;
`;

const Dot = styled.span<{ active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? '#fff' : 'rgba(255, 255, 255, 0.5)')};
  transition: background-color 0.3s ease-in-out;
`;
