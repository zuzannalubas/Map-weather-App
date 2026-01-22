import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import GlobalStyles from "./styles/GlobalStyles";
import MapView from "./components/MapView";
import ToggleThemeButton from "./components/ToggleThemeButton";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <GlobalStyles />
      <ToggleThemeButton
        onClick={() => setDark((v) => !v)}
      />
      <MapView />
    </ThemeProvider>
  );
}
