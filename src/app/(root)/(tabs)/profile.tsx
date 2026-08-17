import ProfileScreen from '@/src/screens/profiles/ProfilesScreen';
import React from 'react';
import { View } from 'react-native';

const ProfilePage = () => {
  return (
    <View style={{ flex: 1}} className="flex-1 bg-bg dark:bg-bg-dark">
      <ProfileScreen />
    </View>
  )
}

export default ProfilePage