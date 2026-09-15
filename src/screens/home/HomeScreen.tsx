
import ListCategory from '@/src/components/cards/CategoriesCard';
import HeroCards from '@/src/components/cards/HeroCards';
import PartsCard from '@/src/components/cards/PartsCard';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import { useAuth } from '@/src/context/AuthContext';
import { useCategories, useInfiniteParts, useTechnician, useTechniciansLocation } from '@/src/hooks';
import { useScrollDirection } from '@/src/hooks/fn/useScrollDirection';
import { useTrendingParts } from '@/src/hooks/trendingPartsApi';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const router = useRouter();

    const { user } = useAuth();

    const [quickAccessVisible, setQuickAccessVisible] = useState(false);
    const [listView, setListView] = useState(false);

    const { scrollY, onScroll } = useScrollDirection({
        threshold: 8,
    });

    const floatingIconsOpacity = scrollY.interpolate({
        inputRange: [30, 100],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const floatingIconsTranslateX = scrollY.interpolate({
        inputRange: [30, 100],
        outputRange: [-50, 0],
        extrapolate: "clamp",
    });

    const floatingIconsTranslateY = scrollY.interpolate({
        inputRange: [30, 100],
        outputRange: [50, 0],
        extrapolate: "clamp",
    });

    const {
        data: categories = [],
        isLoading: loadingCategory,
        isRefetching: refetchingCategory,
        refetch: fetchCategories,
        error: categoryError,
    } = useCategories();

    const {
        data: nearPartsData,
        isLoading: loadingNearParts,
        isRefetching: refetchingNearParts,
        error: nearPartError,
        refetch: fetchNearParts,
    } = useInfiniteParts({ condition: "used" });

    const {
        data: partsData,
        isLoading: loadingParts,
        isRefetching: refetchingParts,
        error: partError,
        refetch: fetchParts,
    } = useInfiniteParts({ condition: "new" });

    const { data: technicianLocations } = useTechniciansLocation();

    const { data: technician } = useTechnician(String(user?.id));

    const showAddHint = technician?.last_seen_at === null;

    const parts = partsData?.pages.flatMap(
        (page) => page.data
    ) ?? [];

    const {
        data: trendingParts = [],
        isLoading: loadingTrendingParts,
        isRefetching: refetchingTrendingParts,
        refetch: fetchTrendingParts,
    } = useTrendingParts(50);

    const nearbyParts = useMemo(() => {
        const parts =
            nearPartsData?.pages.flatMap(
                (page) => page.data
            ) ?? [];

        if (!parts.length || !technicianLocations?.length) {
            return [];
        }

        return parts
            .map((part) => {
                const technicianLocation =
                    technicianLocations.find(
                        (location) =>
                            String(location.id) ===
                            String(part.technician_id)
                    );

                if (technicianLocation?.distance == null) {
                    return null;
                }

                return {
                    ...part,
                    distance: technicianLocation.distance,
                };
            })
            .filter(
                (
                    part
                ): part is Part & { distance: number } =>
                    part !== null
            )
            .sort(
                (a, b) => a.distance - b.distance
            );
    }, [
        technicianLocations,
        nearPartsData?.pages,
    ]);

    const columns = listView ? 1 : 2;
    const isMasonry = !listView;

    const loading = loadingCategory || loadingParts || loadingNearParts || loadingTrendingParts;

    const error = partError || categoryError || nearPartError;

    if (error) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{error.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5EAE32] px-6 py-3 rounded-xl" onPress={() => {
                        fetchCategories();
                        fetchParts();
                        fetchNearParts();
                        fetchTrendingParts();
                    }}>
                        <Text className="text-text font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }


    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <ActivityIndicator size="large" color="#5EAE32" />
            </View>
        )
    }
    return (
        <>
            <View className="relative bg-bg px-5 pt-3 pb-4">
                <View className="flex-row justify-between items-center">

                    {/* Logo */}
                    <View className="w-48">
                        <Image
                            source={require("@/assets/ui/bg_removed_logo.png")}
                            resizeMode="stretch"
                            className="w-40 h-8"
                        />
                    </View>

                    <View className='flex flex-row items-center gap-1'>
                        <Animated.View
                            pointerEvents="box-none"
                            className="items-center"
                            style={{
                                opacity: floatingIconsOpacity,
                                transform: [
                                    {
                                        translateX: floatingIconsTranslateX,
                                    },
                                    {
                                        translateY: floatingIconsTranslateY,
                                    },
                                ],
                            }}
                        >
                            <View className="flex-row items-center gap-3">

                                {/* Search */}
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => router.push("/search")}
                                    className="w-10 h-10 rounded-full bg-card items-center justify-center"
                                >
                                    <Ionicons
                                        name="search-outline"
                                        size={20}
                                        color="#777"
                                    />
                                </TouchableOpacity>

                                {/* Quick Access */}
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={() => setQuickAccessVisible(true)}
                                    className="w-12 h-12 bg-input rounded-2xl items-center justify-center border border-border"
                                >
                                    <Ionicons
                                        name="grid-outline"
                                        size={22}
                                        color="#000000"
                                    />
                                </TouchableOpacity>

                            </View>
                        </Animated.View>
                        {/* Add */}
                        <View className="w-12 h-12">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => router.push("/create")}
                                className={`w-12 h-12 rounded-full items-center justify-center ${showAddHint ? "animate-pulse bg-primary" : " bg-white"
                                    }`}
                            >
                                <Ionicons
                                    name="add"
                                    size={28}
                                    color={showAddHint ? "#FFFFFF" : "#5EAE32"}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={onScroll}
                refreshControl={
                    <AppRefreshControl
                        refreshing={
                            refetchingCategory ||
                            refetchingParts ||
                            refetchingNearParts ||
                            refetchingTrendingParts
                        }
                        onRefresh={() => {
                            fetchCategories();
                            fetchParts();
                            fetchNearParts();
                        }}
                    />
                }
                className="flex-1"
            >
                <View className="flex-col gap-5 px-4 mb-8">
                    {/* NORMAL SEARCH */}
                    <View className="flex-row items-center gap-2 pt-2">
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push("/search")}
                            className="flex-1"
                        >
                            <View className="h-12 bg-input rounded-2xl border border-border flex-row items-center px-4">
                                <Ionicons
                                    name="search-outline"
                                    size={20}
                                    color="#9CA3AF"
                                />

                                <Text className="text-text-secondary ml-3">
                                    Search parts, services, requests...
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => setQuickAccessVisible(true)}
                            className="w-12 h-12 bg-input rounded-2xl items-center justify-center border border-border"
                        >
                            <Ionicons
                                name="grid-outline"
                                size={22}
                                color="#000000"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* CATEGORIES */}
                    {categories.length > 0 && (
                        <View className="">

                            <View className="ml-1 flex-row justify-between items-center mb-2">

                                <Text className="text-[17px] font-manrope-bold text-text">
                                    Categories
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        router.push(
                                            "/(pages)/categories"
                                        )
                                    }
                                >
                                    <Text className="text-sm font-manrope-semibold text-primary">
                                        View all
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <FlashList
                                horizontal
                                data={categories.slice(0, 12)}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingVertical: 5,
                                }}
                                renderItem={({ item, index }) => (
                                    <ListCategory
                                        category={item}
                                        total={categories.length}
                                        index={index}
                                    />
                                )}
                            />

                        </View>
                    )}

                    {parts.length > 0 && (
                        <View className="mt-4">

                            <View className="flex-row justify-between items-center mb-2 px-1">

                                <View className="flex-row items-center">
                                    <Text className="text-[17px] font-manrope-bold text-text">
                                        New Parts
                                    </Text>

                                    <View className="ml-2 px-2 py-[2px] rounded-full bg-primary/10">
                                        <Text className="text-[10px] font-manrope-semibold text-primary">
                                            NEW
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(pages)/parts",
                                            params: {
                                                condition: "new",
                                            },
                                        })
                                    }
                                >
                                    <Text className="text-sm font-manrope-semibold text-primary">
                                        View all
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <FlashList
                                horizontal
                                data={parts.slice(0, 24)}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingVertical: 5,
                                }}
                                renderItem={({ item, index }) => (
                                    <PartsCard
                                        part={item}
                                        showSave
                                        isNew
                                    />
                                )}
                            />

                        </View>
                    )}

                    {/* PARTS NEAR YOU */}
                    {nearbyParts.length > 0 && (
                        <View className="mt-4">

                            <View className="flex-row justify-between items-center mb-2 px-1">

                                <View className="flex-row items-center">
                                    <Text className="text-[17px] font-manrope-bold text-text">
                                        Near You
                                    </Text>

                                    <Ionicons
                                        name="location"
                                        size={17}
                                        color="#5EAE32"
                                        style={{ marginLeft: 5 }}
                                    />
                                </View>

                                <Text className="text-[11px] font-manrope-medium text-text-muted mt-0.5">
                                    Parts available around you
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(pages)/parts",
                                            params: {
                                                condition: "used",
                                            },
                                        })
                                    }
                                >
                                    <Text className="text-sm font-manrope-semibold text-primary">
                                        View all
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <FlashList
                                horizontal
                                data={nearbyParts.slice(0, 24)}
                                keyExtractor={(item) => `nearby-${item.id}`}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingVertical: 5,
                                }}
                                renderItem={({ item, index }) => (
                                    <PartsCard
                                        part={item}
                                        showSave
                                        isNear
                                    />
                                )}
                            />

                        </View>
                    )}
                </View>

                <View className="bg-slate-100 flex-col gap-1 mb-24 px-2 pt-3 py-5 mt-8 rounded-xl">
                    <View className='flex-row justify-between items-center px-3'>
                        <View className="flex-row items-center">
                            <Text className="text-[17px] font-manrope-bold text-text">
                                Trending Now
                            </Text>

                            <Ionicons
                                name="trending-up"
                                size={18}
                                color="#5EAE32"
                                style={{ marginLeft: 5 }}
                            />
                        </View>

                        <Text className="text-[11px] font-manrope-medium text-text-muted mt-0.5">
                            Popular parts
                        </Text>

                        <TouchableOpacity
                            onPress={() => setListView(!listView)}
                            className="w-10 h-10 rounded-md border border-border bg-card items-center justify-center"
                        >
                            <Ionicons
                                name={listView ? 'grid-outline' : 'list-outline'}
                                size={20}
                                color='#1F2937'
                            />
                        </TouchableOpacity>
                    </View>
                    <FlashList
                        data={trendingParts.slice(0, 50)}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 5,
                            paddingTop: 10,
                            paddingBottom: 100,
                        }}
                        showsVerticalScrollIndicator={false}
                        numColumns={columns}
                        masonry={isMasonry}
                        renderItem={({ item, index }) => (
                            <PartsCard
                                part={item}
                                index={index}
                                showSave
                                showListView={listView}
                            />
                        )}
                        onEndReachedThreshold={0.5}
                    />
                </View>

            </ScrollView >

            <HeroCards
                visible={quickAccessVisible}
                onClose={() => setQuickAccessVisible(false)}
            />
        </>
    );
};

export default HomeScreen;