import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PrayerTimesScreen from '../screens/PrayerTimesScreen';

export type RootStackParamList = {
  PrayerTimes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PrayerTimes"
        component={PrayerTimesScreen}
        options={{ title: 'Prayer Times' }}
      />
    </Stack.Navigator>
  );
}