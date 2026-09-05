import { useCallback, useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';
import { fetchMonthTimings } from '../services/prayerTimesApi';
import {
  cacheMonthTimings,
  getCachedMonthTimings,
  getCachedTodayTimings,
  getUserSettings,
} from '../services/prayerCache';
import { scheduleMonthNotifications } from '../services/notificationService';
import { Coordinates, DayPrayerTimes, UserSettings } from '../types/Interface';

interface UsePrayerTimesResult {
  today: DayPrayerTimes | null;
  monthDays: DayPrayerTimes[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true; // iOS handled via Info.plist prompt
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 3_600_000 },
    );
  });
}

export function usePrayerTimes(): UsePrayerTimesResult {
  const [today, setToday] = useState<DayPrayerTimes | null>(null);
  const [monthDays, setMonthDays] = useState<DayPrayerTimes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const isoDate = now.toISOString().slice(0, 10);

    try {
      // 1. Try cache first so the UI is instant and works fully offline.
      const cachedToday = await getCachedTodayTimings(year, month, isoDate);
      const cachedMonth = await getCachedMonthTimings(year, month);
      if (cachedToday) setToday(cachedToday);
      if (cachedMonth) setMonthDays(cachedMonth);

      // 2. Refresh from network in the background (or as primary source if no cache).
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        if (!cachedToday) setError('Location permission denied.');
        setLoading(false);
        return;
      }

      const coords = await getCurrentLocation();
      const settings: UserSettings = await getUserSettings();

      const days = await fetchMonthTimings(
        coords,
        settings.calculationMethod,
        settings.madhab,
        month,
        year,
      );

      await cacheMonthTimings(year, month, days);
      await scheduleMonthNotifications(days, settings.reminderMinutesBefore);

      setMonthDays(days);
      const todayEntry = days.find(d => d.date === isoDate) ?? null;
      setToday(todayEntry);
    } catch (e) {
      // If network/location fails but we already have cache, don't surface an error —
      // the app should keep working offline with last-known data.
      if (!today) {
        setError(e instanceof Error ? e.message : 'Failed to load prayer times.');
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { today, monthDays, loading, error, refresh: load };
}
