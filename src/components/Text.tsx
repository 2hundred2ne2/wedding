import styled from '@emotion/styled';

export const Heading1 = styled.p`
  font-family: 'SeochoBatang-Regular', serif;
  font-size: 1.5rem;
  margin: 10px;
  color: #031F6D;
  white-space: pre-line;
  /* 서초바탕에는 굵은 글씨체가 없어 font-weight가 먹지 않으므로 글자 테두리로 굵게 보이게 합니다. */
  -webkit-text-stroke: 0.7px currentColor;
`;

export const Heading2 = styled.p`
  font-size: 1rem;
  margin: 10px;
  white-space: pre-line;
`;

export const PointTitle = styled.p`
  font-family: 'SeochoBatang-Regular', serif;
  line-height: 1;
  margin: 0;
  color: #1A243D;
  white-space: pre-line;
`;

export const Paragraph = styled.p`
  line-height: 2.2rem;
  white-space: pre-line;
`;

export const Caption = styled.p<{ textAlign?: string }>`
  font-weight: 200;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'start')};
  white-space: pre-line;
`;
