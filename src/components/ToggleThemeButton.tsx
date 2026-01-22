import styled from "styled-components";

const Button = styled.button`
  position: absolute;
  top: 20px;
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

export default function ToggleThemeButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return <Button onClick={onClick}>Toggle theme</Button>;
}
