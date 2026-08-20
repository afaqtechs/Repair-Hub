import ProfileScreen from '@/src/screens/profiles/ProfilesScreen';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfilePage = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingBottom: insets.bottom + 48, flex: 1 }} className="flex-1 bg-bg">
      <ProfileScreen />
    </View>
  )
}

export default ProfilePage