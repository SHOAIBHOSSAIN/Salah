import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { PRAYER_NAMES } from '../types/Interface';
import { useAppTheme } from '../theme/ThemeContext';
import type { AppColors } from '../theme/ThemeContext';
import { COLORS } from '../constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '../constants/fonts';

export default function PrayerTimesScreen(): React.JSX.Element {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const { today, loading, error, refresh } = usePrayerTimes();

  if (loading && !today) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'left', 'right']}>
        <View style={styles.loadingIcon}>
          <Text style={styles.mosqueIcon}>☪</Text>
        </View>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Fetching prayer times...</Text>
      </SafeAreaView>
    );
  }

  if (error && !today) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'left', 'right']}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>!</Text>
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Today's Prayers</Text>
            <Text style={styles.subtitle}>May your prayers bring peace</Text>
          </View>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>☪</Text>
          </View>
        </View>

        <View style={styles.dateCard}>
          <View style={styles.calendarIcon}>
            <Text style={styles.calendarText}>☷</Text>
          </View>
          <View>
            <Text style={styles.dateLabel}>TODAY</Text>
            <Text style={styles.dateText}>{today?.date}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Prayer Times</Text>
        <View style={styles.prayerCard}>
          {PRAYER_NAMES.map((name, index) => (
            <View
              key={name}
              style={[
                styles.row,
                index === PRAYER_NAMES.length - 1 && styles.lastRow,
              ]}
            >
              <View style={styles.prayerInfo}>
                <View style={styles.prayerDot} />
                <Text style={styles.prayerName}>{name}</Text>
              </View>
              <Text style={styles.prayerTime}>{today?.timings[name]}</Text>
            </View>
          ))}
        </View>

        {loading && today && (
          <View style={styles.updating}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.updatingText}>Updating prayer times...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  greeting: {
    fontSize: FONT_SIZE.greeting,
    fontWeight: FONT_WEIGHT.extraBold,
    color: colors.text,
  },
  subtitle: {
    marginTop: 5,
    fontSize: FONT_SIZE.body,
    color: colors.textMuted,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: FONT_SIZE.largeIcon,
    color: colors.accent,
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.brand,
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
    shadowColor: COLORS.brand,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  calendarIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: COLORS.brandOverlay,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  calendarText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.cardTitle,
  },
  dateLabel: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.brandTextMuted,
    marginBottom: 3,
  },
  dateText: {
    fontSize: FONT_SIZE.button,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.white,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.sectionTitle,
    fontWeight: FONT_WEIGHT.bold,
    color: colors.text,
    marginBottom: 12,
  },
  prayerCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 18,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  prayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginRight: 13,
  },
  prayerName: {
    fontSize: FONT_SIZE.row,
    fontWeight: FONT_WEIGHT.semibold,
    color: colors.textSecondary,
  },
  prayerTime: {
    fontSize: FONT_SIZE.row,
    fontWeight: FONT_WEIGHT.bold,
    color: colors.accent,
    fontVariant: ['tabular-nums'],
  },
  loadingIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mosqueIcon: {
    fontSize: FONT_SIZE.loadingIcon,
    color: colors.accent,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: FONT_SIZE.input,
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIconText: {
    fontSize: FONT_SIZE.greeting,
    fontWeight: FONT_WEIGHT.extraBold,
    color: COLORS.danger,
  },
  errorTitle: {
    fontSize: FONT_SIZE.sectionTitle,
    fontWeight: FONT_WEIGHT.bold,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: FONT_SIZE.body,
    lineHeight: 21,
    textAlign: 'center',
  },
  updating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  updatingText: {
    marginLeft: 8,
    color: colors.textMuted,
    fontSize: FONT_SIZE.secondary,
  },
});