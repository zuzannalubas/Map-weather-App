import { useState } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./styles/theme";
import GlobalStyles from "./styles/GlobalStyles";
import MapView from "./components/MapView";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <ThemeProvider theme={dark ? darkTheme : lightTheme}>
      <GlobalStyles />
      <button
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
        }}
        onClick={() => setDark((v) => !v)}
      >
        Toggle theme
      </button>
      <MapView />
    </ThemeProvider>
  );
}
