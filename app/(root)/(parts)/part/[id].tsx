import { partApi } from '@/api';
import PartsCard from '@/components/cards/PartsCard';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSavedPart } from '@/hooks/useSavedPart';
import { partStore, userStore } from '@/store';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
const PAGE_SIZE = 6;
const PartDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const { isSaved, saveLoading, toggleSave } = useSavedPart(id ?? "");
    const { isDark } = useTheme();
    const router = useRouter();

    const loggedInUserId = String(user?.id);

    const [part, setPart] = useState<Part | null>(null);
    const [loadingPart, setLoadingPart] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [loadPartError, setLoadPartError] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const { technician, loadingTechnician, technicianError, fetchTechnician, } = userStore();
    const { parts, loadingParts, partError, fetchParts, } = partStore();

    const loadPart = useCallback(async () => {
        try {
            setLoadPartError("");
            setLoadingPart(true);
            const data = await partApi.getSinglePart(id);
            setPart(data);
        } catch (error: any) {
            setLoadPartError(error?.message ?? "Failed to load part");
        } finally {
            setLoadingPart(false);
        }
    }, [id])

    const technicianId = part?.technician_id ?? "";

    useEffect(() => {
        loadPart();
        fetchTechnician(technicianId);
        fetchParts();
    }, [loadPart, fetchParts, fetchTechnician, technicianId]);

    const relatedParts = useMemo(() => {
        if (!part) return [];

        return parts.filter(
            item =>
                item.id !== part.id &&
                (
                    item.category?.id === part.category?.id ||
                    item.brand === part.brand ||
                    item.model === part.model
                )
        );
    }, [parts, part]);

    const visibleRelatedParts = useMemo(() => {
        return relatedParts.slice(0, visibleCount);
    }, [relatedParts, visibleCount]);

    const loadMoreParts = useCallback(() => {
        if (visibleCount >= relatedParts.length) return;

        setVisibleCount(prev => prev + PAGE_SIZE);
    }, [visibleCount, relatedParts.length]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const error = loadPartError || technicianError || partError;
    const loading = loadingPart || loadingParts || loadingTechnician;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (error) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg dark:bg-bg-dark">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-danger-text text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-text-secondary dark:text-text-darkSecondary text-sm text-center mt-2">{error}</Text>
                    <TouchableOpacity
                        className="mt-6 bg-primary px-6 py-3 rounded-xl"
                        onPress={loadPart}
                    >
                        <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!part) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <Text className="text-text-secondary dark:text-text-darkSecondary">Part not found</Text>
            </View>
        );
    }

    const isLongDesc = (part.description?.length ?? 0) > 150;
    const displayDesc =
        expanded || !isLongDesc
            ? part.description
            : part.description?.slice(0, 150) + "...";

    const renderHeader = () => {
        return (
            <View className={`ml-1 px-4 py-3 mb-2 items-start`}>
                <Text className="text-lg text-text dark:text-text-dark font-manrope-semibold">Related Parts</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (visibleCount >= relatedParts.length) return null;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator color="#3b82f6" />
            </View>
        );
    };

    const isOwner = loggedInUserId === technicianId;

    return (
        <View className="flex-1 bg-bg dark:bg-bg-dark">

            <View>
                <View >
                    <FlatList
                        data={part.images}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                                <Image
                                    source={require("@/assets/ui/heroimage.png")}
                                    style={{ width, height: 300 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        )}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    />
                </View >

                < View className="absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full" >
                    <Text className="text-white text-xs font-medium">
                        {activeIndex + 1}/{part?.images?.length}
                    </Text>
                </ View>

                {
                    (part?.images ?? []).length > 1 && (
                        <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1">
                            {(part.images ?? []).map((_, i) => (
                                <View
                                    key={i}
                                    className={`h-1.5 rounded-full ${i === activeIndex
                                        ? "w-4 bg-white"
                                        : "w-1.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </View>
                    )
                }

                {/* Back + Save buttons */}
                <SafeAreaView className="absolute top-0 left-0 right-0">
                    <View className="flex-row items-center justify-between px-4 pt-2">
                        <TouchableOpacity
                            onPress={() => { router.back() }}
                            className="w-11 h-11 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                            style={{ elevation: 3 }}
                        >
                            <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleSave}
                            disabled={saveLoading}
                            className="absolute top-3 right-3 rounded-full bg-black/50 items-center justify-center"
                            style={{ elevation: 3 }}
                        >
                            <Ionicons
                                name="heart"
                                size={20}
                                color={isSaved ? "#EF4444" : "#FFFFFF"}
                            />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View >

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-col gap-5 mt-5 pb-32 px-5'>
                    <View className="w-full px-5 pt-5 pb-6 bg-card dark:bg-card-dark rounded-xl shadow-xs">

                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-1">
                                <Ionicons
                                    name="location"
                                    size={15}
                                    color="#5B3DF5"
                                />
                                <Text className="text-xs text-text-secondary dark:text-text-darkSecondary font-manrope-medium">
                                    {technician?.city}
                                </Text>
                            </View>
                            <View className="px-3 py-1 bg-bg/70 dark:bg-bg-dark/70 rounded-xl">
                                <Text className="text-xs text-text dark:text-text-dark font-manrope-medium">
                                    {part?.condition?.name}
                                </Text>
                            </View>

                        </View>
                        <Text
                            className="text-xl text-text dark:text-text-dark font-manrope-bold mb-2"
                            numberOfLines={2}
                        >
                            {part?.title}
                        </Text>


                        <Text className="text-2xl text-emerald-500 font-manrope-extra mb-5">
                            ETB {part?.price?.toLocaleString()}
                        </Text>

                        {!isOwner && (
                            <View className="flex-row gap-3 mb-5">

                                <TouchableOpacity
                                    className="flex-1 border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-primary font-manrope-semibold">
                                        Chat With Owner
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 bg-primary border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-white font-manrope-semibold">
                                        Call
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
                                        Update Spare Part
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 bg-danger border border-danger py-3 rounded-xl items-center"
                                >
                                    <Text className="text-white font-manrope-semibold">
                                        Remove Spare Part
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View className="w-full px-5 py-5 bg-card dark:bg-card-dark rounded-xl shadow-xs">
                        <Text className="text-lg text-text dark:text-text-dark font-manrope-bold mb-4">
                            Details
                        </Text>
                        <View className="flex-row flex-wrap justify-between gap-y-5">

                            <View className="w-[48%]">
                                <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                    {part?.brand || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Brand
                                </Text>
                            </View>

                            {/* Model */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                    {part?.model || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Model
                                </Text>
                            </View>

                            <View className="w-[48%]">
                                <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                    {part?.platform?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Platform
                                </Text>
                            </View>

                            {/* Category */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                    {part?.category?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Category
                                </Text>
                            </View>


                            {/* Condition */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text dark:text-text-dark font-manrope-semibold">
                                    {part?.condition?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Condition
                                </Text>
                            </View>

                            {/* Price */}
                            <View className="w-[48%]">
                                <Text className="text-base text-emerald-500 font-manrope-bold">
                                    ETB {part?.price?.toLocaleString() || 0}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Price
                                </Text>
                            </View>

                            {/* Availability */}
                            <View className="w-[48%]">
                                <View className={`self-start px-3 py-1 rounded-full ${part?.is_available
                                    ? "bg-success"
                                    : "bg-danger"
                                    }`}>
                                    <Text className={`text-xs font-manrope-semibold ${part?.is_available
                                        ? "text-text dark:text-text-dark"
                                        : "text-red-600"
                                        }`}>
                                        {part?.is_available ? "Available" : "Unavailable"}
                                    </Text>
                                </View>

                                <Text className="text-xs text-gray-500 font-manrope mt-1">
                                    Status
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="w-full px-5 pt-5 pb-6 bg-card dark:bg-card-dark rounded-xl shadow-xs">
                        <Text className="text-lg text-text dark:text-text-dark font-manrope-bold mb-4">
                            Description
                        </Text>
                        <Text className="text-gray-500 text-sm font-manrope leading-6 mb-1">
                            {displayDesc}
                        </Text>
                        {isLongDesc && (
                            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                                <Text className="text-blue-600 text-sm font-manrope mb-5">
                                    {expanded ? "Show less" : "Read more"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View className="w-full px-5 pt-5 pb-6 bg-card dark:bg-card-dark rounded-xl shadow-xs">
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity className='flex-1 items-center justify-center'>
                                <Text className="text-base text-red-500 font-manrope">Report</Text>
                            </TouchableOpacity>
                            <View className='h-full w-[1px] bg-gray-300 dark:bg-gray-700' />
                            <TouchableOpacity className='flex-1 items-center justify-center'>
                                <Text className="text-base text-emerald-500 font-manrope"> Not Interested</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='flex-row w-full px-5 pt-5 pb-6 bg-card dark:bg-card-dark rounded-xl shadow-xs gap-3'>
                        <View className='self-start overflow-hidden'>
                            <Image
                                source={
                                    technician?.profile_image_url
                                        ? { uri: technician.profile_image_url }
                                        : require("@/assets/ui/placeholder_person_photo.png")
                                }
                                className="w-16 h-16 rounded-full"

                            />
                        </View>
                        <View className="flex-col flex-1 gap-2">

                            {/* Name + Rating */}
                            <View className="flex-row items-center justify-between">
                                <TouchableOpacity
                                // onPress={() =>
                                //     router.push({
                                //         pathname: "/(root)/technician/[id]",
                                //         params: { id: String(technician?.id) },
                                //     })
                                // }
                                >
                                    <Text className="text-lg text-primary font-manrope-semibold">{technician?.first_name} {technician?.last_name}</Text>
                                </TouchableOpacity>

                                <View className="flex-row items-center bg-yellow-50 px-2.5 py-1 rounded-full">
                                    <Ionicons name="star" size={12} color="#F59E0B" />
                                    <Text className="ml-1 text-xs font-manrope-semibold text-yellow-700">
                                        {technician?.rating_avg?.toFixed(1) || "New"}
                                    </Text>
                                </View>
                            </View>

                            {/* Meta Info */}
                            <View className="flex-row flex-wrap items-center justify-between gap-3">

                                {/* {(distance !== null && distance !== undefined && !isOwner) && (
                                    <View className="flex-row items-center">
                                        <Ionicons
                                            name="location-outline"
                                            size={14}
                                            color="#6B7280"
                                        />
                                        <Text className="ml-1 text-xs text-gray-500 font-manrope-medium">
                                            {distance} km away
                                        </Text>
                                    </View>
                                )} */}

                                <View className="flex-row items-center">
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={14}
                                        color="#10B981"
                                    />
                                    <Text className="ml-1 text-xs text-emerald-600 font-manrope-medium">
                                        Verified
                                    </Text>
                                </View>

                            </View>

                            {/* Actions */}

                            <TouchableOpacity className="self-start mt-1">
                                <Text className="text-primary text-sm font-manrope-medium underline">
                                    View More...
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

                <View className='bg-card/30 dark:bg-card-dark/30'>
                    <FlashList
                        data={visibleRelatedParts}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingTop: 10,
                            paddingBottom: 100,
                        }}
                        showsVerticalScrollIndicator={false}
                        masonry
                        numColumns={2}
                        renderItem={({ item, index }) => (
                            <PartsCard
                                part={item}
                                showSave
                                index={index}
                                showListView={false}
                            />
                        )}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreParts}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-24">
                                <EmptyState title="No Related Parts" description="No related parts here" />
                            </View>
                        }
                    />
                </View>
            </ScrollView >

            <ImageViewing
                images={(part?.images ?? []).map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </View >
    )
}

export default PartDetail