// App.tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import SetScreen from './src/screens/SetScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SetScreen />
    </SafeAreaView>
  );
}
