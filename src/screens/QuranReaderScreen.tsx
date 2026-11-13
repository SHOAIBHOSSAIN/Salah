import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ListViewToken } from '@react-native/virtualized-lists';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import type { AppColors } from '../theme/ThemeContext';
import { COLORS } from '../constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '../constants/fonts';
import { saveLastRead } from '../services/quranProgress';
import type { QuranReadingPosition } from '../services/quranProgress';

type ReaderProps = NativeStackScreenProps<RootStackParamList, 'QuranReader'>;
type Verse = { number: number; text: string };
type GitHubSurahDetail = {
  verse: Record<string, string>;
};

const SURAH_URL =
  'https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah/surah_';

export default function QuranReaderScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, arabicFontSize } = useAppTheme();
  const styles = createStyles(colors, arabicFontSize);
  const { params } = useRoute<ReaderProps['route']>();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const listRef = useRef<FlatList<Verse>>(null);
  const restoredPosition = useRef(false);
  const positionRef = useRef({ params, isLoading, restoredPosition: false });
  positionRef.current = { params, isLoading, restoredPosition: restoredPosition.current };
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 40 }).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ListViewToken[] }) => {
      const current = positionRef.current;
      if (current.isLoading || !current.restoredPosition) {
        return;
      }

      const firstVisibleVerse = viewableItems
        .filter(token => token.isViewable && token.item)
        .map(token => token.item as Verse)
        .sort((first, second) => first.number - second.number)[0];

      if (!firstVisibleVerse) {
        return;
      }

      const position: QuranReadingPosition = {
        surahId: current.params.surahId,
        surahName: current.params.surahName,
        arabicName: current.params.arabicName,
        verses: current.params.verses,
        revelationType: current.params.revelationType,
        verseNumber: firstVisibleVerse.number,
      };
      void saveLastRead(position).catch(() => undefined);
    },
  ).current;

  const restoreReadingPosition = useCallback(() => {
    if (isLoading || verses.length === 0 || restoredPosition.current) {
      return;
    }

    const index = Math.min(Math.max(params.startVerse - 1, 0), verses.length - 1);
    restoredPosition.current = true;
    positionRef.current.restoredPosition = true;
    if (index > 0) {
      listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0 });
    }
  }, [isLoading, params.startVerse, verses.length]);

  useEffect(() => {
    let isActive = true;

    const fetchVerses = async () => {
      setIsLoading(true);
      setLoadError(false);

      try {
        const response = await fetch(`${SURAH_URL}${params.surahId}.json`);
        if (!response.ok) {
          throw new Error('Unable to fetch verses');
        }

        const data = (await response.json()) as GitHubSurahDetail;
        if (!data.verse || typeof data.verse !== 'object') {
          throw new Error('Invalid verse data');
        }

        const fetchedVerses = Object.entries(data.verse)
          .map(([key, text]) => ({
            number: Number(key.replace('verse_', '')),
            text: text.replace(/^\uFEFF/, ''),
          }))
          .filter(verse => Number.isInteger(verse.number) && verse.number > 0)
          .sort((first, second) => first.number - second.number);

        if (fetchedVerses.length === 0) {
          throw new Error('No verses found');
        }

        if (isActive) {
          restoredPosition.current = false;
          positionRef.current.restoredPosition = false;
          setVerses(fetchedVerses);
        }
      } catch {
        if (isActive) {
          setLoadError(true);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchVerses();
    return () => {
      isActive = false;
    };
  }, [loadAttempt, params.surahId]);

  useEffect(() => {
    const frame = requestAnimationFrame(restoreReadingPosition);
    return () => cancelAnimationFrame(frame);
  }, [restoreReadingPosition]);

  const renderVerse = ({ item }: { item: Verse }) => (
    <View style={styles.verseRow}>
      <Text style={styles.verseText}>{item.text}</Text>
      <View style={styles.verseNumber}>
        <Text style={styles.verseNumberText}>{item.number}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <FlatList
        ref={listRef}
        data={verses}
        keyExtractor={item => item.number.toString()}
        renderItem={renderVerse}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={restoreReadingPosition}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          listRef.current?.scrollToOffset({
            offset: averageItemLength * index,
            animated: false,
          });
          requestAnimationFrame(() => {
            listRef.current?.scrollToIndex({ index, animated: false, viewPosition: 0 });
          });
        }}
        ListHeaderComponent={
          <>
            <View style={styles.navigationHeader}>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Go back to Surahs"
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.headerLabel}>QURAN</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.surahHeader}>
              <Text style={styles.surahName}>{params.surahName}</Text>
              <Text style={styles.arabicName}>{params.arabicName}</Text>
              <Text style={styles.surahMeta}>
                {params.revelationType}  ·  {params.verses} verses
              </Text>
            </View>

            <View style={styles.versesHeading}>
              <Text style={styles.versesHeadingText}>Verses</Text>
              <Text style={styles.versesCount}>{verses.length}</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator color={colors.accent} />
            ) : loadError ? (
              <>
                <Text style={styles.emptyTitle}>Could not load verses</Text>
                <Text style={styles.emptyText}>Check your connection and try again.</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => setLoadAttempt(attempt => attempt + 1)}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors, arabicFontSize: number) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 36,
  },
  navigationHeader: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: colors.text,
    fontSize: FONT_SIZE.backIcon,
    lineHeight: 40,
  },
  headerLabel: {
    color: colors.textMuted,
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 42,
  },
  surahHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    marginBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  surahName: {
    color: colors.text,
    fontSize: FONT_SIZE.headerIcon,
    fontWeight: FONT_WEIGHT.extraBold,
  },
  arabicName: {
    color: colors.accent,
    fontSize: arabicFontSize,
    marginTop: 10,
  },
  surahMeta: {
    color: colors.textMuted,
    fontSize: FONT_SIZE.secondary,
    marginTop: 10,
  },
  versesHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  versesHeadingText: {
    color: colors.text,
    fontSize: FONT_SIZE.section,
    fontWeight: FONT_WEIGHT.bold,
  },
  versesCount: {
    color: colors.textMuted,
    fontSize: FONT_SIZE.secondary,
  },
  verseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  verseText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: arabicFontSize,
    lineHeight: Math.round(arabicFontSize * 1.9),
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  verseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginLeft: 12,
    marginTop: 7,
  },
  verseNumberText: {
    color: colors.accent,
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: FONT_SIZE.row,
    fontWeight: FONT_WEIGHT.bold,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: FONT_SIZE.secondary,
    marginTop: 6,
  },
  retryButton: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.brand,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.bold,
  },
});