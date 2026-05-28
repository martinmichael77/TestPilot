import { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeModeContext = createContext({
  mode: 'light',
  toggleMode: () => {},
});

export function ThemeModeProvider({ children }) {
  const mode = 'dark';
  const toggleMode = () => {};
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#0f766e',
          },
          secondary: {
            main: '#0ea5e9',
          },
          success: {
            main: '#16a34a',
          },
          error: {
            main: '#dc2626',
          },
          background: {
            default: '#111827',
            paper: '#1f2937',
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: 'Poppins, Segoe UI, sans-serif',
        },
      }),
    []
  );
  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
