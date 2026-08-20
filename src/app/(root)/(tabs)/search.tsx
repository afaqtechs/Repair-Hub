import SearchScreen from '@/src/screens/search/SearchScreen';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SearchPage = () => {

    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom + 48 }}
            className="flex-1 bg-bg"
        >
            <SearchScreen />
        </View>
    )
}

export default SearchPage