import HomeScreen from '@/src/screens/home/HomeScreen';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomePage = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom + 64 }}
      className="flex-1 bg-bg"
    >
      <HomeScreen />
    </View>
  )
}

export default HomePage;