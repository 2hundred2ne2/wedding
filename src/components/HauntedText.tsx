import { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';

interface HauntedTextProps {
  text: string;
  className?: string;
  inline?: boolean;
}

const HauntedText = ({ text, className, inline = false }: HauntedTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setAnimKey((k) => k + 1);
          setVisible(true);
        } else if (!entry.isIntersecting) {
          setAnimKey((k) => k + 1);
          setVisible(false);
        }
      },
      { threshold: [0, 0.5] }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const charData = useMemo(
    () =>
      text.split('').map((char) => ({
        char,
        duration: Math.floor(Math.random() * 500) + 1500,
        delay: Math.floor(Math.random() * 500),
      })),
    [text]
  );

  const content = charData.map(({ char, duration, delay }, i) => {
    if (char === '\n') return <br key={`${animKey}-br-${i}`} />;
    return (
      <Char
        key={`${animKey}-${i}`}
        style={{
          animationDuration: `${duration}ms`,
          animationDelay: `${delay}ms`,
          animationPlayState: visible ? 'running' : 'paused',
        }}
      >
        {char === ' ' ? ' ' : char}
      </Char>
    );
  });

  if (inline) {
    return (
      <InlineWrapper ref={ref as React.Ref<HTMLSpanElement>} className={className}>
        {content}
      </InlineWrapper>
    );
  }

  return (
    <BlockWrapper ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {content}
    </BlockWrapper>
  );
};

export default HauntedText;

const BlockWrapper = styled.div`
  line-height: 2.2rem;
  text-align: center;
`;

const InlineWrapper = styled.span`
  display: inline;
`;

const Char = styled.span`
  display: inline-block;
  opacity: 0;
  filter: blur(8px);
  animation-name: haunt;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);

  @keyframes haunt {
    from {
      opacity: 0;
      filter: blur(8px);
    }
    to {
      opacity: 1;
      filter: blur(0);
    }
  }
`;
