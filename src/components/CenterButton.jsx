import styled from "styled-components";

/*
  Custom styled-component (min. 3 lines of CSS)
  REQUIRED by assignment
*/
const Button = styled.button`
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 1000;

  padding: 8px 12px;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.text};
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.85;
  }
`;

export default function CenterButton({ map, center }) {
  if (!map) return null;

  const handleClick = () => {
    map.setView(center, map.getZoom());
  };

  return <Button onClick={handleClick}>Center map</Button>;
}
