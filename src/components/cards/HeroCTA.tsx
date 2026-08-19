
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    ImageBackground,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const HeroCTA = () => {

    const backgroundImage = require("@/assets/ui/background/dark_cta_background.png")

    return (
        <ImageBackground
            source={backgroundImage}
            resizeMode="cover"
            className="w-full h-[155px] overflow-hidden rounded-2xl"
        >
            {/* Content */}
            <View className="flex-1 justify-center px-4">
                <Text
                    className={`text-[10px] font-manrope-medium text-white`}
                >
                    Need a repair?
                </Text>

                <Text
                    numberOfLines={2}
                    className={`mt-1 max-w-[170px] text-[18px] leading-[22px] font-manrope-bold text-white`}
                >
                    Find trusted{"\n"}technicians near you
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    className="mt-3 h-9 px-3.5 rounded-lg bg-primary flex-row items-center self-start"
                >
                    <Text className="text-[10px] font-manrope-bold text-white">
                        Find a Technician
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={14}
                        color="#FFFFFF"
                        style={{ marginLeft: 8 }}
                    />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

export default HeroCTA;