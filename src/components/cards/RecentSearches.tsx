import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type RecentSearchesProps = {
    searches: string[];
    onPress: (search: string) => void;
    onRemove: (search: string) => void;
};

const RecentSearches = ({
    searches,
    onPress,
    onRemove,
}: RecentSearchesProps) => {
    if (searches.length === 0) {
        return null;
    }

    const imageSource = require("@/assets/ui/background/service_image.jpg");

    return (
        <View className="gap-3">
            {searches.map((item, index) => (
                <TouchableOpacity
                    key={`${item}-${index}`}
                    onPress={() => onPress(item)}
                    className="flex-row items-center justify-between py-1"
                    activeOpacity={0.7}
                >
                    <View className="flex-row items-center flex-1">
                        <View className="w-8 h-8 rounded-full items-center justify-center overflow-hidden bg-input-dark">
                            <Image
                                source={imageSource}
                                className="w-8 h-8"
                                resizeMode="cover"
                            />
                        </View>

                        <Text
                            numberOfLines={1}
                            className="ml-3 text-text-dark font-medium flex-1"
                        >
                            {item}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => onRemove(item)}
                        className="p-2"
                        hitSlop={8}
                    >
                        <Ionicons
                            name="close"
                            size={18}
                            color="#EF4444"
                        />
                    </TouchableOpacity>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default RecentSearches;