import { useState } from 'react';
import styled from '@emotion/styled';
import { push, ref, serverTimestamp } from 'firebase/database';
import { hashPassword } from './hashPassword.ts';
import { realtimeDb } from '../../firebase.ts';

interface IProps {
  // 등록에 성공하면 호출됩니다.
  onSubmitted: () => void;
}

const CommentForm = ({ onSubmitted }: IProps) => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!name.trim() || !message.trim()) {
      alert('이름과 메시지를 채워주세요. 🥹');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      alert('삭제에 사용할 비밀번호 4자리 숫자를 입력해주세요. 🥹');
      return;
    }

    if (!realtimeDb) {
      alert('방명록 기능이 아직 준비되지 않았어요. 🥲');
      return;
    }

    setIsSubmitting(true);
    const passwordHash = await hashPassword(pin);

    const guestbookMessage = {
      sender: name.trim(),
      message: message.trim(),
      passwordHash,
      createdAt: serverTimestamp(),
      date: new Date().toLocaleString(),
    };

    push(ref(realtimeDb, 'guestbook'), guestbookMessage)
      .then(() => {
        alert('메시지를 보냈습니다. 💌');
        onSubmitted();
      })
      .catch(() => {
        alert('메시지 전송에 실패했어요. 잠시 후 다시 시도해주세요. 🥹');
        setIsSubmitting(false);
      });
  };

  return (
    <FormWrapper onSubmit={(e) => void handleSubmit(e)}>
      <NameInput
        placeholder="이름"
        type="text"
        value={name}
        maxLength={20}
        autoFocus
        onChange={(e) => setName(e.target.value)}
      />
      <MessageInput
        placeholder="메시지"
        value={message}
        maxLength={300}
        onChange={(e) => setMessage(e.target.value)}
      />
      <PinInput
        placeholder="비밀번호 4자리 (삭제할 때 필요해요)"
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
      />
      <SubmitButton type="submit" disabled={isSubmitting}>
        등록
      </SubmitButton>
    </FormWrapper>
  );
};

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// iOS는 입력창 글자가 16px보다 작으면 포커스할 때 화면을 확대하므로 모두 1rem 이상으로 둡니다.
const inputBase = `
  width: 100%;
  box-sizing: border-box;
  border-radius: 6px;
  padding: 10px;
  font-size: 1rem;
  outline: none;
  border: 1px solid #ccc;
  font-family: inherit;
  font-weight: 300;
  color: #222;
  background-color: #fff;

  &:focus {
    border-color: #999;
  }
`;

const NameInput = styled.input`
  ${inputBase}
  line-height: 1.2;
`;

const MessageInput = styled.textarea`
  ${inputBase}
  height: 200px;
  line-height: 1.6;
  resize: none;
`;

const PinInput = styled.input`
  ${inputBase}
  line-height: 1.2;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  font-size: 1rem;
  line-height: 1.5;
  border: none;
  background-color: #1A243D;
  font-family: inherit;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default CommentForm;
