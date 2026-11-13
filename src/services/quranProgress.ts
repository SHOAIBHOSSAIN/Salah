import AsyncStorage from '@react-native-async-storage/async-storage';

export type QuranReadingPosition = {
  surahId: number;
  surahName: string;
  arabicName: string;
  verses: number;
  revelationType: 'Meccan' | 'Medinan';
  verseNumber: number;
};

const LAST_READ_KEY = 'quran.lastRead';

export async function loadLastRead(): Promise<QuranReadingPosition | null> {
  try {
    const storedValue = await AsyncStorage.getItem(LAST_READ_KEY);
    if (!storedValue) {
      return null;
    }

    const position = JSON.parse(storedValue) as Partial<QuranReadingPosition>;
    if (
      !Number.isInteger(position.surahId) ||
      Number(position.surahId) < 1 ||
      Number(position.surahId) > 114 ||
      !Number.isInteger(position.verseNumber) ||
      !Number.isInteger(position.verses) ||
      Number(position.verseNumber) < 1 ||
      Number(position.verseNumber) > Number(position.verses) ||
      typeof position.surahName !== 'string' ||
      typeof position.arabicName !== 'string' ||
      (position.revelationType !== 'Meccan' && position.revelationType !== 'Medinan')
    ) {
      return null;
    }

    return position as QuranReadingPosition;
  } catch {
    return null;
  }
}

export async function saveLastRead(position: QuranReadingPosition): Promise<void> {
  await AsyncStorage.setItem(LAST_READ_KEY, JSON.stringify(position));
}