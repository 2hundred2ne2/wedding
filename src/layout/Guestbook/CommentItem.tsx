import { useState } from 'react';
import styled from '@emotion/styled';
import { ref, remove, update } from 'firebase/database';
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

type Mode = 'view' | 'delete' | 'edit';

const CommentItem = ({ id, sender, message, date, passwordHash }: IProps) => {
  const [mode, setMode] = useState<Mode>('view');
  const [pin, setPin] = useState('');
  const [editText, setEditText] = useState(message);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setMode('view');
    setPin('');
    setEditText(message);
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

  const handleEditSave = async () => {
    if (!realtimeDb || isSubmitting) return;
    if (!editText.trim()) {
      setError('메시지를 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    const ok = await verifyPin();
    if (!ok) {
      setIsSubmitting(false);
      return;
    }
    try {
      await update(ref(realtimeDb, `guestbook/${id}`), { message: editText.trim() });
      reset();
    } catch {
      setError('수정에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Sender>{sender}</Sender>
        <DateText>{date}</DateText>
      </Header>

      {mode === 'edit' ? (
        <EditTextarea
          value={editText}
          maxLength={300}
          onChange={(e) => setEditText(e.target.value)}
        />
      ) : (
        <Message>{message}</Message>
      )}

      {mode === 'view' && (
        <ActionRow>
          <ActionButton type="button" onClick={() => setMode('edit')}>
            수정
          </ActionButton>
          <ActionButton type="button" onClick={() => setMode('delete')}>
            삭제
          </ActionButton>
        </ActionRow>
      )}

      {(mode === 'edit' || mode === 'delete') && (
        <PinRow>
          <PinInput
            placeholder="비밀번호"
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          />
          {mode === 'edit' ? (
            <ActionButton type="button" disabled={isSubmitting} onClick={() => void handleEditSave()}>
              저장
            </ActionButton>
          ) : (
            <ActionButton type="button" disabled={isSubmitting} onClick={() => void handleDelete()}>
              확인
            </ActionButton>
          )}
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
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px 12px;
  background-color: #fafafa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  gap: 8px;
`;

const Sender = styled.span`
  font-weight: 500;
  color: #e88ca6;
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

const EditTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  min-height: 60px;
  border-radius: 4px;
  padding: 4px;
  font-size: 0.95rem;
  line-height: 1.5;
  outline: none;
  border: 1px solid #ccc;
  resize: vertical;
  font-family: inherit;
  font-weight: 300;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
`;

const PinRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
`;

const PinInput = styled.input`
  flex: 1;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  font-size: 0.85rem;
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
