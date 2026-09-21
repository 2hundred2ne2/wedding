import { Fragment, useEffect, useMemo, useRef } from 'react';
import styled from '@emotion/styled';

interface IProps {
  text: string;
  className?: string;
}

// 스크롤하면 단어가 앞에서부터 하나씩 색으로 채워지는 효과입니다.
// 문구가 화면 아래 80% 지점에 들어오면 채워지기 시작해서, 문구 아랫줄이 화면 45% 지점에 닿으면 모두 채워집니다.
const START_AT = 0.8;
const END_AT = 0.45;

const ScrollFillText = ({ text, className }: IProps) => {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // 줄바꿈(\n)은 그대로 살리고, 각 줄을 공백 기준 단어로 나눕니다.
  const lines = useMemo(
    () => text.split('\n').map((line) => line.split(' ').filter(Boolean)),
    [text],
  );
  const total = lines.reduce((sum, line) => sum + line.length, 0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || total === 0) return;

    const setFill = (progress: number) => {
      wordRefs.current.forEach((word, index) => {
        if (!word) return;
        const start = index / total;
        const end = (index + 1) / total;
        const value = Math.min(Math.max((progress - start) / (end - start), 0), 1);
        word.style.backgroundPosition = `${100 - value * 100}% 0`;
      });
    };

    // 움직임을 줄이도록 설정한 기기에서는 처음부터 모두 채워서 보여줍니다.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFill(1);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh * START_AT - top) / (vh * (START_AT - END_AT) + height);
      setFill(Math.min(Math.max(progress, 0), 1));
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
  }, [total]);

  let index = 0;
  return (
    <Paragraph ref={rootRef} className={className}>
      {lines.map((words, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {words.map((word) => {
            const i = index++;
            return (
              <Word
                key={i}
                ref={(node) => {
                  wordRefs.current[i] = node;
                }}
              >
                {word}
              </Word>
            );
          })}
        </Fragment>
      ))}
    </Paragraph>
  );
};

export default ScrollFillText;

const Paragraph = styled.p`
  margin: 0;
  text-align: center;
  line-height: 1.9;
  font-size: clamp(0.95rem, 4.6vw, 1.15rem);
`;

const Word = styled.span`
  display: inline-block;
  margin: 0 0.15em;

  background: linear-gradient(90deg, #f1a163 0%, #f65c3b 50%, #d4d4d8 50%, #d4d4d8 100%);
  background-size: 200% 100%;
  background-position: 100% 0;

  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;

  transition: background-position 0.12s linear;
`;
