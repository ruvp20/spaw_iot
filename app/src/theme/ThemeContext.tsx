import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemePalette, darkPalette, lightPalette } from './colors';

interface ThemeContextType {
  theme: ThemePalette;
  mode: 'dark' | 'light';
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: 'dark' | 'light') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY_THEME = '@spaw_theme_mode';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY_THEME);
        if (saved === 'light' || saved === 'dark') {
          setMode(saved);
        }
      } catch (e) {
        console.warn('Failed to read theme preference', e);
      }
    })();
  }, []);

  const setThemeMode = async (newMode: 'dark' | 'light') => {
    setMode(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_THEME, newMode);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
  };

  const theme = mode === 'dark' ? darkPalette : lightPalette;
  const isDark = mode === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: darkPalette,
      mode: 'dark',
      isDark: true,
      toggleTheme: () => {},
      setThemeMode: () => {},
    };
  }
  return context;
};
