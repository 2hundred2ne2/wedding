import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from '@emotion/styled';

interface IProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const WriteModal = ({ title, onClose, children }: IProps) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    // 팝업이 떠 있는 동안 뒤 화면이 스크롤되지 않도록 잠급니다.
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      root.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // 조상 요소의 스타일(글자색, 정렬 등)을 물려받지 않도록 body 바로 아래에 그립니다.
  return createPortal(
    <Overlay onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton type="button" aria-label="닫기" onClick={onClose}>
          ✕
        </CloseButton>
        <Title>{title}</Title>
        {children}
      </Dialog>
    </Overlay>,
    document.body,
  );
};

export default WriteModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  overscroll-behavior: contain;
`;

const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 380px;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 24px 20px 20px;
  border-radius: 12px;
  background-color: #fff;
  color: #222;
  text-align: left;
  font-family: 'KotraGothic', sans-serif;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #888;
  font-size: 1.1rem;
  line-height: 1;
  font-family: inherit;
  cursor: pointer;
`;

const Title = styled.p`
  margin: 0 0 16px;
  font-size: 1.1rem;
  text-align: center;
  -webkit-text-stroke: 0.6px currentColor;
`;
