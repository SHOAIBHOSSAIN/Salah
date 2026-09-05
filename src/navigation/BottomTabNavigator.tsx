import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PrayerTimesScreen from '../screens/PrayerTimesScreen';
import QuranScreen from '../screens/QuranScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BottomTabBar from '../components/BottomTabBar';

const Tab = createBottomTabNavigator();

const tabs = [
  {
    key: 'prayer',
    label: 'Prayer',
    icon: '☪',
  },
  {
    key: 'quran',
    label: 'Quran',
    icon: '📖',
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: '⚙',
  },
];

export default function BottomTabNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => (
        <BottomTabBar
          tabs={tabs}
          activeTab={state.routes[state.index].name}
          onTabPress={key => {
            navigation.navigate(key);
          }}
        />
      )}
    >
      <Tab.Screen
        name="prayer"
        component={PrayerTimesScreen}
      />

      <Tab.Screen
        name="quran"
        component={QuranScreen}
      />

      <Tab.Screen
        name="settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}
