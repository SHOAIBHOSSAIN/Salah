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

export const COLORS = {
  white: '#FFFFFF',
  inactive: '#F4F4F4',
  danger: '#C0392B',
  brand: '#0F766E',
  brandTextMuted: '#BDE5DE',
  brandTextSecondary: '#D7EEEA',
  brandOverlay: 'rgba(255,255,255,0.16)',
  brandOverlaySoft: 'rgba(255,255,255,0.2)',
} as const;

export const LIGHT_COLORS: AppColors = {
  background: '#F5F8F7',
  surface: COLORS.white,
  surfaceRaised: '#EAF4F1',
  text: '#12312E',
  textSecondary: '#263B38',
  textMuted: '#71807D',
  accent: COLORS.brand,
  accentSoft: '#DCEFEA',
  border: '#E1EAE7',
};

export const DARK_COLORS: AppColors = {
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