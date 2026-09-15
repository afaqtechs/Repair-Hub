
import PartForm from '@/src/screens/create/PartForm';
import { useCreatePartStore } from '@/store/useCreatePartStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CreatePart = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const {
        reset,
    } = useCreatePartStore();

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
            className="flex-1 bg-bg"
        >
            {/* Header */}
            {/* Header */}
            <View className="px-5 pt-2 pb-5 border-b border-border">
                <View className="flex-row items-center justify-between">
                    {/* Back + title */}
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                            className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card"
                        >
                            <Ionicons
                                name="arrow-back"
                                size={20}
                                color="#1F2937"
                            />
                        </TouchableOpacity>

                        <Text className="ml-2 text-[18px] font-manrope-semibold text-text">
                            Add Spare Parts
                        </Text>
                    </View>

                    {/* Reset */}
                    <TouchableOpacity
                        onPress={reset}
                        activeOpacity={0.7}
                        hitSlop={8}
                        className="h-10 w-10 items-center justify-center rounded-2xl border border-border bg-card"
                    >
                        <Ionicons
                            name="refresh-outline"
                            size={20}
                            color="#EF4444"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <PartForm
                isEdit={false}
            />
        </View>
    );
};

export default CreatePart;