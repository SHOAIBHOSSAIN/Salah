import AsyncStorage from '@react-native-async-storage/async-storage';
import { DayPrayerTimes, UserSettings } from '../types/Interface';

const MONTH_CACHE_KEY_PREFIX = 'prayer_month_'; // + YYYY-MM
const SETTINGS_KEY = 'user_settings';

function monthKey(year: number, month: number): string {
  return `${MONTH_CACHE_KEY_PREFIX}${year}-${String(month).padStart(2, '0')}`;
}

export async function cacheMonthTimings(
  year: number,
  month: number,
  days: DayPrayerTimes[],
): Promise<void> {
  await AsyncStorage.setItem(monthKey(year, month), JSON.stringify(days));
}

export async function getCachedMonthTimings(
  year: number,
  month: number,
): Promise<DayPrayerTimes[] | null> {
  const raw = await AsyncStorage.getItem(monthKey(year, month));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DayPrayerTimes[];
  } catch {
    return null;
  }
}

export async function getCachedTodayTimings(
  year: number,
  month: number,
  isoDate: string,
): Promise<DayPrayerTimes | null> {
  const days = await getCachedMonthTimings(year, month);
  if (!days) return null;
  return days.find(d => d.date === isoDate) ?? null;
}

const DEFAULT_SETTINGS: UserSettings = {
  calculationMethod: 'MWL',
  madhab: 'Shafi',
  notificationsEnabled: true,
  reminderMinutesBefore: 10,
};

export async function getUserSettings(): Promise<UserSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
