import axios from 'axios';
import {
  CALCULATION_METHOD_IDS,
  CalculationMethod,
  Coordinates,
  DayPrayerTimes,
  Madhab,
} from '../types/Interface';

const BASE_URL = 'https://api.aladhan.com/v1';

interface AladhanDayResponse {
  data: {
    timings: Record<string, string>;
    date: {
      gregorian: { date: string }; // DD-MM-YYYY
    };
  };
}

interface AladhanCalendarResponse {
  data: Array<{
    timings: Record<string, string>;
    date: {
      gregorian: { date: string };
    };
  }>;
}

/**
 * Strips the "(EEST)" style timezone suffix Aladhan sometimes appends to times.
 */
function cleanTime(raw: string): string {
  return raw.split(' ')[0];
}

function toIsoDate(ddmmyyyy: string): string {
  const [dd, mm, yyyy] = ddmmyyyy.split('-');
  return `${yyyy}-${mm}-${dd}`;
}

function madhabToAsrSchool(madhab: Madhab): number {
  // Aladhan "school" param: 0 = Shafi (standard), 1 = Hanafi
  return madhab === 'Hanafi' ? 1 : 0;
}

/**
 * Fetch a single day's prayer times for given coordinates.
 */
export async function fetchTodayTimings(
  coords: Coordinates,
  method: CalculationMethod,
  madhab: Madhab,
): Promise<DayPrayerTimes> {
  const response = await axios.get<AladhanDayResponse>(`${BASE_URL}/timings`, {
    params: {
      latitude: coords.latitude,
      longitude: coords.longitude,
      method: CALCULATION_METHOD_IDS[method],
      school: madhabToAsrSchool(madhab),
    },
  });

  const { timings, date } = response.data.data;

  return {
    date: toIsoDate(date.gregorian.date),
    timings: {
      Fajr: cleanTime(timings.Fajr),
      Sunrise: cleanTime(timings.Sunrise),
      Dhuhr: cleanTime(timings.Dhuhr),
      Asr: cleanTime(timings.Asr),
      Maghrib: cleanTime(timings.Maghrib),
      Isha: cleanTime(timings.Isha),
      Imsak: cleanTime(timings.Imsak),
      Midnight: cleanTime(timings.Midnight),
    },
  };
}

/**
 * Fetch a full month's prayer times in one call — used to populate the offline cache
 * so notifications keep working without network access.
 */
export async function fetchMonthTimings(
  coords: Coordinates,
  method: CalculationMethod,
  madhab: Madhab,
  month: number, // 1-12
  year: number,
): Promise<DayPrayerTimes[]> {
  const response = await axios.get<AladhanCalendarResponse>(
    `${BASE_URL}/calendar`,
    {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        method: CALCULATION_METHOD_IDS[method],
        school: madhabToAsrSchool(madhab),
        month,
        year,
      },
    },
  );

  return response.data.data.map(day => ({
    date: toIsoDate(day.date.gregorian.date),
    timings: {
      Fajr: cleanTime(day.timings.Fajr),
      Sunrise: cleanTime(day.timings.Sunrise),
      Dhuhr: cleanTime(day.timings.Dhuhr),
      Asr: cleanTime(day.timings.Asr),
      Maghrib: cleanTime(day.timings.Maghrib),
      Isha: cleanTime(day.timings.Isha),
      Imsak: cleanTime(day.timings.Imsak),
      Midnight: cleanTime(day.timings.Midnight),
    },
  }));
}
