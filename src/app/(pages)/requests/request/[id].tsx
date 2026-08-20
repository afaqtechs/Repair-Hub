import RequestCard from '@/src/components/cards/RequestCard';
import EmptyState from '@/src/components/ui/EmptyState';
import HTMLRenderer from '@/src/components/ui/HTMLRenderer';
import { useAuth } from '@/src/context/AuthContext';
import { useInfiniteRequests, useRequest, useRequestMutations, useTechnician, useTechnicianLocation } from '@/src/hooks';
import { useConversations } from '@/src/hooks/chat/useConversations';
import { showError, showSuccess } from '@/src/lib/toast';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, Linking, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ImageViewing from 'react-native-image-viewing';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");
const PAGE_SIZE = 6;
const RequestDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const loggedInUserId = String(user?.id);

    const [activeIndex, setActiveIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    const {
        data: request,
        isLoading: loadingRequest,
        error: requestError,
        refetch: refetchRequest,
    } = useRequest(id);

    const technicianId = request?.technician_id ?? "";

    const { getOrCreateConversation } = useConversations();

    const {
        data: technician,
        isLoading: loadingTechnician,
        error: technicianError,
    } = useTechnician(technicianId);

    const {
        data: loggedInUser,
    } = useTechnician(loggedInUserId);

    const {
        data: technicianLocation,
    } = useTechnicianLocation(technicianId);

    const {
        data: requestsData,
        isLoading: loadingRequests,
        error: requestsError,
    } = useInfiniteRequests();


    const requests = useMemo(() =>
        requestsData?.pages.flatMap(
            (page) => page.data
        ) ?? [],
        [requestsData]
    );

    const { updateRequestStatus, deleteRequest } = useRequestMutations();

    const distance = technicianLocation?.distance ?? null;

    const relatedRequests = useMemo(() => {
        if (!request) return [];

        return requests.filter(
            item =>
                item.id !== request.id &&
                (
                    item.category?.id === request.category?.id ||
                    item.platform?.id === request.platform?.id
                )
        );
    }, [requests, request]);

    const visibleRelatedParts = useMemo(() => {
        return relatedRequests.slice(0, visibleCount);
    }, [relatedRequests, visibleCount]);

    const loadMoreRequests = useCallback(() => {
        if (visibleCount >= relatedRequests.length) return;

        setVisibleCount(prev => prev + PAGE_SIZE);
    }, [visibleCount, relatedRequests.length]);

    const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
    };

    const error = requestsError || technicianError || requestError;
    const loading = loadingRequest || loadingRequests || loadingTechnician;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    if (error) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-danger-text text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-textSecondary text-sm text-center mt-2">{error.message}</Text>
                    <TouchableOpacity
                        className="mt-6 bg-primary px-6 py-3 rounded-xl"
                        onPress={() => refetchRequest()}
                    >
                        <Text className="text-text font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (!request) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <Text className="text-textSecondary">Request not found</Text>
            </View>
        );
    }

    const handleRemove = async () => {
        if (!request) return;
        try {
            await deleteRequest.mutateAsync(request.id);
            showSuccess('Deleted', 'Request deleted successfully');
            router.back();
        } catch (error: any) {
            showError('Failed to delete part:', error.message);
        }
    };

    const handleMarkInactive = async () => {
        if (!request) return;
        try {
            await updateRequestStatus.mutateAsync({
                id: request.id,
                isAvailable: !request.is_active,
            });
            showSuccess('Updated', 'Request marked status updated');
        } catch (error: any) {
            showError('Failed to update:', error.message);
        }
    };

    const isLongDesc = (request.description?.length ?? 0) > 150;
    const displayDesc =
        expanded || !isLongDesc
            ? request.description
            : request.description?.slice(0, 150) + "...";

    const renderHeader = () => {
        return (
            <View className={`px-4 py-3 items-start`}>
                <Text className="text-lg text-text font-manrope-semibold">Related Requests</Text>
            </View>
        );
    };

    const renderFooter = () => {
        if (visibleCount >= relatedRequests.length) return null;

        return (
            <View className="py-4 items-center">
                <ActivityIndicator color="#3b82f6" />
            </View>
        );
    };

    const handleChat = async () => {
        const conversationId =
            await getOrCreateConversation.mutateAsync(technicianId);

        if (!conversationId) return;

        router.push({
            pathname: "/(root)/(tabs)/inbox",
            params: {
                conversationId: conversationId,
            },
        });
    };

    const handleCall = async () => {
        const phone = technician?.phone;

        if (!phone) {
            showError(
                'Phone number unavailable',
                'This technician has not provided a phone number.'
            );
            return;
        }

        try {
            const phoneUrl = `tel:${phone}`;

            const supported = await Linking.canOpenURL(phoneUrl);

            if (!supported) {
                showError(
                    'Cannot make call',
                    'Your device does not support phone calls.'
                );
                return;
            }

            await Linking.openURL(phoneUrl);
        } catch (error: any) {
            showError(
                'Call failed',
                error?.message || 'Unable to open the phone dialer.'
            );
        }
    };


    const isOwner = loggedInUserId === technicianId;

    const imageData = request?.images?.length ? request.images : [null];

    return (
        <View
            style={{ flex: 1, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg"
        >
            <View>
                <View >
                    <FlatList
                        data={imageData}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => setImageViewerVisible(true)}>
                                <Image
                                    source={item ? { uri: item } : require("@/assets/ui/background/request_image.jpg")}
                                    style={{ width, height: 300 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>)}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                    />
                </View >

                {(request?.images?.length ?? 0) > 0 && (
                    <View className="absolute bottom-3 right-4 bg-black/50 px-3 py-1 rounded-full">
                        <Text className="text-white text-xs font-medium">
                            {activeIndex + 1}/{request.images!.length}
                        </Text>
                    </View>
                )}

                {
                    (request?.images ?? []).length > 1 && (
                        <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1">
                            {(request.images ?? []).map((_, i) => (
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
                <View style={{ flex: 1, paddingTop: insets.top }} className="absolute top-0 left-0 right-0">
                    <View className="flex-row items-center justify-between px-4 pt-3">
                        <TouchableOpacity
                            onPress={() => { router.back() }}
                            className="w-10 h-10 items-center justify-center rounded-2xl bg-bg border border-border"

                        >
                            <Ionicons name="arrow-back" size={20} color="#1F2937" />
                        </TouchableOpacity>

                        {request.priority === "urgent" && (
                            <View className={`absolute bottom-2 right-2 px-3 py-1 rounded-xl bg-red-500`}>
                                <Text className={`text-xs font-semibold text-white`}>
                                    {request.priority}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View >

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-col gap-5 mt-5 pb-32 px-5'>
                    <View className="w-full px-5 pt-5 pb-6 bg-card rounded-xl shadow-xs">

                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-1">
                                <Ionicons
                                    name="location"
                                    size={15}
                                    color="#5B3DF5"
                                />
                                <Text className="text-xs text-textSecondary font-manrope-medium">
                                    {technician?.city}
                                </Text>
                            </View>
                        </View>
                        <Text
                            className="text-xl text-text font-manrope-bold mb-2"
                            numberOfLines={2}
                        >
                            {request?.title}
                        </Text>

                        {(!isOwner && loggedInUser?.verification_status === "verified") && (
                            <View className="flex-row gap-3 mb-5">

                                <TouchableOpacity
                                    onPress={handleChat}
                                    className="flex-1 border border-primary py-3 rounded-xl items-center"
                                >
                                    <Text className="text-primary font-manrope-semibold">
                                        Chat With Owner
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCall}
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
                                    disabled={updateRequestStatus.isPending}
                                    className="flex-1 border border-primary py-3 rounded-xl items-center"
                                >
                                    {updateRequestStatus.isPending ? (
                                        <ActivityIndicator size="small" color="#5B3DF5" />
                                    ) : (
                                        <Text className="text-primary font-manrope-semibold">
                                            {request?.is_active ? "Mark In Active" : "Mark Active"}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleRemove}
                                    disabled={deleteRequest.isPending}
                                    className="flex-1 bg-danger border border-danger py-3 rounded-xl items-center"
                                >
                                    {deleteRequest.isPending ? (
                                        <ActivityIndicator size="small" color="#5B3DF5" />
                                    ) : (
                                        <Text className="text-white font-manrope-semibold">
                                            Remove Request
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View className="w-full px-5 py-5 bg-card rounded-xl shadow-xs">
                        <Text className="text-lg text-text font-manrope-bold mb-4">
                            Details
                        </Text>
                        <View className="flex-row flex-wrap justify-between gap-y-5">

                            <View className="w-[48%]">
                                <Text className="text-base text-text font-manrope-semibold">
                                    {request?.platform?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Platform
                                </Text>
                            </View>

                            {/* Category */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text font-manrope-semibold">
                                    {request?.category?.name || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Category
                                </Text>
                            </View>


                            {/* Priority */}
                            <View className="w-[48%]">
                                <Text className="text-base text-text font-manrope-semibold">
                                    {request?.priority || "N/A"}
                                </Text>
                                <Text className="text-xs text-gray-500 font-manrope">
                                    Priority
                                </Text>
                            </View>

                            {/* Availability */}
                            <View className="w-[48%]">
                                <View className={`self-start px-3 py-1 rounded-full ${request?.is_active
                                    ? "bg-success"
                                    : "bg-danger"
                                    }`}>
                                    <Text className={`text-xs font-manrope-semibold ${request?.is_active
                                        ? "text-text"
                                        : "text-white"
                                        }`}>
                                        {request?.is_active ? "Active" : "In Active"}
                                    </Text>
                                </View>

                                <Text className="text-xs text-gray-500 font-manrope mt-1">
                                    Status
                                </Text>
                            </View>
                        </View>
                    </View>

                    {request?.description && (
                        <View className="w-full px-5 pt-5 pb-6 bg-card rounded-xl shadow-xs">
                            <Text className="text-lg text-text font-manrope-bold mb-3">
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

                    <View className='flex-row w-full px-5 pt-5 pb-6 bg-card rounded-xl shadow-xs gap-3'>
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

                            <TouchableOpacity
                                onPress={() =>
                                    router.push({
                                        pathname: "/(pages)/technician/[id]",
                                        params: { id: String(technician?.id) },
                                    })
                                }
                                className="self-start mt-1">
                                <Text className="text-primary text-sm font-manrope-medium underline">
                                    View More...
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View className='bg-slate-100'>
                    <FlashList
                        data={visibleRelatedParts}
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
                            <RequestCard
                                request={item}
                                index={index}
                                showListView={false}
                            />
                        )}
                        ListHeaderComponent={renderHeader}
                        ListFooterComponent={renderFooter}
                        onEndReached={loadMoreRequests}
                        onEndReachedThreshold={0.5}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-24">
                                <EmptyState title="No Related Requests" description="No related requests here" />
                            </View>
                        }
                    />
                </View>
            </ScrollView >
            <ImageViewing
                images={(request?.images ?? []).map((uri) => ({ uri }))}
                imageIndex={activeIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
        </View >
    )
}

export default RequestDetail