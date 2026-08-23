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
                className="w-[94px] h-[94px] flex-col rounded-xl items-center justify-center bg-card p-3"
            >
                <Image
                    source={category?.icon_url ? { uri: category?.icon_url } : require("@/assets/ui/background/category_image.jpg")}
                    resizeMode="cover"
                    className="w-full h-[80%] rounded-xl"
                />

                {isOverflow && (
                    <View className="absolute inset-0 bg-black/45 rounded-xl items-center justify-center">
                        <Text className="text-white text-base font-manrope-bold">
                            +{total - 11}
                        </Text>
                    </View>
                )}

                <Text
                    numberOfLines={2}
                    className="text-[11px] leading-[14px] font-manrope-medium text-center w-[72px] mt-[6px] text-text"
                >
                    {category.name.substring(0, 10)}
                </Text>
            </View>

            {/* Category name */}
        </TouchableOpacity>
    );
};

export default ListCategory;