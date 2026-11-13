import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import type { AppColors } from '../theme/ThemeContext';

type ReaderProps = NativeStackScreenProps<RootStackParamList, 'QuranReader'>;
type Verse = { number: number; text: string };
type GitHubSurahDetail = {
  verse: Record<string, string>;
};

const SURAH_URL =
  'https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah/surah_';

export default function QuranReaderScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { params } = useRoute<ReaderProps['route']>();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

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

  const renderVerse = ({ item }: { item: Verse }) => (
    <View style={styles.verseRow}>
      <Text style={styles.verseText}>{item.text}</Text>
      <View style={styles.verseNumber}>
        <Text style={styles.verseNumberText}>{item.number}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={verses}
        keyExtractor={item => item.number.toString()}
        renderItem={renderVerse}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
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
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
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
    fontSize: 36,
    lineHeight: 40,
  },
  headerLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
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
    fontSize: 25,
    fontWeight: '800',
  },
  arabicName: {
    color: colors.accent,
    fontSize: 28,
    marginTop: 10,
  },
  surahMeta: {
    color: colors.textMuted,
    fontSize: 13,
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
    fontSize: 18,
    fontWeight: '700',
  },
  versesCount: {
    color: colors.textMuted,
    fontSize: 13,
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
    fontSize: 27,
    lineHeight: 52,
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
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  retryButton: {
    marginTop: 14,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#0F766E',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});