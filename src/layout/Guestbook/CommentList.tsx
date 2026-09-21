import styled from '@emotion/styled';
import CommentItem from './CommentItem.tsx';
import { Comment } from './useComments.ts';
import { realtimeDb } from '../../firebase.ts';

export const PREVIEW_COUNT = 3;

interface IProps {
  comments: Comment[];
  showAll: boolean;
}

const CommentList = ({ comments, showAll }: IProps) => {
  if (!realtimeDb) {
    return <EmptyText>방명록 기능이 아직 준비되지 않았어요. 🥲</EmptyText>;
  }

  if (comments.length === 0) {
    return <EmptyText>아직 남겨진 메시지가 없어요. 첫 메시지를 남겨주세요. 💌</EmptyText>;
  }

  const visible = showAll ? comments : comments.slice(0, PREVIEW_COUNT);

  return (
    <ListWrapper>
      {visible.map((comment) => (
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
