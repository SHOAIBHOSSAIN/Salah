import notifee, {
  AndroidImportance,
  TriggerType,
  TimestampTrigger,
} from '@notifee/react-native';
import { DayPrayerTimes, PRAYER_NAMES } from '../types/Interface';
const CHANNEL_ID = 'prayer-times';

/**
 * Call once on app start (e.g. in App.tsx) — creates the Android notification channel.
 */
export async function setupNotificationChannel(): Promise<void> {
  await notifee.requestPermission();
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Prayer Time Alerts',
    importance: AndroidImportance.HIGH,
    sound: 'adhan', // place adhan.mp3 in android/app/src/main/res/raw/ and ios bundle
  });
}

function parseTimeToDate(hhmm: string, baseDate: Date): Date {
  const [hours, minutes] = hhmm.split(':').map(Number);
  const d = new Date(baseDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/**
 * Cancels all previously scheduled prayer notifications. Call before rescheduling
 * to avoid duplicates (e.g. when settings change or a new day/month loads).
 */
export async function cancelAllPrayerNotifications(): Promise<void> {
  const scheduled = await notifee.getTriggerNotificationIds();
  const prayerIds = scheduled.filter((id: string) => id.startsWith('prayer-'));
  await Promise.all(prayerIds.map((id: string) => notifee.cancelNotification(id)));
}

/**
 * Schedules a notification for each of the 5 daily prayers on a given date,
 * optionally with a reminder N minutes before.
 */
export async function scheduleDayNotifications(
  day: DayPrayerTimes,
  reminderMinutesBefore: number,
): Promise<void> {
  const baseDate = new Date(day.date);

  for (const prayerName of PRAYER_NAMES) {
    const prayerTime = parseTimeToDate(day.timings[prayerName], baseDate);

    // Skip times already in the past (e.g. scheduling mid-day for today)
    if (prayerTime.getTime() <= Date.now()) continue;

    const mainTrigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: prayerTime.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: `prayer-${day.date}-${prayerName}`,
        title: `${prayerName} time has arrived`,
        body: `It is now time for ${prayerName} prayer.`,
        android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
      },
      mainTrigger,
    );

    if (reminderMinutesBefore > 0) {
      const reminderTime = new Date(
        prayerTime.getTime() - reminderMinutesBefore * 60_000,
      );
      if (reminderTime.getTime() <= Date.now()) continue;

      const reminderTrigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: reminderTime.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          id: `prayer-${day.date}-${prayerName}-reminder`,
          title: `${prayerName} in ${reminderMinutesBefore} minutes`,
          body: `${prayerName} prayer time is coming up soon.`,
          android: { channelId: CHANNEL_ID, pressAction: { id: 'default' } },
        },
        reminderTrigger,
      );
    }
  }
}

/**
 * Schedules notifications for every day in a fetched month batch.
 * Run this after fetching/caching a new month so notifications don't silently stop.
 */
export async function scheduleMonthNotifications(
  days: DayPrayerTimes[],
  reminderMinutesBefore: number,
): Promise<void> {
  for (const day of days) {
    await scheduleDayNotifications(day, reminderMinutesBefore);
  }
}
