import { useState } from 'react';
import styled from '@emotion/styled';
import { push, ref, serverTimestamp } from 'firebase/database';
import PopEffect from './PopEffect.tsx';
import { hashPassword } from './hashPassword.ts';
import { realtimeDb } from '../../firebase.ts';

const CommentForm = () => {
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [showPop, setShowPop] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !message) {
      alert('이름과 메시지를 채워주세요. 🥹');
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      alert('수정/삭제에 사용할 비밀번호 4자리 숫자를 입력해주세요. 🥹');
      return;
    }

    if (!realtimeDb) {
      alert('방명록 기능이 아직 준비되지 않았어요. 🥲');
      return;
    }

    const passwordHash = await hashPassword(pin);

    const guestbookMessage = {
      sender: name,
      message: message,
      passwordHash,
      createdAt: serverTimestamp(),
      date: new Date().toLocaleString(),
    };

    // 메시지에 "축하"가 들어있으면 등록 성공 후 폭죽 애니메이션을 띄웁니다.
    const hasCelebration = message.includes('축하');

    void push(ref(realtimeDb, 'guestbook'), guestbookMessage)
      .then(() => {
        alert('메시지를 보냈습니다. 💌');
        setName('');
        setMessage('');
        setPin('');
        if (hasCelebration) {
          setShowPop(true);
        }
      })
      .catch(() => {
        alert('메시지 전송에 실패했어요. 잠시 후 다시 시도해주세요. 🥹');
      });
  };

  return (
    <FormWrapper onSubmit={handleSubmit}>
      <NameInput
        placeholder="이름"
        type="text"
        value={name}
        maxLength={20}
        onChange={(e) => setName(e.target.value)}
      />
      <MessageInput
        placeholder="메시지"
        value={message}
        maxLength={300}
        onChange={(e) => setMessage(e.target.value)}
      />
      <PinInput
        placeholder="비밀번호 4자리 (수정·삭제 시 필요해요)"
        type="password"
        inputMode="numeric"
        pattern="\d{4}"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
      />
      <SubmitButton type="submit">등록</SubmitButton>
      {showPop && <PopEffect onDone={() => setShowPop(false)} />}
    </FormWrapper>
  );
};

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: visible;
  align-items: center;
`;

const NameInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  font-size: 1rem;
  line-height: 1;
  outline: none;
  border: 1px solid #ccc;
  font-family: inherit;
  font-weight: 300;
`;

const MessageInput = styled.textarea`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  font-size: 1rem;
  line-height: 1.5;
  outline: none;
  border: 1px solid #ccc;
  resize: none;
  font-family: inherit;
  font-weight: 300;
`;

const PinInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px;
  font-size: 0.85rem;
  line-height: 1;
  outline: none;
  border: 1px solid #ccc;
  font-family: inherit;
  font-weight: 300;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid lightgray;
  background-color: white;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
`;
export default CommentForm;
