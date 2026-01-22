import styled from "styled-components";
import { useMap } from "react-leaflet";

const Button = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;

  padding: 10px 14px;
  border-radius: 8px;
  border: none;

  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};

  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

  &:hover {
    opacity: 0.85;
  }
`;

export default function CenterMapButton({
  center,
}: {
  center: [number, number];
}) {
  const map = useMap();

  return (
    <Button onClick={() => map.setView(center, 8)}>
      Center map
    </Button>
  );
}
