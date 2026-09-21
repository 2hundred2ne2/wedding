import { useState } from 'react';
import styled from '@emotion/styled';
import { ref, remove } from 'firebase/database';
import { getCommentFont } from './commentFont.ts';
import { hashPassword } from './hashPassword.ts';
import { MASTER_PASSWORD_HASH } from './masterPassword.ts';
import { realtimeDb } from '../../firebase.ts';

interface IProps {
  id: string;
  sender: string;
  message: string;
  date: string;
  passwordHash: string;
}

const CommentItem = ({ id, sender, message, date, passwordHash }: IProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setIsDeleting(false);
    setPin('');
    setError('');
  };

  const verifyPin = async () => {
    if (!/^\d{4,6}$/.test(pin)) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }
    const hash = await hashPassword(pin);
    if (hash !== passwordHash && hash !== MASTER_PASSWORD_HASH) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  };

  const handleDelete = async () => {
    if (!realtimeDb || isSubmitting) return;
    setIsSubmitting(true);
    const ok = await verifyPin();
    if (!ok) {
      setIsSubmitting(false);
      return;
    }
    try {
      await remove(ref(realtimeDb, `guestbook/${id}`));
    } catch {
      setError('삭제에 실패했어요. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const fontStyle = { fontFamily: getCommentFont(id) };

  return (
    <Wrapper>
      <CloseButton
        type="button"
        aria-label="메시지 삭제"
        onClick={() => (isDeleting ? reset() : setIsDeleting(true))}
      >
        ✕
      </CloseButton>

      <Header>
        <Sender style={fontStyle}>{sender}</Sender>
        <DateText>{date}</DateText>
      </Header>

      <Message style={fontStyle}>{message}</Message>

      {isDeleting && (
        <PinRow>
          <PinInput
            placeholder="비밀번호"
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          />
          <ActionButton type="button" disabled={isSubmitting} onClick={() => void handleDelete()}>
            삭제
          </ActionButton>
          <ActionButton type="button" onClick={reset}>
            취소
          </ActionButton>
        </PinRow>
      )}

      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

const Wrapper = styled.li`
  position: relative;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px 12px;
  background-color: #fafafa;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 8px;
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: #aaa;
  font-size: 0.95rem;
  line-height: 1;
  font-family: inherit;
  cursor: pointer;

  &:hover {
    color: #555;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  padding-right: 26px;
  gap: 8px;
`;

const Sender = styled.span`
  font-weight: 500;
  color: #1A243D;
`;

const DateText = styled.span`
  font-size: 0.75rem;
  font-weight: 200;
  color: #aaa;
`;

const Message = styled.p`
  margin: 0;
  font-weight: 300;
  line-height: 1.5;
  white-space: pre-line;
  word-break: break-word;
`;

const PinRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
`;

// iOS는 입력창 글자가 16px보다 작으면 포커스할 때 화면을 확대하므로 1rem으로 둡니다.
const PinInput = styled.input`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 1rem;
  outline: none;
  border: 1px solid #ccc;
  font-family: inherit;
  font-weight: 300;
`;

const ActionButton = styled.button`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid lightgray;
  background-color: white;
  font-family: inherit;
  color: inherit;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 0.75rem;
  color: #e0526d;
  text-align: right;
`;

export default CommentItem;
