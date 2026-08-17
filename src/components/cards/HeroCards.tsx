import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const HeroCards = () => {
    const router = useRouter();
    const { isDark } = useTheme();

    const cards = [
        {
            label: "Spare Parts",
            description: "Find repair parts",
            key: "parts",
            icon: "hardware-chip-outline",
            route: "/(pages)/parts",
            color: "#3B82F6",
        },
        {
            label: "Services",
            description: "Hire technicians",
            key: "services",
            icon: "construct-outline",
            route: "/(pages)/services",
            color: "#3B82F6",
        },
        {
            label: "Requests",
            description: "Post repair jobs",
            key: "requests",
            icon: "document-text-outline",
            route: "/(pages)/requests",
            color: "#3B82F6",
        },
    ];

    return (
        <View className="mt-3">
            {/* Section Header */}
            <View className="flex-row items-center justify-between mb-3.5">
                <Text className="text-base font-manrope-bold text-text dark:text-text-dark">
                    Quick Actions
                </Text>
            </View>

            {/* Cards */}
            <View className="flex-row gap-2.5">
                {cards.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        activeOpacity={0.85}
                        onPress={() =>
                            router.push(item.route as any)
                        }
                        className="flex-1"
                    >
                        <View
                            className={`h-[142px] rounded-2xl overflow-hidden border ${isDark
                                    ? "bg-card-dark/30 border-border-dark/50"
                                    : "bg-bg/50 border-border/50"
                                }`}
                        >
                            <View className="flex-1 p-3.5">
                                {/* Icon + Arrow */}
                                <View className="flex-row items-center justify-between">
                                    <View
                                        className="w-10 h-10 rounded-xl items-center justify-center"
                                        style={{
                                            backgroundColor: isDark
                                                ? "rgba(59, 130, 246, 0.12)"
                                                : "rgba(59, 130, 246, 0.08)",
                                        }}
                                    >
                                        <Ionicons
                                            name={item.icon as any}
                                            size={20}
                                            color={item.color}
                                        />
                                    </View>

                                    <View
                                        className="w-6 h-6 rounded-full items-center justify-center"
                                        style={{
                                            backgroundColor: isDark
                                                ? "rgba(59, 130, 246, 0.10)"
                                                : "rgba(59, 130, 246, 0.06)",
                                        }}
                                    >
                                        <Ionicons
                                            name="arrow-forward"
                                            size={12}
                                            color={item.color}
                                        />
                                    </View>
                                </View>

                                {/* Content */}
                                <View className="mt-auto">
                                    <Text
                                        numberOfLines={1}
                                        className="text-[12px] font-manrope-bold text-text dark:text-text-dark"
                                    >
                                        {item.label}
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        className="mt-0.5 text-[9px] font-manrope-medium text-text-muted dark:text-text-darkMuted"
                                    >
                                        {item.description}
                                    </Text>
                                </View>
                            </View>

                            {/* Bottom Accent */}
                            <View
                                className="h-[3px] w-full"
                                style={{
                                    backgroundColor: item.color,
                                    opacity: isDark ? 0.55 : 0.7,
                                }}
                            />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default HeroCards;