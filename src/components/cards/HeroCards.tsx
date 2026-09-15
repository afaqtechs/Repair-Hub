import { Condition } from "@/types/parts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PRIMARY = "#5EAE32";
const ICON_COLOR = "#5FAF35";

interface HeroCardsProps {
    visible: boolean;
    onClose: () => void;
}

const HeroCards = ({
    visible,
    onClose,
}: HeroCardsProps) => {
    const router = useRouter();

    type MenuItem = {
        label: string;
        key: string;
        icon: string;
        route: string;
        params?: {
            condition?: Condition;
        };
        isNew?: boolean;
    };

    const cards: MenuItem[] = [
        {
            label: "Spare Parts",
            key: "parts",
            icon: "cube-outline",
            route: "/(pages)/parts",
            params: {
                condition: "used",
            },
        },
        {
            label: "Services",
            key: "services",
            icon: "tools",
            route: "/(pages)/services",
        },
        {
            label: "Requests",
            key: "requests",
            icon: "file-document-outline",
            route: "/(pages)/requests",
        },
        {
            label: "New Parts",
            key: "new-parts",
            icon: "star-outline",
            route: "/(pages)/parts",
            params: {
                condition: "new",
            },
            isNew: true,
        },
    ];

    const handlePress = (item: MenuItem) => {
        onClose();

        setTimeout(() => {
            if (item.params) {
                router.push({
                    pathname: item.route as any,
                    params: item.params,
                });
            } else {
                router.push(item.route as any);
            }
        }, 150);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Overlay */}
            <Pressable
                className="flex-1 bg-black/40 justify-center items-center px-5"
                onPress={onClose}
            >
                {/* Modal */}
                <Pressable
                    className="w-full bg-card rounded-[28px] p-5"
                    onPress={(event) => event.stopPropagation()}
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-5">
                        <View>
                            <Text className="text-text text-xl font-manrope-bold">
                                Quick Access
                            </Text>

                            <Text className="text-textSecondary text-xs font-manrope mt-1">
                                What would you like to visit?
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={onClose}
                            activeOpacity={0.7}
                            className="w-9 h-9 rounded-full bg-input items-center justify-center"
                        >
                            <MaterialCommunityIcons
                                name="close"
                                size={20}
                                color="#777"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Cards */}
                    <View className="flex-row flex-wrap gap-3">
                        {cards.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                activeOpacity={0.8}
                                onPress={() => handlePress(item)}
                                className="w-[48%]"
                            >
                                <View
                                    className="h-[120px] rounded-[20px] items-center justify-center relative"
                                    style={{
                                        backgroundColor: "#F8FAF7",
                                    }}
                                >
                                    {/* NEW */}
                                    {item.isNew && (
                                        <View
                                            className="absolute top-2 right-2 px-1.5 py-[2px] rounded-full"
                                            style={{
                                                backgroundColor: PRIMARY,
                                            }}
                                        >
                                            <Text className="text-white text-[8px] font-manrope-bold">
                                                NEW
                                            </Text>
                                        </View>
                                    )}

                                    {/* Icon */}
                                    <View
                                        className="w-12 h-12 rounded-full items-center justify-center"
                                        style={{
                                            backgroundColor: "#EDF6E9",
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name={item.icon as any}
                                            size={27}
                                            color={ICON_COLOR}
                                        />
                                    </View>

                                    {/* Label */}
                                    <Text
                                        numberOfLines={2}
                                        className="mt-3 text-[13px] leading-[17px] text-center font-manrope-semibold text-text"
                                    >
                                        {item.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default HeroCards;