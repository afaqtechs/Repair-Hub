import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

const EmptyState = ({
    title,
    description,
    icon = "search-outline",
}: EmptyStateProps) => {
    return (
        <View className="w-full rounded-xl items-center justify-center py-12 px-6 ">
            {/* Icon */}
            <View className="w-16 h-16 rounded-2xl items-center justify-center bg-primary/10 dark:bg-primary/15">
                <Ionicons
                    name={icon}
                    size={30}
                    color="#3B82F6"
                />
            </View>

            {/* Title */}
            <Text
                numberOfLines={2}
                className="mt-4 text-[16px] font-manrope-bold text-text dark:text-text-dark text-center"
            >
                {title}
            </Text>

            {/* Description */}
            <Text
                numberOfLines={3}
                className="mt-1.5 max-w-[280px] text-[11px] leading-[17px] font-manrope-medium text-text-muted dark:text-text-darkMuted text-center"
            >
                {description}
            </Text>
        </View>
    );
};

export default EmptyState;