import CreateScreen from '@/src/screens/create/CreateScreen';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreatePage = () => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={{ flex: 1, paddingTop: insets.top }}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            <CreateScreen />
        </View>
    )
}

export default CreatePage