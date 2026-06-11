import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { onValue, ref } from 'firebase/database';
import { realtimeDb } from '../../firebase.ts';

interface Comment {
  id: string;
  sender: string;
  message: string;
  createdAt: number;
  date: string;
}

const guestbookRef = ref(realtimeDb, 'guestbook');

const CommentList = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // guestbook 데이터가 바뀔 때마다 실시간으로 목록을 갱신합니다.
    const unsubscribe = onValue(guestbookRef, (snapshot) => {
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

  if (comments.length === 0) {
    return <EmptyText>아직 남겨진 메시지가 없어요. 첫 메시지를 남겨주세요. 💌</EmptyText>;
  }

  return (
    <ListWrapper>
      {comments.map((comment) => (
        <CommentItem key={comment.id}>
          <CommentHeader>
            <Sender>{comment.sender}</Sender>
            <DateText>{comment.date}</DateText>
          </CommentHeader>
          <Message>{comment.message}</Message>
        </CommentItem>
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

const CommentItem = styled.li`
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px 12px;
  background-color: #fafafa;
`;

const CommentHeader = styled.div`
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

const EmptyText = styled.p`
  text-align: center;
  font-weight: 200;
  color: #aaa;
  margin: 16px 0 0;
`;

export default CommentList;
