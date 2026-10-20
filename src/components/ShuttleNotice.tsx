import styled from '@emotion/styled';
import data from 'data.json';
import Modal from './Modal.tsx';

interface IProps {
  onClose: () => void;
}

// locationInfo에서 "셔틀버스" 항목을 그대로 가져와 보여줍니다.
// (오시는 길의 셔틀버스 안내와 문구가 항상 같게 유지됩니다.)
const ShuttleNotice = ({ onClose }: IProps) => {
  const shuttle = data.locationInfo.find((info) => info.title === '셔틀버스');
  if (!shuttle) return null;

  return (
    <Modal title="🚌 셔틀버스 안내" onClose={onClose}>
      <Desc>{shuttle.desc}</Desc>
      <ConfirmButton type="button" onClick={onClose}>
        확인했어요
      </ConfirmButton>
    </Modal>
  );
};

export default ShuttleNotice;

const Desc = styled.p`
  margin: 0 0 20px;
  font-size: 0.95rem;
  line-height: 1.7;
  white-space: pre-line;
`;

const ConfirmButton = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  background-color: #1a243d;
  color: #fff;
  cursor: pointer;
`;
