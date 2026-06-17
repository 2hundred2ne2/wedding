import { ReactNode, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface BridgeProps {
  children?: ReactNode;
  minHeight?: string;
  className?: string;
}

const Bridge = ({ children, minHeight = '200px', className }: BridgeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        else setVisible(false);
      },
      { threshold: 0.1 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <BridgeWrapper minHeight={minHeight} className={className} ref={ref}>
      <AnimatedInner visible={visible}>{children}</AnimatedInner>
    </BridgeWrapper>
  );
};

export default Bridge;

const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const BridgeWrapper = styled.div<{ minHeight: string }>`
  width: 100%;
  min-height: ${({ minHeight }) => minHeight};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  box-sizing: border-box;
`;

const AnimatedInner = styled.div<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  opacity: ${({ visible }) => (visible ? undefined : 0)};
  animation: ${({ visible }) =>
    visible ? `${floatUp} 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards` : 'none'};
`;
