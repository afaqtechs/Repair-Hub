
import ServiceForm from '@/src/screens/create/ServiceForm';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreateService = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top }}
            className="flex-1 bg-bg-dark"
        >
            <View className="px-5 pt-2 pb-5 border-b border-border-dark">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/create")}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        Add Service
                    </Text>
                </View>
            </View>

            <ServiceForm isEdit={false} />

        </View>
    )
}

export default CreateService