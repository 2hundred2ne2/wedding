import { useMemo } from 'react';
import './WavyText.css';

interface WavyTextProps {
  text?: string;
  waveCount?: number;
  amplitude?: number;
  maxAngle?: number;
  duration?: number;
  phaseStep?: number;
  from?: 'right' | 'left';
}

export default function WavyText({
  text = 'make happiness the priority',
  waveCount = 0.8,
  amplitude = 14,
  maxAngle = 6,
  duration = 6,
  phaseStep = 0.01,
  from = 'right',
}: WavyTextProps) {
  const letters = useMemo(() => text.split(''), [text]);
  const n = letters.length;
  const enter = from === 'left' ? '-110vw' : '110vw';
  const exit = from === 'left' ? '150vw' : '-150vw';

  return (
    <div className="wavy-stage">
      {letters.map((ch, i) => {
        const t = n > 1 ? i / (n - 1) : 0;
        const phase = t * Math.PI * 2 * waveCount;
        const translateY = amplitude * Math.sin(phase);
        const rotate = -maxAngle * Math.cos(phase);
        return (
          <span
            key={i}
            className="wavy-letter"
            style={{ transform: `translateY(${translateY}px) rotate(${rotate}deg)` }}
          >
            <span
              className="wavy-letter-inner"
              style={{
                animationDuration: `${duration}s`,
                animationDelay: `${i * phaseStep}s`,
                ['--enter' as string]: enter,
                ['--exit' as string]: exit,
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          </span>
        );
      })}
    </div>
  );
}
