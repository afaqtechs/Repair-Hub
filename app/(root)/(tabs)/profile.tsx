
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { userStore } from "@/store";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const menuItems: {
    title: string;
    icon: IconName;
    path: string;
}[] = [
        {
            title: "My Services",
            icon: "construct-outline",
            path: "/(root)/profile/myServices/myServices",
        },
        {
            title: "My Parts",
            icon: "cube-outline",
            path: "/(root)/profile/myParts/myParts",
        },
        {
            title: "Saved Items",
            icon: "heart-outline",
            path: "/(root)/profile/savedItems/savedItems",
        },
        {
            title: "Reviews",
            icon: "star-outline",
            path: "/(root)/profile/Reviews",
        },
        {
            title: "Legal Documents",
            icon: "document-text-outline",
            path: "/(root)/profile/documents",
        },
        {
            title: "Settings",
            icon: "settings-outline",
            path: "/(root)/profiles/settings",
        },
    ];

const Profile = () => {
    const { user: loggedInUser } = useAuth();
    const router = useRouter();
    const { isDark } = useTheme();

    const id = loggedInUser?.id;

    const { technician, loadingTechnician, technicianError, fetchTechnician, } = userStore();

    useEffect(() => {
        fetchTechnician(id?.toString() || "");
    }, [id, fetchTechnician]);

    if (loadingTechnician) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (technicianError) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg dark:bg-bg-dark">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{technicianError}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => fetchTechnician(id)}>
                        <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!technician) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <Text className="text-gray-500">User not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView
            edges={["left", "right"]}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            {/* Header Gradient */}
            <View className="relative bg-primary h-[250px] px-5 pt-12 pb-8">

                <View className="flex-row justify-between items-center">

                    <Text className="text-white text-2xl font-bold">
                        Profile
                    </Text>
                    <TouchableOpacity
                        className="bg-white/20 px-4 p-2 rounded-full"
                    >
                        <Text className="text-white">Update Profile</Text>
                    </TouchableOpacity>
                </View>

                <View className="absolute -bottom-10 left-10 z-10 items-center mt-5">

                    <Image
                        source={require("@/assets/ui/placeholder_person_photo.png")}
                        className="w-40 h-40 rounded-full"
                    />

                </View>
            </View>
            <View className="flex-1">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {/* Profile Card */}
                    <View className="-mt-6 bg-card dark:bg-card-dark pt-20 px-5 pb-6 shadow-gray-200/40">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1 pr-2">
                                <Text className="text-2xl font-bold text-text dark:text-text-dark">
                                    {technician?.first_name}  {technician?.last_name}
                                </Text>
                                <View className="flex-row items-center">
                                    <Text numberOfLines={3} className="text-gray-400 text-xs ml-0.5">
                                        {technician?.bio?.substring(0, 30)}
                                    </Text>
                                </View>
                            </View>

                            <View className="px-3 py-1.5 rounded-full flex-row items-center bg-green-100">
                                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                <Text className="text-emerald-700 text-xs font-semibold ml-1">
                                    {technician?.verification_status}
                                </Text>
                            </View>
                        </View>

                        {/* Rating */}
                        <View className="flex-row items-center mt-3">
                            <View className="flex-row items-center bg-yellow-50 px-3 py-1 rounded-full">
                                <Ionicons name="star" size={14} color="#F59E0B" />
                                <Text className="ml-1.5 text-gray-700 font-medium text-sm">
                                    {technician?.rating_avg}
                                </Text>
                            </View>

                            {/* Location */}
                            <View className="flex-row items-center ml-3">
                                <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-xs ml-0.5">
                                    {technician?.address}
                                </Text>
                                <Text className="text-gray-400 text-xs ml-0.5">
                                    {technician?.city}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between mt-5 pt-5 border-t border-border dark:border-border-dark">
                            <View className="items-center flex-1">
                                <View className="bg-blue-50 dark:bg-bg-dark px-2.5 py-0.5 rounded-xl mb-1">
                                    <Text className="text-text-secondary dark:text-text-darkSecondary text-[8px] font-bold uppercase tracking-wider">
                                        Rat.
                                    </Text>
                                </View>
                                <Text className="font-bold text-xl text-text dark:text-text-dark">
                                    {technician?.rating_count}+
                                </Text>
                                <Text className="text-text-muted dark:text-text-darkMuted text-[10px] mt-0.5">
                                    Ratings Count.
                                </Text>
                            </View>
                            <View className="w-px h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent self-center" />
                            <View className="items-center flex-1">
                                <View className="bg-blue-50 dark:bg-bg-dark px-2.5 py-0.5 rounded-xl mb-1">
                                    <Text className="text-text-secondary dark:text-text-darkSecondary text-[8px] font-bold uppercase tracking-wider">
                                        Exp.
                                    </Text>
                                </View>
                                <Text className="font-bold text-xl text-text dark:text-text-dark">
                                    {technician?.experience_years}+
                                </Text>
                                <Text className="text-text-muted dark:text-text-darkMuted text-[10px] mt-0.5">
                                    Years Exp.
                                </Text>
                            </View>
                            <View className="w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent self-center" />

                            <View className="items-center flex-1">
                                <View className="bg-blue-50 dark:bg-bg-dark px-2.5 py-0.5 rounded-xl mb-1">
                                    <Text className="text-text-secondary dark:text-text-darkSecondary text-[8px] font-bold uppercase tracking-wider">
                                        Exp.
                                    </Text>
                                </View>
                                <Text className="font-bold text-xl text-text dark:text-text-dark">
                                    {technician?.experience_years}+
                                </Text>
                                <Text className="text-text-muted dark:text-text-darkMuted text-[10px] mt-0.5">
                                    Years Exp.
                                </Text>
                            </View>
                        </View>
                    </View>


                    <View className="bg-card dark:bg-card-dark mt-5 p-5 shadow-sm">
                        <Text className="text-xl font-manrope-bold text-text dark:text-text-dark">
                            Quick Links
                        </Text>

                        <Text className="text-sm font-manrope-medium text-text-muted dark:text-text-darkMuted mt-1">
                            Access important options quickly
                        </Text>

                        <View className="mt-5">
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => router.push(item.path as Href)}
                                    activeOpacity={0.7}
                                    className="flex-row items-center justify-between py-4"
                                >
                                    <View className="flex-row items-center flex-1">

                                        <View className="w-11 h-11 rounded-2xl bg-bg dark:bg-bg-dark items-center justify-center">
                                            <Ionicons
                                                name={item.icon}
                                                size={20}
                                                color={isDark ? "#94A3B8" : "#667085"}
                                            />
                                        </View>

                                        <Text className="ml-4 text-base font-manrope-semibold text-text dark:text-text-dark">
                                            {item.title}
                                        </Text>
                                    </View>

                                    <Ionicons
                                        name="chevron-forward"
                                        size={18}
                                        color={isDark ? "#94A3B8" : "#667085"}
                                    />

                                    {index !== menuItems.length - 1 && (
                                        <View className="absolute bottom-0 left-[60px] right-0 h-[1px] bg-bg/50 dark:bg-bg-dark/50" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                </ScrollView>

            </View>

        </SafeAreaView>
    );
};

export default Profile;