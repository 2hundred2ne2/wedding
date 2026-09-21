import { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';

interface IProps {
  text: string;
  className?: string;
}

const CHAR_DELAY_MS = 30;
// 문단이 끝나고 다음 문단이 시작하기 전 쉬는 시간(틱 수)입니다. 30ms x 16 = 약 0.5초
const PARAGRAPH_PAUSE_TICKS = 16;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// 화면에 보이면 문단(빈 줄로 구분)별로 한 글자씩 타이핑되는 효과입니다.
// 아직 치지 않은 글자도 투명하게 자리를 차지해서, 타이핑 중에 아래 내용이 밀리지 않습니다.
const TypewriterText = ({ text, className }: IProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [tick, setTick] = useState(0);

  const paragraphs = useMemo(
    () => text.split('\n\n').map((paragraph) => paragraph.trim()).filter(Boolean),
    [text],
  );

  // 각 문단이 시작하는 틱과 전체 틱 수를 미리 계산합니다.
  const { starts, totalTicks } = useMemo(() => {
    const startTicks: number[] = [];
    let acc = 0;
    paragraphs.forEach((paragraph) => {
      startTicks.push(acc);
      acc += paragraph.length + PARAGRAPH_PAUSE_TICKS;
    });
    return { starts: startTicks, totalTicks: Math.max(acc - PARAGRAPH_PAUSE_TICKS, 0) };
  }, [paragraphs]);

  const done = tick >= totalTicks;

  // 화면에 어느 정도 들어오면 한 번만 시작합니다. (움직임 줄이기 설정이면 바로 전부 보여줍니다.)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStarted(true);
      setTick(totalTicks);
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const check = () => {
      const { top, bottom } = root.getBoundingClientRect();
      const vh = window.innerHeight;
      if (top < vh * 0.75 && bottom > vh * 0.25) {
        setStarted(true);
        window.removeEventListener('scroll', check);
        window.removeEventListener('resize', check);
      }
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [totalTicks]);

  useEffect(() => {
    if (!started || done) return;
    const timer = setInterval(() => {
      setTick((t) => Math.min(t + 1, totalTicks));
    }, CHAR_DELAY_MS);
    return () => clearInterval(timer);
  }, [started, done, totalTicks]);

  // 커서는 지금 치고 있는(또는 방금 끝난) 문단에만 보이고, 전체가 끝나면 사라집니다.
  let activeIndex = -1;
  if (started && !done) {
    starts.forEach((start, i) => {
      if (start <= tick) activeIndex = i;
    });
  }

  return (
    <Stack ref={rootRef} className={className} aria-label={text} role="text">
      {paragraphs.map((paragraph, i) => {
        const typed = clamp(tick - starts[i], 0, paragraph.length);
        return (
          <Paragraph
            key={i}
            aria-hidden="true"
            visible={started && tick >= starts[i]}
          >
            <Typed showCursor={i === activeIndex}>{paragraph.slice(0, typed)}</Typed>
            <Rest>{paragraph.slice(typed)}</Rest>
          </Paragraph>
        );
      })}
    </Stack>
  );
};

export default TypewriterText;

const Stack = styled.div`
  text-align: center;
`;

const Paragraph = styled.p<{ visible: boolean }>`
  margin: 0;
  /* 첫 문단이 아니면 위쪽 간격을 줍니다. (문단마다 스타일이 달라질 수 있어 & + & 는 쓰지 않습니다.) */
  &:not(:first-child) {
    margin-top: 18px;
  }

  white-space: pre-line;
  line-height: 1.75;
  letter-spacing: 0.2px;

  font-size: clamp(0.85rem, 4.1vw, 1rem);
  color: #222;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? '0' : '6px')});
  transition: opacity 0.9s ease, transform 0.9s ease;
`;

const Typed = styled.span<{ showCursor: boolean }>`
  /* 커서가 폭을 차지하면 줄 끝에서 글자가 밀리므로, 폭 0으로 겹쳐서 그립니다. */
  &::after {
    content: '▍';
    display: ${({ showCursor }) => (showCursor ? 'inline-block' : 'none')};
    width: 0;
    height: 0;
    /* 폰트에 없는 글자라 대체 글꼴이 쓰이는데, 그 글꼴의 줄 높이가 줄 전체를 키우지 않게 합니다. */
    line-height: 0;
    overflow: visible;
    margin-left: 2px;
    opacity: 0.85;
    animation: type-blink 900ms steps(1) infinite;
  }

  @keyframes type-blink {
    50% {
      opacity: 0;
    }
  }
`;

const Rest = styled.span`
  visibility: hidden;
`;
