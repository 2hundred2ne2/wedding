import { ReactNode, useState } from 'react';
import styled from '@emotion/styled';
import ExpandMore from '@/assets/icons/expand_more.svg?react';

interface IAccordionProps {
  title: string;
  children: ReactNode;
}
const Accordion = ({ title, children }: IAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionWrapper>
      <AccordionHeader isActive={isOpen} onClick={toggleAccordion}>
        <p>{title}</p>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'all 0.3s ease', display: 'flex' }}>
          <ExpandMore fill="#44484d" />
        </span>
      </AccordionHeader>

      {isOpen && (
        <AccordionContent>
          <ContentInner>{children}</ContentInner>
        </AccordionContent>
      )}
    </AccordionWrapper>
  );
};

export default Accordion;

const AccordionWrapper = styled.div`
  font-family: 'SeochoBatang-Regular', serif;
  font-size: 1rem;
  margin-bottom: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const AccordionHeader = styled.div<{ isActive: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  cursor: pointer;
  background-color: rgba(207, 198, 175, 1);

  & > p {
    color: #44484d;
    margin: 0;
    flex: 1;
    text-align: center;
    font-family: 'SeochoBatang-Regular', serif;
    /* 서초바탕에는 굵은 글씨체가 없어 font-weight가 먹지 않으므로 글자 테두리로 굵게 보이게 합니다. */
    -webkit-text-stroke: 0.6px currentColor;
  }
  & > span {
    position: absolute;
    right: 16px;
  }
`;

const AccordionContent = styled.div`
  font-size: 14px;
  background-color: #fff;
`;

const ContentInner = styled.div`
  padding: 4px 20px 15px;
  text-align: justify;
`;
