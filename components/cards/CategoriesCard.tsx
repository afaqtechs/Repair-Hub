import { Category } from "@/types/category";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ListCategory = ({
    category,
    total,
    index
}: {
    category: Category;
    total: number;
    index: number;
}) => {
    return (

        <TouchableOpacity
            key={category.id}
            activeOpacity={0.7}
            className="m-1 h-[88px] rounded-lg bg-card dark:bg-card-dark border border-border dark:border-border-dark items-center justify-between p-2 overflow-hidden"
        >
            <View className="w-full h-[55px] items-center justify-center">
                <Image
                    source={require("@/assets/ui/heroimage.png")}
                    resizeMode="contain"
                    className="w-[48px] h-[48px] rounded-lg"
                />

                {total > 8 && index >= 7 && (
                    <View className="absolute inset-0 bg-black/40 rounded-xl items-center justify-center">
                        <Text className="text-white text-sm font-bold">
                            +{total - 7}
                        </Text>
                    </View>
                )}
            </View>
            <Text
                numberOfLines={1}
                className="text-[11px] font-manrope-semibold text-center w-full mt-1 text-text-secondary dark:text-text-darkSecondary"
            >
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

export default ListCategory;