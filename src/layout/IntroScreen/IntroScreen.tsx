import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import WavyText from '@/components/WavyText.tsx';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen = ({ onComplete }: IntroScreenProps) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const holdTimer = setTimeout(() => setLeaving(true), 3000);
    const doneTimer = setTimeout(() => onComplete(), 3900);
    return () => {
      clearTimeout(holdTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <Overlay leaving={leaving}>
      <WavyText text="make happiness the priority" from="left" />
    </Overlay>
  );
};

export default IntroScreen;

const Overlay = styled.div<{ leaving: boolean }>`
    position: fixed;
    inset: 0;
    z-index: 9999;
    background-image: url('/starbackground.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: ${({ leaving }) => (leaving ? 'translateY(-100%)' : 'translateY(0)')};
    transition: transform 0.9s cubic-bezier(0.76, 0, 0.24, 1);

    .wavy-stage {
        font-size: clamp(22px, 7vw, 40px);
        height: 120px;
    }
`;
