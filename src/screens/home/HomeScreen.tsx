
import ListCategory from '@/src/components/cards/CategoriesCard';
import HeroCards from '@/src/components/cards/HeroCards';
import HeroCTA from '@/src/components/cards/HeroCTA';
import PartsCard from '@/src/components/cards/PartsCard';
import TechniciansCard from '@/src/components/cards/TechniciansCard';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import { useTheme } from '@/src/context/ThemeContext';
import { useCategories, useInfiniteParts, useTechnicians, useTechniciansLocation } from '@/src/hooks';
import { Technician } from '@/types/profiles';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const { isDark } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const {
        data: categories = [],
        isLoading: loadingCategory,
        isRefetching: refetchingCategory,
        refetch: fetchCategories,
        error: categoryError,
    } = useCategories();

    const {
        data: partsData,
        isLoading: loadingParts,
        isRefetching: refetchingParts,
        error: partError,
        refetch: fetchParts,
    } = useInfiniteParts();

    const { data: technicianLocations } = useTechniciansLocation();
    const { data: technicians, refetch: refetchTechnicians, isLoading: loadingTechnicians } = useTechnicians();

    const techniciansWithDistance = useMemo(() => {
        if (!technicians?.length || !technicianLocations) return [];

        return technicians
            .map((technician) => {
                const location = technicianLocations?.find(
                    (item) => item.id === technician.id
                );

                if (location?.distance == null) return null;

                return {
                    ...technician,
                    distance: location.distance,
                };
            })
            .filter((technician): technician is Technician & { distance: number } => technician !== null)
            .sort((a, b) => a.distance - b.distance);

    }, [technicians, technicianLocations]);


    const parts = partsData?.pages.flatMap(
        (page) => page.data
    ) ?? [];

    const loading = loadingCategory || loadingParts || loadingTechnicians;

    const error = partError || categoryError;

    if (error) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg dark:bg-bg-dark">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{error.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => {
                        fetchCategories();
                        fetchParts();
                        refetchTechnicians();
                    }}>
                        <Text className="text-text dark:text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }


    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        )
    }
    return (
        <View style={{ flex: 1, paddingTop: insets.top }} >
            <View className="flex-row justify-between items-center py-3 px-5">
                <View>
                    <Text className="text-text dark:text-text-dark text-2xl font-bold">
                        Repair<Text className="text-primary">Hub</Text>
                    </Text>
                    <Text className="text-text-secondary dark:text-text-darkSecondary text-xs mt-0.5">
                        Find repair parts & experts
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-12 h-12 rounded-lg bg-bg/50 dark:bg-bg-dark/50 border border-border/30 dark:border-border-dark/30 items-center justify-center"
                >
                    <Ionicons name="notifications-outline" size={22} color={isDark ? "#C4B5FD" : "#5B3DF5"} />
                    <View className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
                </TouchableOpacity>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <AppRefreshControl
                        refreshing={refetchingCategory || refetchingParts}
                        onRefresh={() => {
                            fetchCategories();
                            fetchParts();
                            refetchTechnicians();
                        }}
                    />

                }
                className="flex-1"
            >
                <View className='flex-col gap-5 px-4'>
                    <HeroCards />
                    <HeroCTA />
                    {categories.length > 0 && (
                        <View className='mt-4'>
                            <View className='ml-1 flex-row justify-between items-center mb-1'>
                                <Text className="text-base font-manrope-semibold text-text dark:text-text-dark">
                                    Top Categories
                                </Text>
                                <TouchableOpacity onPress={() => router.push("/(pages)/categories")} className=''>
                                    <Text className="text-base font-manrope-semibold text-primary">
                                        View All
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <FlashList
                                key="categories-horizontal"
                                data={categories.slice(0, 50)}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingTop: 5, paddingBottom: 5 }}
                                showsHorizontalScrollIndicator={false}
                                horizontal
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

                    {techniciansWithDistance.length > 0 && (
                        <View className='mt-4'>
                            <Text className="px-3 mb-1 text-base font-manrope-semibold text-text dark:text-text-dark">
                                Nearby Technicians
                            </Text>
                            <FlashList
                                key="technicians-horizontal"
                                data={techniciansWithDistance.slice(0, 50)}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    paddingHorizontal: 4,
                                }}
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                renderItem={({ item }) => (
                                    <TechniciansCard
                                        techncicians={item}
                                    />
                                )}
                            />
                        </View>
                    )}

                </View>

                {parts.length > 0 && (
                    <View className='mt-8 px-3 py-8 bg-card dark:bg-card-dark'>
                        <Text className="px-3 text-base font-manrope-semibold text-text dark:text-text-dark mb-1">
                            Recommended for you
                        </Text>
                        <FlashList
                            data={parts.slice(0, 50)}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingTop: 5, paddingBottom: 50 }}
                            showsVerticalScrollIndicator={false}
                            numColumns={2}
                            masonry
                            renderItem={({ item, index }) => (
                                <PartsCard
                                    part={item}
                                    index={index}
                                    showSave
                                />
                            )}
                        />
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default HomeScreen;