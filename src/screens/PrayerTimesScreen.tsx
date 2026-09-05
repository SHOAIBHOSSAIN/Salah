import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { PRAYER_NAMES } from '../types/Interface';

export default function PrayerTimesScreen(): React.JSX.Element {
  const { today, loading, error, refresh } = usePrayerTimes();

  if (loading && !today) {
    return (
      <View style={styles.center}>
        <View style={styles.loadingIcon}>
          <Text style={styles.mosqueIcon}>☪</Text>
        </View>
        <ActivityIndicator size="large" color="#0F766E" />
        <Text style={styles.loadingText}>Fetching prayer times...</Text>
      </View>
    );
  }

  if (error && !today) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>!</Text>
        </View>
        <Text style={styles.errorTitle}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#0F766E"
            colors={['#0F766E']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Today's Prayers</Text>
            <Text style={styles.subtitle}>
              May your prayers bring peace
            </Text>
          </View>

          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>☪</Text>
          </View>
        </View>

        {/* Date Card */}
        <View style={styles.dateCard}>
          <View style={styles.calendarIcon}>
            <Text style={styles.calendarText}>☷</Text>
          </View>

          <View>
            <Text style={styles.dateLabel}>TODAY</Text>
            <Text style={styles.dateText}>{today?.date}</Text>
          </View>
        </View>

        {/* Prayer Times */}
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

              <Text style={styles.prayerTime}>
                {today?.timings[name]}
              </Text>
            </View>
          ))}
        </View>

        {loading && today && (
          <View style={styles.updating}>
            <ActivityIndicator size="small" color="#0F766E" />
            <Text style={styles.updatingText}>Updating prayer times...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F8F7',
  },

  container: {
    padding: 20,
    // paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#F5F8F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },

  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#12312E',
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 14,
    color: '#71807D',
  },

  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEFEA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconText: {
    fontSize: 24,
    color: '#0F766E',
  },

  // Date
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,

    shadowColor: '#0F766E',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },

  calendarIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  calendarText: {
    color: '#FFFFFF',
    fontSize: 22,
  },

  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#BDE5DE',
    marginBottom: 3,
  },

  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Section
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#12312E',
    marginBottom: 12,
  },

  // Prayer card
  prayerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 18,

    shadowColor: '#12312E',
    shadowOffset: {
      width: 0,
      height: 3,
    },
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
    borderBottomColor: '#E5EAE8',
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
    backgroundColor: '#0F766E',
    marginRight: 13,
  },

  prayerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#263B38',
  },

  prayerTime: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F766E',
    fontVariant: ['tabular-nums'],
  },

  // Loading
  loadingIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#DCEFEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  mosqueIcon: {
    fontSize: 34,
    color: '#0F766E',
  },

  loadingText: {
    marginTop: 12,
    color: '#687875',
    fontSize: 15,
  },

  // Error
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FDE8E7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  errorIconText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#C0392B',
  },

  errorTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#263B38',
    marginBottom: 8,
  },

  errorText: {
    color: '#7A8582',
    fontSize: 14,
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
    color: '#71807D',
    fontSize: 13,
  },
});
