import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { onValue, ref } from 'firebase/database';
import CommentItem from './CommentItem.tsx';
import { realtimeDb } from '../../firebase.ts';

interface Comment {
  id: string;
  sender: string;
  message: string;
  createdAt: number;
  date: string;
  passwordHash: string;
}

const CommentList = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (!realtimeDb) return;

    // guestbook 데이터가 바뀔 때마다 실시간으로 목록을 갱신합니다.
    const unsubscribe = onValue(ref(realtimeDb, 'guestbook'), (snapshot) => {
      const value = snapshot.val() as Record<
        string,
        Omit<Comment, 'id'>
      > | null;

      if (!value) {
        setComments([]);
        return;
      }

      const list = Object.entries(value)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

      setComments(list);
    });

    return () => unsubscribe();
  }, []);

  if (!realtimeDb) {
    return <EmptyText>방명록 기능이 아직 준비되지 않았어요. 🥲</EmptyText>;
  }

  if (comments.length === 0) {
    return <EmptyText>아직 남겨진 메시지가 없어요. 첫 메시지를 남겨주세요. 💌</EmptyText>;
  }

  return (
    <ListWrapper>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          sender={comment.sender}
          message={comment.message}
          date={comment.date}
          passwordHash={comment.passwordHash}
        />
      ))}
    </ListWrapper>
  );
};

const ListWrapper = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const EmptyText = styled.p`
  text-align: center;
  font-weight: 200;
  color: #aaa;
  margin: 16px 0 0;
`;

export default CommentList;
