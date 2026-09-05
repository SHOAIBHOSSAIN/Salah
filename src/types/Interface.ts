export type CalculationMethod =
  | 'MWL' // Muslim World League
  | 'ISNA' // Islamic Society of North America
  | 'Egypt'
  | 'Makkah' // Umm al-Qura
  | 'Karachi'
  | 'Tehran'
  | 'Jafari';

// Aladhan API method IDs — see https://aladhan.com/prayer-times-api#GetTimingsByAddress
export const CALCULATION_METHOD_IDS: Record<CalculationMethod, number> = {
  MWL: 3,
  ISNA: 2,
  Egypt: 5,
  Makkah: 4,
  Karachi: 1,
  Tehran: 7,
  Jafari: 0,
};

export type Madhab = 'Shafi' | 'Hanafi'; // affects Asr calculation

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface DayPrayerTimes {
  date: string; // ISO date, e.g. "2026-09-04"
  timings: PrayerTimings;
}

export interface UserSettings {
  calculationMethod: CalculationMethod;
  madhab: Madhab;
  notificationsEnabled: boolean;
  reminderMinutesBefore: number; // e.g. 10
}

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export const PRAYER_NAMES: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
