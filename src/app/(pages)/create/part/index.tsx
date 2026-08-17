import { useTheme } from '@/src/context/ThemeContext';
import PartForm from '@/src/screens/create/PartForm';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreatePart = () => {
    const router = useRouter();
    const { isDark } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            {/* Header */}
            <View className="px-5 pt-2 pb-5 border-b border-border dark:border-border-dark">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className={`w-10 h-10 items-center justify-center rounded-2xl ${isDark
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200'
                            } border`}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color={isDark ? '#F8FAFC' : '#171A2B'}
                        />
                    </TouchableOpacity>

                    <Text
                        className={`ml-2 text-[20px] font-manrope-semibold ${isDark ? 'text-white' : 'text-gray-900'
                            }`}
                    >
                        Add Spare Parts
                    </Text>
                </View>
            </View>

            <PartForm
                isEdit={false}
            />
        </View>
    );
};

export default CreatePart;