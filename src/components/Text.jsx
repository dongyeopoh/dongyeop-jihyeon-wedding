import styled from '@emotion/styled';

export const Heading1 = styled.p`
  font-family: Noto Sans KR, serif;
  font-size: 2.1rem;
  margin: 10px;
  font-weight: bold;
  color: #eeba82;
  white-space: pre-line;
`;

export const Heading2 = styled.p`
  font-size: 1rem;
  margin: 10px;
  white-space: pre-line;
`;

export const PointTitle = styled.p`
  font-family: Noto Sans KR, serif;
  line-height: 2;
  margin: 0;
  font-weight: 600;
  color: #7e96da;
  white-space: pre-line;
`;

export const Paragraph = styled.p`
  line-height: 2.2rem;
  white-space: pre-line;
`;

export const Caption = styled.p`
  font-weight: 200;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'start')};
  white-space: pre-line;
`;
