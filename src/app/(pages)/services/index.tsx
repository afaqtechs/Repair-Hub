import ServiceCard from '@/src/components/cards/ServiceCard'
import Filters from '@/src/components/common/Filters'
import AppRefreshControl from '@/src/components/ui/AppRefreshControl'
import SortModal from '@/src/components/ui/SortModal'
import { useCategories, usePlatforms, useServicesByCategory, useTechniciansLocation } from '@/src/hooks'
import { useSearch } from '@/src/hooks/useSearch'
import { useInfiniteServices } from '@/src/hooks/useServices'
import { clearAllFilters, clearFilter, getActiveFilterCount, getFilterLabels } from '@/src/utils/filters'
import { Category } from '@/types/category'
import { FilterValues } from '@/types/filters'
import { Service } from '@/types/services'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const Services = () => {
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [listView, setListView] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('latest');

    const { searchQuery, setSearchQuery } = useSearch();
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    const [activeCategory, setActiveCategory] = useState<Category | null>(null);

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] =
        useState<FilterValues>(clearAllFilters());

    const { data: categories = [] } = useCategories();
    const { data: platforms = [] } = usePlatforms();

    const {
        data: categoryServices = [],
        isLoading: loadingCategoryServices,
    } = useServicesByCategory(String(activeCategory?.id));

    const categoryItems = [
        {
            id: 'all',
            name: 'All',
            icon_url: null,
        },
        ...categories,
    ];

    const filterLabels = getFilterLabels(filters, 'parts', categories, platforms);

    const activeFilterCount = getActiveFilterCount(
        filters,
        'parts'
    );


    const handleClearFilter = (key: keyof FilterValues) => {
        setFilters((prev) => clearFilter(prev, key));
    };

    const handleClearAll = () => {
        setFilters(clearAllFilters());
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchQuery]);
    const {
        data,
        isLoading,
        fetchNextPage,
        isRefetching,
        refetch,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteServices({
        search: debouncedSearch,

        categoryId: filters.categoryId,
        platformId: filters.platformId,

        priceMin: filters.priceMin,
        priceMax: filters.priceMax,

        city: filters.city,
    });

    const {
        data: technicianLocations = [],
    } = useTechniciansLocation();

    const distanceMap = new Map(
        technicianLocations.map((location) => [
            location.id,
            Number(location.distance),
        ])
    );

    const services = React.useMemo(() => {
        return data?.pages.flatMap((page) => page.data || []) ?? [];
    }, [data]);

    const displayedPartsWithDistance = (
        activeCategory === null ? services : categoryServices
    ).map((service) => ({
        ...service,
        distance: distanceMap.get(service.technician_id),
    }));


    const totalCount = data?.pages[0]?.totalCount ?? services.length;

    const sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Nearby', value: 'nearby' },
        { label: 'Lowest Price', value: 'lowest' },
        { label: 'Highest Price', value: 'highest' },
    ];

    const columns = listView ? 1 : 2;
    const isMasonry = !listView;

    // 4. Sort the server-filtered results locally
    const sortedResults = React.useMemo(() => {
        const sorted = [...displayedPartsWithDistance];

        switch (sortValue) {
            case 'latest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return bTime - aTime;
                });

            case 'nearby':
                return sorted.sort((a, b) => {
                    const aDistance =
                        a.distance ?? Number.POSITIVE_INFINITY;

                    const bDistance =
                        b.distance ?? Number.POSITIVE_INFINITY;

                    return aDistance - bDistance;
                });

            case 'lowest':
                return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

            case 'highest':
                return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

            default:
                return sorted;
        }
    }, [displayedPartsWithDistance, sortValue]);

    // Handle fetching next page on scroll end
    const handleEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-bg">
            {/* Header Search Bar */}
            <View className="px-5 py-3">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)")}
                        activeOpacity={0.7}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#1F2937"
                        />
                    </TouchableOpacity>
                    <View className="flex-1 h-12 rounded-md flex-row items-center px-4 border bg-input/30 border-border">
                        <Ionicons
                            name="search"
                            size={20}
                            color="#94A3B8"
                        />

                        <TextInput
                            keyboardType="default"
                            returnKeyType="search"
                            placeholder="Search for services..."
                            placeholderTextColor="#94A3B8"
                            className="flex-1 ml-2 "
                            style={{
                                color: '#171A2B',
                                fontSize: 16,
                            }}
                            onChangeText={(text) => setSearchQuery(text)}
                            value={searchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchQuery('')}
                                className="ml-2"
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color="#94A3B8"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View className="relative">
                        <TouchableOpacity onPress={() => setShowFilters(true)} className="w-12 h-12 rounded-md flex-row items-center justify-center bg-card border border-border">
                            <Ionicons
                                name="funnel-outline"
                                size={24}
                                color="#1F2937"
                            />
                        </TouchableOpacity >
                        {activeFilterCount > 0 && (
                            <Text className="absolute -top-3 -right-2 px-1.5 py-0 rounded-full bg-primary text-white">
                                {activeFilterCount}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Controls Header */}
            <View className="px-5 mb-3">

                {filterLabels.length > 0 ? (
                    <View className="flex-row items-center justify-between gap-2">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row flex-wrap gap-2">
                                {filterLabels.map((filter) => (
                                    <View
                                        key={filter.key}
                                        className="rounded-full flex-row gap-1 items-center bg-primary/10 px-3 py-1.5"
                                    >
                                        <Text className="text-sm font-medium text-primary">
                                            {filter.label}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => handleClearFilter(filter.key)}
                                            className="items-center p-0.5 rounded-full bg-danger"
                                        >
                                            <Ionicons
                                                name="close"
                                                size={12}
                                                color="#ffffff"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>

                        <TouchableOpacity
                            onPress={handleClearAll}
                            className="border-danger bg-danger px-3 py-1.5 rounded-full"
                        >
                            <Text className="text-white text-xs">
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className="">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                gap: 8,
                            }}
                        >
                            {categoryItems.map((category) => {
                                const isActive =
                                    category.id === 'all'
                                        ? activeCategory === null
                                        : activeCategory?.id === category.id;

                                return (
                                    <TouchableOpacity
                                        key={category.id}
                                        onPress={() => {
                                            if (category.id === 'all') {
                                                setActiveCategory(null);
                                            } else {
                                                setActiveCategory(category as Category);
                                            }
                                        }}
                                        activeOpacity={0.8}
                                        className={`flex-row items-center gap-1.5 rounded-full px-5 py-1.5 ${isActive
                                            ? 'bg-primary'
                                            : 'bg-primary/10 border border-border'
                                            }`}
                                    >
                                        <Text
                                            className={`text-sm font-medium ${isActive
                                                ? 'text-white'
                                                : 'text-text'
                                                }`}
                                        >
                                            {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </View>
                )}
            </View>

            {/* List Body */}
            <View className="flex-1">
                {isLoading || loadingCategoryServices ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color='#5EAE32' />
                        <Text className="text-text mt-4">Loading services...</Text>
                    </View>
                ) : sortedResults.length > 0 ? (
                    <View className="flex-1 px-3">
                        <FlashList
                            key={columns}
                            data={sortedResults as Service[]}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                            numColumns={columns}
                            masonry={isMasonry}
                            refreshControl={
                                <AppRefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={() => {
                                        refetch();
                                    }}
                                />
                            }
                            onEndReached={handleEndReached}
                            onEndReachedThreshold={0.5}
                            ListHeaderComponent={
                                <View className="px-2 flex-row items-center justify-between pb-3 border-b border-border">
                                    <Text className="text-text-muted text-base font-medium">
                                        Found{' '}
                                        <Text className="font-bold text-primary">
                                            ({totalCount})
                                        </Text>
                                    </Text>

                                    <View className="flex-row items-center gap-2">
                                        <TouchableOpacity
                                            onPress={() => setSortModalVisible(true)}
                                            className="w-10 h-10 rounded-md border border-border bg-card items-center justify-center"
                                        >
                                            <Ionicons
                                                name="swap-vertical-outline"
                                                size={20}
                                                color='#1F2937'
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setListView(!listView)}
                                            className="w-10 h-10 rounded-md border border-border bg-card items-center justify-center"
                                        >
                                            <Ionicons
                                                name={listView ? 'grid-outline' : 'list-outline'}
                                                size={20}
                                                color="#1F2937"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            }
                            ListFooterComponent={
                                isFetchingNextPage ? (
                                    <View className="flex-row justify-center items-center py-4">
                                        <ActivityIndicator color='#5EAE32' />
                                        <Text className="text-text ml-2">
                                            Loading more services...
                                        </Text>
                                    </View>
                                ) : null
                            }
                            renderItem={({ item, index }) => (
                                <ServiceCard
                                    service={item}
                                    index={index}
                                    showSave
                                    showListView={listView}
                                />
                            )}
                        />
                    </View>
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Ionicons
                            name="search-outline"
                            size={60}
                            color="#64748B"
                        />
                        <Text className="text-text text-lg font-semibold mt-4">
                            No services found
                        </Text>
                        <Text className="text-text-muted text-center mt-2">
                            Try adjusting your search or filters
                        </Text>
                    </View>
                )}
            </View>

            <SortModal
                sortModalVisible={sortModalVisible}
                setSortModalVisible={setSortModalVisible}
                sortOptions={sortOptions}
                sortValue={sortValue}
                setSortValue={setSortValue}
            />

            <Filters
                visible={showFilters}
                type="services"
                filters={filters}
                onClose={() => setShowFilters(false)}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                }}
            />
        </View>
    );
};

export default Services;