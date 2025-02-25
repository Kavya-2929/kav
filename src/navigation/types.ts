import type { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Menu: undefined;
  Cart: undefined;
  Tabs: undefined;
};

// Navigation type for HomeScreen
export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Menu'>;
