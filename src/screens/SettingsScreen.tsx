import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import type { AppColors } from '../theme/ThemeContext';

type SettingRowProps = {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
};

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
}: SettingRowProps): React.JSX.Element {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);

  const content = (
    <>
      <View style={styles.rowIcon}>
        <Text style={styles.rowIconText}>{icon}</Text>
      </View>

      <View style={styles.rowContent}>
        <Text style={styles.rowTitle}>{title}</Text>

        {subtitle && (
          <Text style={styles.rowSubtitle}>{subtitle}</Text>
        )}
      </View>

      {right ?? (
        <Text style={styles.chevron}>›</Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.settingRow}
        activeOpacity={0.7}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.settingRow}>{content}</View>;
}

export default function SettingsScreen(): React.JSX.Element {
  const { isDark, setDarkMode, colors } = useAppTheme();
  const styles = createStyles(colors);
  const [notifications, setNotifications] = useState(true);
  const [prayerReminder, setPrayerReminder] = useState(true);

  const showComingSoon = (title: string) => {
    Alert.alert(title, 'This feature will be available soon.');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>
              Customize your experience
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⚙</Text>
          </View>
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.card}>
          <SettingRow
            icon="🔔"
            title="Notifications"
            subtitle="Receive important updates"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: colors.border,
                  true: colors.accentSoft,
                }}
                thumbColor={
                  notifications ? colors.accent : '#F4F4F4'
                }
              />
            }
          />

          <View style={styles.separator} />

          <SettingRow
            icon="🕌"
            title="Prayer Reminders"
            subtitle="Get notified before prayer"
            right={
              <Switch
                value={prayerReminder}
                onValueChange={setPrayerReminder}
                trackColor={{
                  false: colors.border,
                  true: colors.accentSoft,
                }}
                thumbColor={
                  prayerReminder ? colors.accent : '#F4F4F4'
                }
              />
            }
          />

          <View style={styles.separator} />

          <SettingRow
            icon="🌙"
            title="Dark Mode"
            subtitle="Use a darker appearance"
            right={
              <Switch
                value={isDark}
                onValueChange={setDarkMode}
                trackColor={{
                  false: colors.border,
                  true: colors.accentSoft,
                }}
                thumbColor={
                  isDark ? colors.accent : '#F4F4F4'
                }
              />
            }
          />
        </View>

        {/* Prayer Settings */}
        <Text style={styles.sectionTitle}>Prayer</Text>

        <View style={styles.card}>
          <SettingRow
            icon="📍"
            title="Location"
            subtitle="Use your location for prayer times"
            onPress={() => showComingSoon('Location')}
          />

          <View style={styles.separator} />

          <SettingRow
            icon="🧭"
            title="Qibla Direction"
            subtitle="Configure Qibla settings"
            onPress={() => showComingSoon('Qibla Direction')}
          />

          <View style={styles.separator} />

          <SettingRow
            icon="⏰"
            title="Prayer Calculation"
            subtitle="Calculation method"
            onPress={() => showComingSoon('Prayer Calculation')}
          />
        </View>

        {/* Quran */}
        <Text style={styles.sectionTitle}>Quran</Text>

        <View style={styles.card}>
          <SettingRow
            icon="📖"
            title="Translation"
            subtitle="English"
            onPress={() => showComingSoon('Translation')}
          />

          <View style={styles.separator} />

          <SettingRow
            icon="🔤"
            title="Arabic Font Size"
            subtitle="Medium"
            onPress={() => showComingSoon('Arabic Font Size')}
          />

          <View style={styles.separator} />

          <SettingRow
            icon="🔊"
            title="Quran Reciter"
            subtitle="Choose your favorite reciter"
            onPress={() => showComingSoon('Quran Reciter')}
          />
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.card}>
          <SettingRow
            icon="ℹ️"
            title="About App"
            subtitle="Learn more about this app"
            onPress={() => showComingSoon('About App')}
          />

          <View style={styles.separator} />

          <SettingRow
            icon="⭐"
            title="Rate the App"
            subtitle="Share your feedback"
            onPress={() => showComingSoon('Rate the App')}
          />

          <View style={styles.separator} />

          <SettingRow
            icon="📤"
            title="Share App"
            subtitle="Invite your friends"
            onPress={() => showComingSoon('Share App')}
          />
        </View>

        {/* Version */}
        <View style={styles.footer}>
          <Text style={styles.appName}>Muslim Companion</Text>
          <Text style={styles.version}>Version 1.0.0</Text>

          <Text style={styles.footerMessage}>
            May Allah bless your journey 🤍
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    padding: 20,
    paddingBottom: 110,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
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
    fontSize: 23,
    color: colors.accent,
  },

  // Sections
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 10,
    marginLeft: 3,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 24,

    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.035,
    shadowRadius: 8,
    elevation: 1,
  },

  // Row
  settingRow: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
    marginRight: 13,
  },

  rowIconText: {
    fontSize: 18,
  },

  rowContent: {
    flex: 1,
    paddingRight: 10,
  },

  rowTitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },

  rowSubtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 3,
  },

  chevron: {
    fontSize: 27,
    fontWeight: '300',
    color: colors.textMuted,
    marginLeft: 5,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 55,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 20,
  },

  appName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },

  version: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 4,
  },

  footerMessage: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 15,
  },
});
