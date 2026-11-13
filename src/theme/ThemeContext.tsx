import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/color';
import type { AppColors } from '../constants/color';
import { ARABIC_FONT_SIZE } from '../constants/fonts';
export type { AppColors } from '../constants/color';

type ThemeContextValue = {
  isDark: boolean;
  colors: AppColors;
  arabicFontSize: number;
  setDarkMode: (enabled: boolean) => void;
  setArabicFontSize: (size: number) => void;
};

const DARK_MODE_KEY = 'settings.darkMode';
const ARABIC_FONT_SIZE_KEY = 'settings.arabicFontSize';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: React.PropsWithChildren): React.JSX.Element {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');
  const [arabicFontSize, setArabicFontSizeState] = useState(ARABIC_FONT_SIZE.default);

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

  useEffect(() => {
    let isActive = true;

    AsyncStorage.getItem(ARABIC_FONT_SIZE_KEY)
      .then(value => {
        const storedSize = Number(value);
        if (isActive && value !== null && Number.isFinite(storedSize)) {
          setArabicFontSizeState(
            Math.min(Math.max(storedSize, ARABIC_FONT_SIZE.min), ARABIC_FONT_SIZE.max),
          );
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

  const setArabicFontSize = useCallback((size: number) => {
    const boundedSize = Math.round(
      Math.min(Math.max(size, ARABIC_FONT_SIZE.min), ARABIC_FONT_SIZE.max),
    );
    setArabicFontSizeState(boundedSize);
    AsyncStorage.setItem(ARABIC_FONT_SIZE_KEY, String(boundedSize)).catch(() => undefined);
  }, []);

  const value = useMemo(
    () => ({
      isDark,
      colors: isDark ? DARK_COLORS : LIGHT_COLORS,
      arabicFontSize,
      setDarkMode,
      setArabicFontSize,
    }),
    [arabicFontSize, isDark, setArabicFontSize, setDarkMode],
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