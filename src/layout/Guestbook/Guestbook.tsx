import styled from '@emotion/styled';
import CommentForm from './CommentForm.tsx';
import CommentList from './CommentList.tsx';
import { Heading2 } from '@/components/Text.tsx';

const Guestbook = () => {
  return (
    <GuestBookWrapper>
      <Heading2>
        메시지를 남겨주세요.
        <br />
        평생 신랑 신부가 간직 할 수 있어요.
      </Heading2>
      <CommentForm />
      <CommentList />
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
