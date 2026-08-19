import React, { useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchType = "parts" | "services" | "requests";

type EmptySearchProps = {
    query?: string;
    type: SearchType;
    onSuggestionPress?: (value: string) => void;
};

const EmptySearch = ({
    query = "",
    type,
    onSuggestionPress,
}: EmptySearchProps) => {
    const suggestions = useMemo(() => {
        switch (type) {
            case "parts":
                return [
                    "iPhone Screen",
                    "Samsung Screen",
                    "Laptop Battery",
                    "Phone Battery",
                    "Charging Port",
                    "Laptop Keyboard",
                    "Phone Camera",
                    "Motherboard",
                    "Laptop Screen",
                    "USB Charger",
                ];

            case "services":
                return [
                    "Screen Replacement",
                    "Battery Replacement",
                    "Charging Port Repair",
                    "Phone Repair",
                    "Laptop Repair",
                    "Software Installation",
                    "Windows Installation",
                    "Phone Unlock",
                    "Data Recovery",
                    "Virus Removal",
                ];

            case "requests":
                return [
                    "Screen Repair",
                    "Battery Problem",
                    "Charging Problem",
                    "Broken Screen",
                    "Phone Not Turning On",
                    "Laptop Repair",
                    "Software Problem",
                    "Water Damage",
                    "Keyboard Problem",
                    "Data Recovery",
                ];

            default:
                return [];
        }
    }, [type]);

    const hasQuery = query.trim().length > 0;

    return (
        <View className="flex-1 items-center px-5">

            {/* Illustration */}
            {hasQuery && (
                <>
                    <View className="w-14 h-14 rounded-full bg-primary/20 items-center justify-center">
                        <Ionicons
                            name="search-outline"
                            size={28}
                            color="#5B3DF5"
                        />
                    </View>

                    <Text className="text-text-dark text-lg font-semibold mt-5 text-center">
                        No results found
                    </Text>

                    <Text
                        numberOfLines={1}
                        className="text-sm font-semibold text-primary text-center mt-2 max-w-[280px]"
                    >
                        &quot;{query.trim()}&quot;
                    </Text>
                </>
            )}

            <View className="w-full mt-6">
                <Text className="text-xs font-semibold text-text-dark/60 mb-3">
                    Try searching for
                </Text>

                <View className="flex-row flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                        <TouchableOpacity
                            key={suggestion}
                            onPress={() =>
                                onSuggestionPress?.(suggestion)
                            }
                            activeOpacity={0.7}
                            className="flex-row items-center rounded-full border border-primary bg-card-dark p-3"
                        >
                            <Text className="text-xs font-medium text-text-dark">
                                {suggestion}
                            </Text>

                            <Ionicons
                                name="arrow-forward"
                                size={13}
                                color="#94A3B8"
                                style={{ marginLeft: 5 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default EmptySearch;