import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import QuranReaderScreen from '../screens/QuranReaderScreen';

export type RootStackParamList = {
  Tabs: undefined;
  QuranReader: {
    surahId: number;
    surahName: string;
    arabicName: string;
    verses: number;
    revelationType: 'Meccan' | 'Medinan';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuranReader"
        component={QuranReaderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}