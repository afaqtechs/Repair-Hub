import PartsCard from '@/src/components/cards/PartsCard';
import ServiceCard from '@/src/components/cards/ServiceCard';
import EmptyState from '@/src/components/ui/EmptyState';
import HTMLRenderer from '@/src/components/ui/HTMLRenderer';
import { useAuth } from '@/src/context/AuthContext';
import { usePresenceStatus } from '@/src/context/PresenceContext';
import { useTheme } from '@/src/context/ThemeContext';
import { usePartByTechnician, useServicesByTechnician, useTechnician, useTechnicianLocation } from '@/src/hooks';
import { getStatusColor, getStatusText } from '@/src/utils/statusStyles';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

const TechnicianDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { isDark } = useTheme();
    const { user } = useAuth();
    const { isUserOnline } = usePresenceStatus();

    const insets = useSafeAreaInsets();

    const loggedInUserId = user?.id;
    const isOnline = isUserOnline(id);

    const [activeTab, setActiveTab] = useState<string>("parts");

    const {
        data: technician,
        isLoading: loadingTechnician,
        error: technicianError,
        refetch: fetchTechnician
    } = useTechnician(id);

    const {
        data: parts,
        error: partError,
        refetch: fetchParts
    } = usePartByTechnician(id);

    const {
        data: services,
        error: serviceError,
        refetch: fetchServices
    } = useServicesByTechnician(id);

    const {
        data: technicianLocation,
        error: loadMapError,
        refetch: loadMap
    } = useTechnicianLocation(id);

    const distance = technicianLocation?.distance ?? null;
    const location = technicianLocation
        ? {
            latitude: technicianLocation.latitude,
            longitude: technicianLocation.longitude,
        }
        : null;

    const licenseStatus = technician?.verification_status || 'pending';

    const tabs =
        [
            {
                name: "Parts",
                key: "parts"
            },
            {
                name: "Services",
                key: "services"
            }
        ]

    const latitude = location?.latitude;
    const longitude = location?.longitude;

    const mapUrl =
        latitude !== null &&
            longitude !== null &&
            latitude !== undefined &&
            longitude !== undefined
            ? `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.003}%2C${latitude - 0.003}%2C${longitude + 0.003}%2C${latitude + 0.003}&layer=mapnik&marker=${latitude}%2C${longitude}`
            : null;

    const isOwner = Boolean(loggedInUserId) && loggedInUserId === technician?.id;

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
                    <Text className="text-gray-500 text-sm text-center mt-2">{technicianError.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => fetchTechnician()}>
                        <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1, paddingBottom: insets.bottom }} className="flex-1 bg-bg dark:bg-bg-dark">
            <View className="relative bg-bg dark:bg-bg-dark h-[250px] px-5 pt-12 pb-8">
                <View className="absolute -bottom-10 left-10 z-10 items-center mt-5">
                    <Image
                        source={
                            technician?.profile_image_url
                                ? { uri: technician?.profile_image_url }
                                : require("@/assets/ui/placeholder_person_photo.png")
                        }
                        className="w-40 h-40 rounded-full"
                    />
                </View>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-card dark:bg-card-dark rounded-full items-center justify-center"
                    style={{ elevation: 3 }}
                >
                    <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                </TouchableOpacity>

                {isOnline && (
                    <View className='absolute z-10 bottom-0 right-10 flex-row gap-1 items-center'>
                        <View className='h-2 w-2 rounded-full bg-success' />
                        <Text className='text-success text-xs'>(online)</Text>
                    </View>
                )}
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View className='px-5'>
                    <View className="-mt-6 bg-card dark:bg-card-dark pt-20 px-5 rounded-xl pb-6 shadow-sm">
                        <View className="flex-row justify-between items-start">
                            <View className="flex-1 pr-2">
                                <Text className="text-2xl font-bold text-text dark:text-text-dark">
                                    {technician?.first_name}  {technician?.last_name}
                                </Text>
                                <View className="flex-row items-center">
                                    <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                                    <Text className="text-gray-500 text-xs ml-0.5">
                                        {technician?.address}
                                    </Text>
                                    <Text className="text-gray-500 text-xs ml-0.5">
                                        {technician?.city}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ backgroundColor: getStatusColor(licenseStatus) + '20' }} className="px-2 py-1 rounded-full">
                                <Text style={{ color: getStatusColor(licenseStatus) }} className="text-[10px] font-manrope-medium">
                                    {getStatusText(licenseStatus)}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-3 mt-3">
                            <View className="flex-row items-center bg-yellow-50 px-3 py-1 rounded-full">
                                <Ionicons name="star" size={14} color="#F59E0B" />
                                <Text className="ml-1.5 text-gray-700 font-medium text-sm">
                                    {technician?.rating_avg}
                                </Text>
                            </View>

                            {/* Location */}
                            <View className="flex-row gap-2 items-center flex-1">
                                <Text className="font-bold text-xl text-text dark:text-text-dark">
                                    {technician?.experience_years}+
                                </Text>
                                <Text className="text-gray-500 text-[10px] mt-0.5">
                                    Years Exp.
                                </Text>
                            </View>
                        </View>

                    </View>


                    <View className="w-full mt-5 p-5 bg-card dark:bg-card-dark rounded-xl shadow-xs">
                        <Text className="text-lg text-text dark:text-text-dark font-manrope-bold mb-4">
                            Details
                        </Text>
                        <View className="flex-row flex-wrap justify-between gap-y-5">

                            <View className="w-[48%]">
                                <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                    {technician?.phone || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Phone
                                </Text>
                            </View>

                            {(distance !== null && distance !== undefined && !isOwner) && (
                                <View className="w-[48%]">
                                    <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                        {distance} km away
                                    </Text>
                                    <Text className="text-xs text-gray-500 font-manrope">
                                        Distance(km)
                                    </Text>
                                </View>
                            )}

                            <View className="w-[48%]">
                                <View className={`self-start px-3 py-1 rounded-full ${technician?.is_available
                                    ? "bg-emerald-100"
                                    : "bg-red-100"
                                    }`}>
                                    <Text className={`text-xs font-manrope-semibold ${technician?.is_available
                                        ? "text-emerald-600"
                                        : "text-red-600"
                                        }`}>
                                        {technician?.is_available ? "Available" : "Unavailable"}
                                    </Text>
                                </View>

                                <Text className="text-xs text-gray-500 font-manrope mt-1">
                                    Status
                                </Text>
                            </View>
                        </View>
                    </View>

                    {technician?.bio && (
                        <View className="w-full mt-5 p-5 bg-card dark:bg-card-dark rounded-xl shadow-xs">
                            <Text className="text-lg text-text dark:text-text-dark font-manrope-bold mb-3">
                                Bio
                            </Text>
                            <HTMLRenderer
                                html={technician.bio}
                                fontSize={16}
                                lineHeight={24}
                            />
                        </View>
                    )}

                    {(mapUrl && technician) && (
                        <>
                            {loadMapError ? (
                                <View className="flex-1 items-center justify-center px-4">
                                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                                    <Text className="text-gray-500 text-sm text-center mt-2">{loadMapError.message}</Text>
                                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => loadMap()}>
                                        <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View className="w-full mt-5 p-5 bg-card dark:bg-card-dark rounded-xl shadow-xs">
                                    <Text className="text-lg text-text dark:text-text-dark font-manrope-bold">
                                        Location
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/(pages)/technician/map",
                                                params: {
                                                    latitude: location?.latitude,
                                                    longitude: location?.longitude,
                                                    title: `${technician?.first_name} ${technician.last_name}`,
                                                    address: `${technician?.address ? technician?.address : ""} ${technician.city}`,
                                                },
                                            })
                                        }
                                        activeOpacity={0.9}
                                        className="rounded-2xl overflow-hidden my-3"
                                        style={{ height: 200 }}
                                    >
                                        <WebView
                                            source={{ uri: mapUrl }}
                                            style={{ flex: 1 }}
                                            scrollEnabled={false}
                                            pointerEvents="none"
                                        />
                                        <View className="absolute bottom-3 right-3 bg-card dark:bg-card-dark px-3 py-1 rounded-full flex-row items-center gap-1">
                                            <Ionicons name="expand-outline" size={12} color="#374151" />
                                            <Text className="text-gray-600 text-xs font-medium">
                                                Tap to expand
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>)}
                        </>

                    )}

                    <View className="w-full mt-5 p-5 bg-card dark:bg-card-dark rounded-xl items-center justify-center shadow-xs">
                        {!isOwner && (
                            <View className="flex-row gap-3">

                                <TouchableOpacity
                                    className="flex-1 border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-primary font-manrope-semibold">
                                        Chat With {technician?.first_name}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 bg-primary border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-white font-manrope-semibold">
                                        Quick Call
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {isOwner && (
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    className="flex-1 border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-primary font-manrope-semibold">
                                        Update Info
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 bg-primary border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-white font-manrope-semibold">
                                        Go To Profiles
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
                <View className="w-full mt-5 bg-card dark:bg-card-dark shadow-xs">
                    <View className="flex-row px-5 mt-6">
                        {tabs.map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setActiveTab(tab.key)}
                                className={`flex-1 pb-3 items-center ${activeTab === tab.key
                                    ? "border-b-2 border-blue-500"
                                    : ""
                                    }`}
                            >
                                <Text
                                    className={`font-medium ${activeTab === tab.key
                                        ? "text-blue-500"
                                        : "text-gray-500"
                                        }`}
                                >
                                    {tab.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="flex-1 mt-2">
                        {activeTab === "parts" ? (

                            <>
                                {partError ? (
                                    <View className="flex-1 items-center justify-center px-4">
                                        <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                                        <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                                        <Text className="text-gray-500 text-sm text-center mt-2">{partError.message}</Text>
                                        <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => fetchParts()}>
                                            <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <FlashList
                                        data={parts}
                                        keyExtractor={(item) => item.id}
                                        contentContainerStyle={{ padding: 10, paddingHorizontal: 16, paddingBottom: 100 }}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={1}
                                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                                        renderItem={({ item }) => (

                                            <PartsCard
                                                part={item}
                                                showListView
                                                showSave
                                            />
                                        )}
                                        ListEmptyComponent={
                                            <View className="flex-1 items-center justify-center py-24">
                                                <EmptyState title="No Parts" description="No parts here" />
                                            </View>}
                                    />)}
                            </>
                        ) : (
                            <>
                                {serviceError ? (
                                    <View className="flex-1 items-center justify-center px-4">
                                        <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                                        <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                                        <Text className="text-gray-500 text-sm text-center mt-2">{serviceError.message}</Text>
                                        <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => fetchServices()}>
                                            <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <FlashList
                                        data={services}
                                        keyExtractor={(item) => item.id}
                                        contentContainerStyle={{ padding: 10, paddingHorizontal: 16, paddingBottom: 100 }}
                                        showsVerticalScrollIndicator={false}
                                        numColumns={1}
                                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                                        renderItem={({ item }) => (
                                            <ServiceCard
                                                service={item}
                                                showListView
                                                showSave
                                            />
                                        )}
                                        ListEmptyComponent={
                                            <View className="flex-1 items-center justify-center py-24">
                                                <EmptyState title="No Services" description="No services here" />
                                            </View>
                                        }
                                    />)}
                            </>
                        )}

                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default TechnicianDetail