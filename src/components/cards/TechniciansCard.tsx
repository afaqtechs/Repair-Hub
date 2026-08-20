
import HTMLRenderer from "@/src/components/ui/HTMLRenderer";
import { usePresenceStatus } from "@/src/context/PresenceContext";
import { Technician } from "@/types/profiles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TechniciansCardProps {
    techncicians: Technician & {
        distance?: number | null;
    };
}

const TechniciansCard = ({ techncicians }: TechniciansCardProps) => {
    const router = useRouter();
    const { isUserOnline } = usePresenceStatus();

    const {
        id,
        first_name,
        last_name,
        profile_image_url,
        rating_avg,
        bio: desc,
        distance,
    } = techncicians;

    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();

    const rawBio = desc?.trim() || "Professional Technician";

    const bio =
        rawBio.length > 30
            ? `${rawBio.substring(0, 50).trim()}...`
            : rawBio;

    const isOnline = isUserOnline(id)
    return (
        <View
            className="w-[200px] h-[285px] flex-col justify-between mr-3 rounded-xl border border-border bg-card/50 p-3"
        >
            {/* Profile Image */}
            <View className="flex-col gap-3">
                <View className="relative flex-row items-center justify-center">
                    <View className="w-[120px] h-[120px] rounded-full overflow-hidden bg-bg border border-border">
                        <Image
                            source={
                                profile_image_url
                                    ? { uri: profile_image_url }
                                    : require("@/assets/ui/placeholder_person_photo.png")
                            }
                            resizeMode="cover"
                            className="w-full h-full"
                        />
                    </View>

                    {/* Availability */}
                    
                </View>

                {/* Name + Bio */}
                <View className="mt-2.5 items-start">
                    <View className="flex-row justify-between items-center">
                        <Text
                        numberOfLines={1}
                        className="flex-1 text-[12px] font-manrope-bold text-text"
                    >
                        {fullName || "Technician"}
                    </Text>
                    {isOnline && (
                        <View className='flex-row gap-1 items-center'>
                            <View className='h-3 w-3 rounded-full bg-success' />
                            <Text className='text-success text-xs'>(online)</Text>
                        </View>
                    )}
                    </View>

                    {/* Fixed bio height */}
                    <View className="h-[28px] w-full mt-1 overflow-hidden">
                        <HTMLRenderer
                            html={bio}
                            fontSize={11}
                            lineHeight={14}
                        />
                    </View>
                </View>
            </View>

            {/* Rating + Distance */}
            <View className="flex-col gap-3 items-end">
                <View className="w-full flex-row items-center mt-3">
                    <View className="flex-1 flex-row items-center">
                        <Ionicons
                            name="star"
                            size={14}
                            color="#F59E0B"
                        />

                        <Text className="ml-1 text-[11px] font-manrope-bold text-text">
                            {Number(rating_avg ?? 0).toFixed(1)}
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Ionicons
                            name="location-outline"
                            size={14}
                            color="#8B8B96"
                        />

                        {distance !== null && distance !== undefined && (
                            <Text className="ml-0.5 text-[11px] font-manrope-medium text-text">
                                {distance < 1
                                    ? `${Math.round(distance * 1000)} m`
                                    : `${distance.toFixed(1)} km away`}
                            </Text>
                        )}
                    </View>
                </View>

                {/* View Profile */}
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="mt-auto w-full p-3 rounded-md bg-primary items-center justify-center"
                    onPress={() =>
                        router.push({
                            pathname: "/(pages)/technician/[id]",
                            params: { id: String(id) },
                        })
                    }
                >
                    <Text className="text-[10px] font-manrope-bold text-white">
                        View Profile
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default TechniciansCard;
