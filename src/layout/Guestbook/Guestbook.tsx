import { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import JSConfetti from 'js-confetti';
import CommentForm from './CommentForm.tsx';
import CommentList, { PREVIEW_COUNT } from './CommentList.tsx';
import WriteModal from './WriteModal.tsx';
import { useComments } from './useComments.ts';
import { Heading2 } from '@/components/Text.tsx';

const CONFETTI_DURATION_MS = 5000;
const CONFETTI_INTERVAL_MS = 700;
const CONFETTI_COLORS = [
  'DodgerBlue',
  'OliveDrab',
  'Gold',
  'pink',
  'SlateBlue',
  'lightblue',
  'Violet',
  'PaleGreen',
  'SteelBlue',
  'SandyBrown',
  'Chocolate',
  'Crimson',
];

const Guestbook = () => {
  const comments = useComments();
  const [showAll, setShowAll] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const closeWriting = useCallback(() => setIsWriting(false), []);

  const jsConfettiRef = useRef<JSConfetti | null>(null);
  const confettiIntervalRef = useRef<number | null>(null);

  // 방명록 작성 완료 후 5초 동안 색종이가 계속 떨어지는 효과를 재생합니다.
  const dropConfetti = useCallback(() => {
    if (confettiIntervalRef.current) return;
    if (!jsConfettiRef.current) {
      jsConfettiRef.current = new JSConfetti();
    }
    const confetti = jsConfettiRef.current;

    void confetti.addConfetti({ confettiColors: CONFETTI_COLORS });
    confettiIntervalRef.current = window.setInterval(() => {
      void confetti.addConfetti({ confettiColors: CONFETTI_COLORS });
    }, CONFETTI_INTERVAL_MS);

    window.setTimeout(() => {
      if (confettiIntervalRef.current) {
        clearInterval(confettiIntervalRef.current);
        confettiIntervalRef.current = null;
      }
    }, CONFETTI_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (confettiIntervalRef.current) clearInterval(confettiIntervalRef.current);
    },
    [],
  );

  const handleSubmitted = () => {
    setIsWriting(false);
    dropConfetti();
  };

  // 미리보기 개수(3개)를 넘을 때만 전체보기 버튼이 필요합니다.
  const hasMore = comments.length > PREVIEW_COUNT;

  return (
    <GuestBookWrapper>
      <Heading2>
        메시지를 남겨주세요.
        <br />
        평생 신랑 신부가 간직 할 수 있어요.
      </Heading2>

      <ButtonRow>
        {hasMore && (
          <ActionButton type="button" onClick={() => setShowAll((v) => !v)}>
            {showAll ? '접기' : '전체보기'}
          </ActionButton>
        )}
        <ActionButton type="button" onClick={() => setIsWriting(true)}>
          작성
        </ActionButton>
      </ButtonRow>

      <CommentList comments={comments} showAll={showAll} />

      {isWriting && (
        <WriteModal title="메시지 남기기" onClose={closeWriting}>
          <CommentForm onSubmitted={handleSubmitted} />
        </WriteModal>
      )}
    </GuestBookWrapper>
  );
};

export default Guestbook;

const GuestBookWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 50px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  min-width: 84px;
  padding: 6px 16px;
  border: none;
  border-radius: 999px;
  font-size: 0.85rem;
  line-height: 1.4;
  font-family: inherit;
  cursor: pointer;
  background-color: #cfc6af;
  color: #1a243d;
`;
