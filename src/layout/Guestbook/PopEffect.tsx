import { useEffect, useMemo } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import popImg from '@/assets/icons/pop.png?url';

const POP_COUNT = 8;
const DURATION_MS = 2800;

interface PopEffectProps {
  onDone: () => void;
}

const PopEffect = ({ onDone }: PopEffectProps) => {
  // 폭죽들의 위치/크기/시작 시점을 랜덤하게 한 번만 생성합니다.
  const pops = useMemo(
    () =>
      Array.from({ length: POP_COUNT }, () => ({
        left: Math.random() * 70 + 15, // 15% ~ 85%
        top: Math.random() * 50 + 15, // 15% ~ 65%
        size: Math.random() * 40 + 50, // 50px ~ 90px
        delay: Math.random() * 0.8,
      })),
    [],
  );

  useEffect(() => {
    const timer = setTimeout(onDone, DURATION_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <Overlay>
      {pops.map((pop, i) => (
        <Pop
          key={i}
          src={popImg}
          alt=""
          style={{
            left: `${pop.left}%`,
            top: `${pop.top}%`,
            width: `${pop.size}px`,
            animationDelay: `${pop.delay}s`,
          }}
        />
      ))}
    </Overlay>
  );
};

export default PopEffect;

const popBurst = keyframes`
  0% { opacity: 0; transform: scale(0.2); }
  25% { opacity: 1; transform: scale(1.25); }
  60% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.1) translateY(-12px); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1000;
`;

const Pop = styled.img`
  position: absolute;
  opacity: 0;
  animation: ${popBurst} 1.6s ease-out forwards;
`;
