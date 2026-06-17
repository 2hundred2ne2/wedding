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
        <BtnImg src="/accountbtn.png" alt="" />
        <BtnContent>
          <p>{title}</p>
          <span style={{ transform: isOpen ? 'rotate(180deg)' : undefined, transition: 'all 0.3s ease', display: 'flex' }}>
            <ExpandMore fill="#222" />
          </span>
        </BtnContent>
      </AccordionHeader>

      {isOpen && (
        <AccordionContent>
          <ContentBgImg src="/accountbackground.png" alt="" />
          <ContentInner>{children}</ContentInner>
        </AccordionContent>
      )}
    </AccordionWrapper>
  );
};

export default Accordion;

const AccordionWrapper = styled.div`
  font-family: HSSanTokki20-Regular, serif;
  font-size: 1rem;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

const AccordionHeader = styled.div<{ isActive: boolean }>`
  position: relative;
  cursor: pointer;
`;

const BtnImg = styled.img`
  width: 100%;
  display: block;
`;

const BtnContent = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 15px;
  & > p {
    color: #44484d;
    margin: 0;
    flex: 1;
    text-align: center;
    font-family: HSSanTokki20-Regular, serif;
  }
  & > span {
    position: absolute;
    right: 15px;
  }
`;

const AccordionContent = styled.div`
  position: relative;
  font-size: 14px;
`;

const ContentBgImg = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.2);
  width: 100%;
  height: 85%;
  object-fit: contain;
`;

const ContentInner = styled.div`
  position: relative;
  padding: 10px 20px 15px 10px;
  text-align: justify;
`;
