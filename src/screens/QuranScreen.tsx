import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAppTheme } from '../theme/ThemeContext';
import type { AppColors } from '../theme/ThemeContext';
import { loadLastRead, saveLastRead } from '../services/quranProgress';
import type { QuranReadingPosition } from '../services/quranProgress';

type Surah = {
  id: number;
  name: string;
  arabicName: string;
  verses: number;
  type: 'Meccan' | 'Medinan';
};

type GitHubSurah = {
  place: string;
  count: number;
  title: string;
  titleAr: string;
  index: string;
};

const SURAHS_URL =
  'https://raw.githubusercontent.com/semarketir/quranjson/master/source/surah.json';

export default function QuranScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const [search, setSearch] = useState('');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [lastRead, setLastRead] = useState<QuranReadingPosition | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      loadLastRead().then(position => {
        if (isActive) {
          setLastRead(position);
        }
      });

      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    let isActive = true;

    const fetchSurahs = async () => {
      setIsLoading(true);
      setLoadError(false);

      try {
        const response = await fetch(SURAHS_URL);
        if (!response.ok) {
          throw new Error('Unable to fetch Surahs');
        }

        const data = (await response.json()) as GitHubSurah[];
        if (!Array.isArray(data)) {
          throw new Error('Invalid Surah data');
        }

        const fetchedSurahs: Surah[] = data.map(surah => ({
          id: Number(surah.index),
          name: surah.title,
          arabicName: surah.titleAr,
          verses: surah.count,
          type: surah.place === 'Mecca' ? 'Meccan' : 'Medinan',
        }));

        if (isActive) {
          setSurahs(fetchedSurahs);
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

    fetchSurahs();
    return () => {
      isActive = false;
    };
  }, [loadAttempt]);

  const filteredSurahs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return surahs;
    }

    return surahs.filter(surah => {
      return (
        surah.name.toLowerCase().includes(query) ||
        surah.arabicName.includes(query) ||
        String(surah.id).includes(query)
      );
    });
  }, [search, surahs]);

  const openSurah = async (surah: Surah, verseNumber = 1) => {
    const startVerse = Math.min(Math.max(verseNumber, 1), surah.verses);
    const position: QuranReadingPosition = {
      surahId: surah.id,
      surahName: surah.name,
      arabicName: surah.arabicName,
      verses: surah.verses,
      revelationType: surah.type,
      verseNumber: startVerse,
    };

    try {
      await saveLastRead(position);
    } catch {
      // Keep navigation available if local storage is unavailable.
    }

    setLastRead(position);
    navigation.navigate('QuranReader', {
      ...position,
      startVerse,
    });
  };

  const handleLastReadPress = () => {
    if (lastRead) {
      navigation.navigate('QuranReader', {
        ...lastRead,
        startVerse: lastRead.verseNumber,
      });
    } else if (surahs.length > 0) {
      void openSurah(surahs[0]);
    }
  };

  const progress = lastRead
    ? Math.min((lastRead.verseNumber / lastRead.verses) * 100, 100)
    : 0;

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahCard}
      activeOpacity={0.75}
      onPress={() => void openSurah(item)}
    >
      {/* Number */}
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{item.id}</Text>
      </View>

      {/* Details */}
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>{item.type}</Text>

          <View style={styles.dot} />

          <Text style={styles.metaText}>
            {item.verses} verses
          </Text>
        </View>
      </View>

      {/* Arabic */}
      <Text style={styles.arabicName}>{item.arabicName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredSurahs}
        keyExtractor={item => item.id.toString()}
        renderItem={renderSurah}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Quran</Text>
                <Text style={styles.subtitle}>
                  Read, reflect and remember
                </Text>
              </View>

              <View style={styles.headerIcon}>
                <Text style={styles.headerIconText}>☪</Text>
              </View>
            </View>

            {/* Last Read */}
            <TouchableOpacity
              style={styles.lastReadCard}
              activeOpacity={0.85}
              onPress={handleLastReadPress}
              accessibilityRole="button"
              accessibilityLabel={
                lastRead
                  ? `Continue reading ${lastRead.surahName}, verse ${lastRead.verseNumber}`
                  : 'Choose a Surah to begin reading'
              }
            >
              <View style={styles.lastReadContent}>
                <Text style={styles.lastReadLabel}>
                  LAST READ
                </Text>

                <Text style={styles.lastReadTitle}>
                  {lastRead?.surahName ?? 'Start reading'}
                </Text>

                <Text style={styles.lastReadVerse}>
                  {lastRead
                    ? `Verse ${lastRead.verseNumber} of ${lastRead.verses}`
                    : 'Tap to choose a Surah'}
                </Text>
              </View>

              <View style={styles.continueButton}>
                <Text style={styles.continueIcon}>▶</Text>
              </View>

              {/* Progress */}
              <View style={styles.progressWrapper}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressValue, { width: `${progress}%` }]} />
                </View>

                <Text style={styles.progressText}>
                  {lastRead ? 'Continue reading' : 'Open the Surah list'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Search */}
            <View style={styles.searchBox}>
              <Text style={styles.searchIcon}>⌕</Text>

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search Surah..."
                placeholderTextColor={colors.textMuted}
                style={styles.searchInput}
                returnKeyType="search"
              />

              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch('')}
                  hitSlop={10}
                >
                  <Text style={styles.clearButton}>×</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Surahs</Text>

              <Text style={styles.sectionCount}>
                {surahs.length} Surahs
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ActivityIndicator color={colors.accent} />
            ) : loadError ? (
              <>
                <Text style={styles.emptyTitle}>Could not load Surahs</Text>
                <Text style={styles.emptyText}>Check your connection and try again.</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => setLoadAttempt(attempt => attempt + 1)}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.emptyIcon}>⌕</Text>
                <Text style={styles.emptyTitle}>No Surah found</Text>
                <Text style={styles.emptyText}>Try searching for another Surah.</Text>
              </>
            )}
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
    padding: 20,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: colors.textMuted,
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
  },

  headerIconText: {
    fontSize: 25,
    color: colors.accent,
  },

  // Last Read
  lastReadCard: {
    minHeight: 150,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#0F766E',
    marginBottom: 20,

    shadowColor: '#0F766E',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },

  lastReadContent: {
    flex: 1,
  },

  lastReadLabel: {
    color: '#BDE5DE',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  lastReadTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 5,
  },

  lastReadVerse: {
    color: '#D7EEEA',
    fontSize: 13,
    marginTop: 3,
  },

  continueButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  continueIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 2,
  },

  progressWrapper: {
    marginTop: 14,
  },

  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },

  progressValue: {
    width: '38%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },

  progressText: {
    color: '#D7EEEA',
    fontSize: 11,
    marginTop: 7,
  },

  // Search
  searchBox: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 25,

    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },

  searchIcon: {
    fontSize: 25,
    color: colors.textMuted,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: colors.textSecondary,
  },

  clearButton: {
    fontSize: 25,
    color: colors.textMuted,
    paddingLeft: 8,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.text,
  },

  sectionCount: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Surah
  surahCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 10,

    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 7,
    elevation: 1,
  },

  numberContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentSoft,
    marginRight: 13,
  },

  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },

  surahInfo: {
    flex: 1,
  },

  surahName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  metaText: {
    fontSize: 10,
    color: colors.textMuted,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 6,
  },

  arabicName: {
    fontSize: 19,
    color: colors.accent,
    marginLeft: 8,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },

  emptyIcon: {
    fontSize: 40,
    color: colors.textMuted,
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: colors.textMuted,
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
