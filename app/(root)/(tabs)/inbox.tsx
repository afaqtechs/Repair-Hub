import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const messages = [
    {
        id: 1,
        name: "Abebe Repair",
        message: "Sure, it's still available.",
        time: "2m",
        unread: true,
        image:
            "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 2,
        name: "Dawit Tech",
        message: "Thanks! I will check it.",
        time: "10m",
        unread: false,
        image:
            "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        id: 3,
        name: "Teklu Laptop Center",
        message: "Okay, no problem.",
        time: "1h",
        unread: false,
        image:
            "https://randomuser.me/api/portraits/men/52.jpg",
    },
    {
        id: 4,
        name: "Beta Phone Fix",
        message: "Is the price negotiable?",
        time: "2h",
        unread: false,
        image:
            "https://randomuser.me/api/portraits/men/68.jpg",
    },
    {
        id: 5,
        name: "Smart Repair Hub",
        message: "Thank you!",
        time: "1d",
        unread: false,
        image:
            "https://randomuser.me/api/portraits/men/75.jpg",
    },
];

const Inbox = () => {
    const { isDark } = useTheme();

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            <View className="px-5 pt-3">

                {/* Header */}
                <View className="flex-row items-center justify-between mb-5">
                    <Text className="text-text dark:text-text-dark text-2xl font-bold">
                        Messages
                    </Text>

                    <TouchableOpacity>
                        <Ionicons
                            name="add"
                            size={28}
                            color="#5B3DF5"
                        />
                    </TouchableOpacity>
                </View>


                {/* Search */}
                <View className="h-12 bg-input dark:bg-input-dark rounded-xl flex-row items-center px-4 mb-4 border border-border dark:border-border-dark">
                    <Ionicons
                        name="search"
                        size={20}
                        color={isDark ? "#94A3B8" : "#667085"}
                    />

                    <TextInput
                        placeholder="Search messages..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-3 text-sm"
                    />
                </View>


                {/* Messages */}
                <View>
                    {messages.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            className="flex-row items-center py-4 border-b border-border/20 dark:border-border-dark/20"
                        >

                            {/* Avatar */}
                            <Image
                                source={{ uri: item.image }}
                                className="h-12 w-12 rounded-full"
                            />


                            {/* Content */}
                            <View className="flex-1 ml-3">

                                <View className="flex-row justify-between">
                                    <Text className="font-semibold text-text dark:text-text-dark">
                                        {item.name}
                                    </Text>

                                    <Text className="text-xs text-gray-400">
                                        {item.time}
                                    </Text>
                                </View>


                                <View className="flex-row items-center justify-between mt-1">

                                    <Text
                                        numberOfLines={1}
                                        className="text-sm text-gray-500 flex-1"
                                    >
                                        {item.message}
                                    </Text>

                                    {item.unread && (
                                        <View className="ml-3 h-5 w-5 rounded-full bg-[#5B3DF5] items-center justify-center">
                                            <Text className="text-white text-xs font-bold">
                                                1
                                            </Text>
                                        </View>
                                    )}

                                </View>

                            </View>

                        </TouchableOpacity>
                    ))}
                </View>

            </View>
        </SafeAreaView>
    );
};

export default Inbox;