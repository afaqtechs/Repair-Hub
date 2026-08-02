import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HeroCards = () => {
    const router = useRouter();
    const { isDark } = useTheme();

    const cards = [
        { label: "Spare Parts", description: "Find repair parts", key: "parts", icon: "hardware-chip-outline", route: "/(root)/(parts)" },
        { label: "Services", description: "Hire technicians", key: "services", icon: "construct-outline", route: "/(root)/(services)" },
        { label: "Requests", description: "Post repair jobs", key: "requests", icon: "document-text-outline", route: "/requests" },
    ];

    return (
        <View className="mt-4 px-1">
            <Text className="text-[18px] font-manrope-semibold text-text dark:text-text-dark mb-3">
                What are you looking for?
            </Text>
            <View className="flex-row gap-3">
                {cards.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        activeOpacity={0.8}
                        onPress={() => router.push(item.route as any)}
                        className="flex-1 rounded-lg p-3 bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                    >
                        <View className="w-11 h-11 rounded-xl items-center justify-center bg-primary-light dark:bg-primary-dark mb-3">
                            <Ionicons name={item.icon as any} size={23} color={isDark ? "#C4B5FD" : "#5B3DF5"} />
                        </View>
                        <Text className="text-[14px] font-manrope-semibold text-text dark:text-text-dark">
                            {item.label}
                        </Text>
                        <Text className="mt-1 text-[11px] font-manrope-regular text-text-muted dark:text-text-darkMuted">
                            {item.description}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HeroCards;