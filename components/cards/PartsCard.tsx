import { useTheme } from '@/context/ThemeContext';
import { useSavedPart } from '@/hooks/useSavedPart';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const PartsCard = ({ part, onUnsave, showSave = false, showListView = false, index }: {
    part: Part;
    onUnsave?: () => void;
    showListView?: boolean;
    showSave?: boolean;
    index?: number;
}) => {
    const router = useRouter();
    const { isSaved, saveLoading, toggleSave } = useSavedPart(
        part.id,
        onUnsave
    );

    const { isDark } = useTheme();

    const imageSource = require("@/assets/ui/heroimage.png");

    const isListView = showListView;
    const isFeatured = index === 0;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
                router.push({
                    pathname: "/(root)/(parts)/part/[id]",
                    params: { id: part.id },
                })
            }
            className={`m-1 ${isListView ? "w-full flex-row" : "flex-col"} bg-card dark:bg-card-dark p-4 border border-border dark:border-border-dark overflow-hidden rounded-md`}
            style={{ elevation: 0 }}
        >
            <View className={`${isListView
                ? "w-[120px] h-[120px]"
                : isFeatured
                    ? "w-full h-72"
                    : "w-full h-48"
                } relative overflow-hidden`}>
                <Image
                    source={imageSource}
                    className="w-full h-full rounded-xl"
                    resizeMode="cover"
                />
                {(showSave && !isListView) && (
                    <TouchableOpacity
                        onPress={toggleSave}
                        disabled={saveLoading}
                        className="absolute top-2 right-2"
                        style={{ elevation: 4 }}
                    >
                        <Ionicons name="heart" size={20} color={isSaved ? "#EF4444" : isDark ? "#F8FAFC" : "#000000"} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Content Section */}
            <View className={`${isListView ? "flex-1 justify-between" : ""}`}>
                <View>
                    <Text className="text-success font-black text-xl">
                        ETB {part?.price?.toLocaleString() ?? 0}
                    </Text>
                    <Text
                        numberOfLines={2}
                        className="text-sm font-manrope-semibold text-text dark:text-text-dark leading-5 min-h-[40px]"
                    >
                        {part.title ?? "Untitled Part"}
                    </Text>

                    <View className="flex-row items-center mt-1">
                        <Ionicons name="business-outline" size={12} color="#9CA3AF" />
                        <Text
                            numberOfLines={1}
                            className="text-xs text-text-muted dark:text-text-darkMuted ml-1 flex-1"
                        >
                            {part.brand ?? "Unknown Brand"}
                            {part.model ? ` • ${part.model}` : ""}
                        </Text>
                    </View>

                    {part?.technician?.city && (
                        <View className="flex-row items-center mt-0.5">
                            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                            <Text
                                numberOfLines={1}
                                className="text-xs text-text-muted dark:text-text-darkMuted ml-1"
                            >
                                {part.technician.city}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border/30 dark:border-border-dark/30">
                    <View className="flex-row items-center">
                        <View className="w-5 h-5 rounded-full bg-primary-light dark:bg-primary-dark items-center justify-center">
                            <Text className="text-[8px] text-primary font-bold">
                                {part?.condition?.name?.[0] || 'N'}
                            </Text>
                        </View>
                        <Text className="text-[10px] text-gray-400 ml-1.5">
                            {part?.condition?.name || 'New'}
                        </Text>
                    </View>


                </View>

                {(showSave && isListView) && (
                    <TouchableOpacity
                        onPress={toggleSave}
                        disabled={saveLoading}
                        className="absolute top-3 right-3"
                    >
                        <Ionicons name="heart" size={20} color={isSaved ? "#EF4444" : isDark ? "#F8FAFC" : "#000000"} />
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
}

export default PartsCard;