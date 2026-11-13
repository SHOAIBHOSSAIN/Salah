import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type AppColors = {
  background: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  border: string;
};

type ThemeContextValue = {
  isDark: boolean;
  colors: AppColors;
  setDarkMode: (enabled: boolean) => void;
};

const LIGHT_COLORS: AppColors = {
  background: '#F5F8F7',
  surface: '#FFFFFF',
  surfaceRaised: '#EAF4F1',
  text: '#12312E',
  textSecondary: '#263B38',
  textMuted: '#71807D',
  accent: '#0F766E',
  accentSoft: '#DCEFEA',
  border: '#E1EAE7',
};

const DARK_COLORS: AppColors = {
  background: '#111A17',
  surface: '#1C2823',
  surfaceRaised: '#263630',
  text: '#EAF3EF',
  textSecondary: '#D4E1DC',
  textMuted: '#9AADA6',
  accent: '#72D2BE',
  accentSoft: '#29483F',
  border: '#354740',
};

const DARK_MODE_KEY = 'settings.darkMode';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(DARK_MODE_KEY)
      .then(value => {
        if (isActive && value !== null) {
          setIsDark(value === 'true');
        }
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  const setDarkMode = useCallback((enabled: boolean) => {
    setIsDark(enabled);
    AsyncStorage.setItem(DARK_MODE_KEY, String(enabled)).catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
      setDarkMode,
    }),
    [isDark, setDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return context;
}