import ServiceCard from '@/src/components/cards/ServiceCard';
import EmptyState from '@/src/components/ui/EmptyState';
import HTMLRenderer from '@/src/components/ui/HTMLRenderer';
import { useAuth } from '@/src/context/AuthContext';
import { useInfiniteServices, useService, useServiceMutations, useTechnician, useTechnicianLocation } from '@/src/hooks';
import { useSavedService } from '@/src/hooks/useSavedService';
import { showError, showSuccess } from '@/src/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View, } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
const PAGE_SIZE = 6;
const ServiceDetail = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const { isSaved, saveLoading, toggleSave } = useSavedService(id ?? "");
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const loggedInUserId = user?.id;

    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const {
        data: service,
        isLoading: loadingService,
        error: serviceError,
        refetch: refetchService,
    } = useService(id);

    const technicianId = service?.technician_id ?? "";

    const {
        data: technician,
        isLoading: loadingTechnician,
        error: technicianError,
    } = useTechnician(technicianId);

    const {
        data: technicianLocation,
    } = useTechnicianLocation(technicianId);


    const {
        data: serviceData,
        isLoading: loadingServices,
        error: servicesError,
    } = useInfiniteServices();

    const { updateServiceStatus, deleteService } = useServiceMutations();

    const distance = technicianLocation?.distance ?? null;

    const services = useMemo(() =>
        serviceData?.pages.flatMap(
            (page) => page.data
        ) ?? [],
        [serviceData]
    );


    const relatedServices = useMemo(() => {
        if (!service) return [];

        return services.filter(
            item =>
                item.id !== service.id &&
                (
                    item.category?.id === service.category?.id ||
                    item.platform?.id === service.platform?.id
                )
        );
    }, [services, service]);
    const visibleRelatedServices = useMemo(() => {
        return relatedServices.slice(0, visibleCount);
    }, [relatedServices, visibleCount]);

    const loadMoreServices = useCallback(() => {
        if (visibleCount >= relatedServices.length) return;

        setVisibleCount(prev => prev + PAGE_SIZE);
    }, [visibleCount, relatedServices.length]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const error = servicesError || technicianError || serviceError;
    const loading = loadingService || loadingServices || loadingTechnician;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-bg-dark">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }


    if (error) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg-dark">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-danger-text text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-text-darkSecondary text-sm text-center mt-2">{error.message}</Text>
                    <TouchableOpacity
                        className="mt-6 bg-primary px-6 py-3 rounded-xl"
                        onPress={() => refetchService()}
                    >
                        <Text className="text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!service) {
        return (
            <View className="flex-1 items-center justify-center bg-bg-dark">
                <Text className="text-text-darkSecondary">Service not found</Text>
            </View>
        );
    }


    const isLongDesc = (service.description?.length ?? 0) > 150;
    const displayDesc =
        expanded || !isLongDesc
            ? service.description
            : service.description?.slice(0, 150) + "...";

    const renderHeader = () => {
        return (
            <View className={`px-4 py-3 items-start`}>
                <Text className="text-lg text-text-dark font-manrope-semibold">Related Services</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (visibleCount >= relatedServices.length) return null;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator color="#3b82f6" />
            </View>
        );
    };

    const handleRemove = async () => {
        if (!service) return;
        try {
            await deleteService.mutateAsync(service.id);
            showSuccess('Deleted', 'Service deleted successfully');
            router.back();
        } catch (error: any) {
            showError('Failed to delete part:', error.message);
        }
    };

    const handleMarkInactive = async () => {
        if (!service) return;
        try {
            await updateServiceStatus.mutateAsync({
                id: service.id,
                isAvailable: !service.is_active,
            });
            showSuccess('Updated', 'Service marked status updated');
        } catch (error: any) {
            showError('Failed to update:', error.message);
        }
    };

    const isOwner = loggedInUserId === technicianId;

    const imageData = service?.images?.length ? service.images : [null];

    return (
        <View
            style={{ flex: 1, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg-dark"
        >
            <View>
                <View >
                    <FlatList
                        data={imageData}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                                <Image
                                    source={item ? { uri: item } : require("@/assets/ui/heroimage.png")}
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

                {(service?.images?.length ?? 0) > 0 && (
                    <View className="absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-medium">
                            {activeIndex + 1}/{service.images!.length}
                        </Text>
                    </View>
                )}

                {
                    (service?.images ?? []).length > 1 && (
                        <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1">
                            {(service.images ?? []).map((_, i) => (
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

                <View style={{ flex: 1, paddingTop: insets.top }} className="absolute top-0 left-0 right-0">
                    <View className="flex-row items-center justify-between px-4 pt-2">
                        <TouchableOpacity
                            onPress={() => { router.back() }}
                            className="w-10 h-10 items-center justify-center rounded-2xl bg-bg-dark border border-border-dark"
                        >
                            <Ionicons name="arrow-back" size={20} color="#F8FAFC"  />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => toggleSave()}
                            disabled={saveLoading}
                            className="absolute top-2 right-2 bg-bg-dark rounded-full p-2 items-center justify-center"
                        >
                            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={20} color={isSaved ? "#EF4444" : "#ffffff"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-col gap-5 mt-5 pb-32 px-5'>
                    <View className="w-full px-5 pt-5 pb-6 bg-card-dark rounded-xl shadow-xs">

                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-1">
                                <Ionicons
                                    name="location"
                                    size={15}
                                    color="#5B3DF5"
                                />
                                <Text className="text-xs text-text-darkSecondary font-manrope-medium">
                                    {technician?.city}
                                </Text>
                            </View>
                            <View className="px-3 py-1 bg-bg-dark/70 rounded-xl">
                                <Text className="text-xs text-text-dark font-manrope-medium">
                                    Service
                                </Text>
                            </View>

                        </View>
                        <Text
                            className="text-xl text-text-dark font-manrope-bold mb-2"
                            numberOfLines={2}
                        >
                            {service?.title}
                        </Text>


                        <Text className="text-2xl text-emerald-500 font-manrope-extra mb-5">
                            ETB {service?.price?.toLocaleString()}
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
                                    onPress={handleMarkInactive}
                                    disabled={updateServiceStatus.isPending}
                                    className="flex-1 border border-primary py-3 rounded-xl items-center"
                                >
                                    {updateServiceStatus.isPending ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <Text className="text-primary font-manrope-semibold">
                                            {service?.is_active ? "Mark In Active" : "Mark Active"}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleRemove}
                                    disabled={deleteService.isPending}
                                    className="flex-1 bg-danger border border-danger py-3 rounded-xl items-center"
                                >
                                    {deleteService.isPending ? (
                                        <ActivityIndicator size="small" color="#ffffff" />
                                    ) : (
                                        <Text className="text-white font-manrope-semibold">
                                            Remove Service
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View className="w-full px-5 py-5 bg-card-dark rounded-xl shadow-xs">
                        <Text className="text-lg text-text-dark font-manrope-bold mb-4">
                            Details
                        </Text>
                        <View className="flex-row flex-wrap justify-between gap-y-5">

                            <View className="w-[48%]">
                                <Text className="text-base text-text-dark font-manrope-semibold">
                                    {service?.platform?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Platform
                                </Text>
                            </View>

                            {/* Category */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text-dark font-manrope-semibold">
                                    {service?.category?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Category
                                </Text>
                            </View>


                            {/* Condition */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text-dark font-manrope-semibold">
                                    Service
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Condition
                                </Text>
                            </View>

                            {/* Price */}
                            <View className="w-[48%]">
                                <Text className="text-base text-emerald-500 font-manrope-bold">
                                    ETB {service?.price?.toLocaleString() || 0}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Price
                                </Text>
                            </View>

                            {/* Availability */}
                            <View className="w-[48%]">
                                <View className={`self-start px-3 py-1 rounded-full ${service?.is_active
                                    ? "bg-success"
                                    : "bg-danger"
                                    }`}>
                                    <Text className={`text-xs font-manrope-semibold ${service?.is_active
                                        ? "text-white"
                                        : "text-red-600"
                                        }`}>
                                        {service?.is_active ? "Active" : "Unavailable"}
                                    </Text>
                                </View>

                                <Text className="text-xs text-gray-500 font-manrope mt-1">
                                    Status
                                </Text>
                            </View>
                        </View>
                    </View>


                    {service?.description && (
                        <View className="w-full px-5 pt-5 pb-6 bg-card-dark rounded-xl shadow-xs">
                            <Text className="text-lg text-text-dark font-manrope-bold mb-4">
                                Description
                            </Text>

                            <HTMLRenderer
                                html={displayDesc}
                                fontSize={16}
                                lineHeight={24}
                            />

                            {isLongDesc && (
                                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                                    <Text className="text-blue-600 text-sm font-manrope mb-5">
                                        {expanded ? "Show less" : "Read more"}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <View className="w-full px-5 pt-5 pb-6 bg-card-dark rounded-xl shadow-xs">
                        <View className="w-full flex-row items-center justify-center gap-3">
                            <Ionicons
                                name={service?.is_negotiable ? "checkmark-circle" : "close-circle"}
                                size={20}
                                color={service?.is_negotiable ? "#10B981" : "#EF4444"}
                            />
                            <Text className={service?.is_negotiable ? "text-base text-emerald-500 font-manrope" : "text-base text-red-500 font-manrope"}>
                                {service?.is_negotiable ? "Price Negotiable" : "Price Not Negotiable"}
                            </Text>
                        </View>
                    </View>

                    <View className="w-full px-5 pt-5 pb-6 bg-card-dark rounded-xl shadow-xs">
                        <View className="flex-row items-center justify-between">
                            <TouchableOpacity className='flex-1 items-center justify-center'>
                                <Text className="text-base text-red-500 font-manrope">Report</Text>
                            </TouchableOpacity>
                            <View className='h-full w-[1px] bg-gray-700' />
                            <TouchableOpacity className='flex-1 items-center justify-center'>
                                <Text className="text-base text-emerald-500 font-manrope"> Not Interested</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className='flex-row w-full px-5 pt-5 pb-6 bg-card-dark rounded-xl shadow-xs gap-3'>
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
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(pages)/technician/[id]",
                                            params: { id: String(technician?.id) },
                                        })
                                    }
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

                                {(distance !== null && distance !== undefined && !isOwner) && (
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
                                )}

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

                <View className='bg-card-dark/30'>
                    <FlashList
                        data={visibleRelatedServices}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 5,
                            paddingTop: 10,
                            paddingBottom: 100,
                        }}
                        showsVerticalScrollIndicator={false}
                        masonry
                        numColumns={2}
                        renderItem={({ item, index }) => (
                            <ServiceCard
                                service={item}
                                showSave
                                index={index}
                                showListView={false}
                            />
                        )}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreServices}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-24">
                                <EmptyState title="No Related Services" description="No related services here" />
                            </View>
                        }
                    />
                </View>
            </ScrollView >

            <ImageViewing
                images={(service?.images ?? []).map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />

        </View >
    )
}

export default ServiceDetail