import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;

  padding: 16px 24px;
  border-radius: 8px;

  font-weight: bold;

  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
`;

export default function LoadingIndicator() {
  return <Container>Loading data...</Container>;
}
