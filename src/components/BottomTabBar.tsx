import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type TabItem = {
  key: string;
  label: string;
  icon: string;
};

type BottomTabBarProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
};

export default function BottomTabBar({
  tabs,
  activeTab,
  onTabPress,
}: BottomTabBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map(tab => {
          const active = tab.key === activeTab;

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => onTabPress(tab.key)}
            >
              <View
                style={[
                  styles.iconContainer,
                  active && styles.activeIconContainer,
                ]}
              >
                <Text
                  style={[
                    styles.icon,
                    active && styles.activeIcon,
                  ]}
                >
                  {tab.icon}
                </Text>
              </View>

              <Text
                style={[
                  styles.label,
                  active && styles.activeLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F8F7',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  tabBar: {
    height: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,

    shadowColor: '#12312E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 38,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeIconContainer: {
    backgroundColor: '#DCEFEA',
  },

  icon: {
    fontSize: 20,
    color: '#8A9995',
  },

  activeIcon: {
    color: '#0F766E',
  },

  label: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '500',
    color: '#8A9995',
  },

  activeLabel: {
    color: '#0F766E',
    fontWeight: '700',
  },
});
