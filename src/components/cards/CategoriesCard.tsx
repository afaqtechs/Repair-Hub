import { Category } from "@/types/category";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ListCategory = ({
    category,
    total,
    index,
}: {
    category: Category;
    total: number;
    index: number;
}) => {
    const router = useRouter();

    const isOverflow = total > 12 && index >= 11;

    return (
        <TouchableOpacity
            onPress={() =>
                router.push({
                    pathname: "/(pages)/categories/category/[id]",
                    params: { id: category.id },
                })
            }
            activeOpacity={0.7}
            className="w-[100px] items-center mx-[2px]"
        >
            {/* Category square */}
            <View
                className="w-[94px] h-[94px] rounded-[14px] items-center justify-center bg-bg/50 dark:bg-bg-dark/50 border border-border dark:border-border-dark overflow-hidden"
            >
                <Image
                    source={require("@/assets/ui/background/category_image.jpg")}
                    resizeMode="cover"
                    className="w-full h-full"
                />

                {isOverflow && (
                    <View className="absolute inset-0 bg-black/45 rounded-[14px] items-center justify-center">
                        <Text className="text-white text-base font-manrope-bold">
                            +{total - 11}
                        </Text>
                    </View>
                )}
            </View>

            {/* Category name */}
            <Text
                numberOfLines={2}
                className="text-[11px] leading-[14px] font-manrope-medium text-center w-[72px] mt-[6px] text-text-secondary dark:text-text-darkSecondary"
            >
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

export default ListCategory;