import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Surah = {
  id: number;
  name: string;
  arabicName: string;
  meaning: string;
  verses: number;
  type: 'Meccan' | 'Medinan';
};

const SURAHS: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    meaning: 'The Opening',
    verses: 7,
    type: 'Meccan',
  },
  {
    id: 2,
    name: 'Al-Baqarah',
    arabicName: 'البقرة',
    meaning: 'The Cow',
    verses: 286,
    type: 'Medinan',
  },
  {
    id: 3,
    name: 'Aal-E-Imran',
    arabicName: 'آل عمران',
    meaning: 'Family of Imran',
    verses: 200,
    type: 'Medinan',
  },
  {
    id: 4,
    name: 'An-Nisa',
    arabicName: 'النساء',
    meaning: 'The Women',
    verses: 176,
    type: 'Medinan',
  },
  {
    id: 5,
    name: 'Al-Maidah',
    arabicName: 'المائدة',
    meaning: 'The Table Spread',
    verses: 120,
    type: 'Medinan',
  },
  {
    id: 6,
    name: "Al-An'am",
    arabicName: 'الأنعام',
    meaning: 'The Cattle',
    verses: 165,
    type: 'Meccan',
  },
  {
    id: 7,
    name: "Al-A'raf",
    arabicName: 'الأعراف',
    meaning: 'The Heights',
    verses: 206,
    type: 'Meccan',
  },
  {
    id: 8,
    name: 'Al-Anfal',
    arabicName: 'الأنفال',
    meaning: 'The Spoils of War',
    verses: 75,
    type: 'Medinan',
  },
  {
    id: 9,
    name: 'At-Tawbah',
    arabicName: 'التوبة',
    meaning: 'The Repentance',
    verses: 129,
    type: 'Medinan',
  },
  {
    id: 10,
    name: 'Yunus',
    arabicName: 'يونس',
    meaning: 'Jonah',
    verses: 109,
    type: 'Meccan',
  },
  {
    id: 11,
    name: 'Hud',
    arabicName: 'هود',
    meaning: 'Hud',
    verses: 123,
    type: 'Meccan',
  },
  {
    id: 12,
    name: 'Yusuf',
    arabicName: 'يوسف',
    meaning: 'Joseph',
    verses: 111,
    type: 'Meccan',
  },
];

export default function QuranScreen(): React.JSX.Element {
  const [search, setSearch] = useState('');

  const filteredSurahs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return SURAHS;
    }

    return SURAHS.filter(surah => {
      return (
        surah.name.toLowerCase().includes(query) ||
        surah.meaning.toLowerCase().includes(query) ||
        String(surah.id).includes(query)
      );
    });
  }, [search]);

  const handleSurahPress = (surah: Surah) => {
    // TODO:
    // Navigate to QuranReader screen
    console.log('Open Surah:', surah.id);
  };

  const renderSurah = ({ item }: { item: Surah }) => (
    <TouchableOpacity
      style={styles.surahCard}
      activeOpacity={0.75}
      onPress={() => handleSurahPress(item)}
    >
      {/* Number */}
      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{item.id}</Text>
      </View>

      {/* Details */}
      <View style={styles.surahInfo}>
        <Text style={styles.surahName}>{item.name}</Text>

        <Text style={styles.meaning}>{item.meaning}</Text>

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
            >
              <View style={styles.lastReadContent}>
                <Text style={styles.lastReadLabel}>
                  LAST READ
                </Text>

                <Text style={styles.lastReadTitle}>
                  Al-Baqarah
                </Text>

                <Text style={styles.lastReadVerse}>
                  Verse 255
                </Text>
              </View>

              <View style={styles.continueButton}>
                <Text style={styles.continueIcon}>▶</Text>
              </View>

              {/* Progress */}
              <View style={styles.progressWrapper}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressValue} />
                </View>

                <Text style={styles.progressText}>
                  Continue reading
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
                placeholderTextColor="#94A19E"
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
                114 Surahs
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⌕</Text>

            <Text style={styles.emptyTitle}>
              No Surah found
            </Text>

            <Text style={styles.emptyText}>
              Try searching for another Surah.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F8F7',
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
    color: '#12312E',
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#71807D',
  },

  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCEFEA',
  },

  headerIconText: {
    fontSize: 25,
    color: '#0F766E',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 25,

    shadowColor: '#12312E',
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
    color: '#71807D',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#263B38',
  },

  clearButton: {
    fontSize: 25,
    color: '#94A19E',
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
    color: '#12312E',
  },

  sectionCount: {
    fontSize: 12,
    color: '#8A9995',
  },

  // Surah
  surahCard: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 10,

    shadowColor: '#12312E',
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
    backgroundColor: '#E7F3F0',
    marginRight: 13,
  },

  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
  },

  surahInfo: {
    flex: 1,
  },

  surahName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#263B38',
  },

  meaning: {
    fontSize: 12,
    color: '#7A8985',
    marginTop: 2,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  metaText: {
    fontSize: 10,
    color: '#9AA5A2',
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#AAB5B2',
    marginHorizontal: 6,
  },

  arabicName: {
    fontSize: 19,
    color: '#0F766E',
    marginLeft: 8,
  },

  // Empty
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },

  emptyIcon: {
    fontSize: 40,
    color: '#B3C3BF',
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: '#52635F',
  },

  emptyText: {
    marginTop: 5,
    fontSize: 13,
    color: '#8A9995',
  },
});
