import PartsCard from '@/src/components/cards/PartsCard';
import Filters from '@/src/components/common/Filters';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import SortModal from '@/src/components/ui/SortModal';
import { useTheme } from '@/src/context/ThemeContext';
import { useTechniciansLocation } from '@/src/hooks';
import { useInfiniteParts } from '@/src/hooks/useParts';
import { useSearch } from '@/src/hooks/useSearch';
import { clearAllFilters, clearFilter, getActiveFilterCount, getFilterLabels } from '@/src/utils/filters';
import { FilterValues } from '@/types/filters';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Parts = () => {
    const { isDark } = useTheme();
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const [listView, setListView] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('latest');

    const { searchQuery, setSearchQuery } = useSearch();
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

    const [showFilters, setShowFilters] = useState(false);

    const [filters, setFilters] =
        useState<FilterValues>(clearAllFilters());

    const filterLabels = getFilterLabels(filters, 'parts');

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

    // Debounce search query updates for the database call
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    const {
        data,
        isLoading,
        isRefetching,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        refetch,
    } = useInfiniteParts({
        search: debouncedSearch,

        brand: filters.brand,
        model: filters.model,

        categoryId: filters.categoryId,
        platformId: filters.platformId,
        conditionId: filters.conditionId,

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

    const parts = useMemo(() => {
        return data?.pages.flatMap((page: any) => page.data) ?? [];
    }, [data]);

    const partsWithDistance = parts.map((part) => ({
        ...part,
        distance: distanceMap.get(part.technician_id),
    }));

    const totalCount = data?.pages[0]?.totalCount ?? parts.length;

    const sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Nearby', value: 'nearby' },
        { label: 'Lowest Price', value: 'lowest' },
        { label: 'Highest Price', value: 'highest' },
    ];

    const columns = listView ? 1 : 2;
    const isMasonry = !listView;

    const sortedResults = useMemo(() => {
        const sorted = [...partsWithDistance];

        switch (sortValue) {
            case 'latest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at
                        ? new Date(a.created_at).getTime()
                        : 0;

                    const bTime = b.created_at
                        ? new Date(b.created_at).getTime()
                        : 0;

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
                return sorted.sort(
                    (a, b) =>
                        Number(a.price) - Number(b.price)
                );

            case 'highest':
                return sorted.sort(
                    (a, b) =>
                        Number(b.price) - Number(a.price)
                );

            default:
                return sorted;
        }
    }, [partsWithDistance, sortValue]);

    const handleEndReached = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    return (
        <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-bg dark:bg-bg-dark">
            <View className="px-5 py-3">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)")}
                        activeOpacity={0.7}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color={isDark ? '#94A3B8' : '#667085'}
                        />
                    </TouchableOpacity>
                    <View className="flex-1 h-12 rounded-md flex-row items-center px-4 border bg-input/30 dark:bg-input-dark/30 border-border dark:border-border-dark">
                        <Ionicons
                            name="search"
                            size={20}
                            color={isDark ? '#94A3B8' : '#667085'}
                        />

                        <TextInput
                            keyboardType="default"
                            returnKeyType="search"
                            placeholder="Search for parts..."
                            placeholderTextColor={isDark ? '#94A3B8' : '#9CA3AF'}
                            className="flex-1 ml-2 "
                            style={{
                                color: isDark ? '#F8FAFC' : '#0F172A',
                                fontSize: 16,
                            }}
                            onChangeText={setSearchQuery}
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
                                    color={isDark ? '#94A3B8' : '#9CA3AF'}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View className="relative">
                        <TouchableOpacity onPress={() => setShowFilters(true)} className="w-12 h-12 rounded-md flex-row items-center justify-center bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                            <Ionicons
                                name="funnel-outline"
                                size={24}
                                color={isDark ? '#94A3B8' : '#667085'}
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
            <View className="px-5 pb-3 border-b border-border dark:border-border-dark">

                {filterLabels.length > 0 && (
                    <View className="mb-3 flex-row items-center justify-between gap-2">
                        <ScrollView horizontal>
                            <View className="flex-row flex-wrap gap-2">
                                {filterLabels.map((filter) => (
                                    <View
                                        key={filter.key}
                                        className="rounded-full flex-row gap-1 items-center bg-primary/10 px-3 py-1.5"
                                    >
                                        <Text className="text-sm font-medium text-primary">
                                            {filter.label}
                                        </Text>
                                        <TouchableOpacity onPress={() => handleClearFilter(filter.key)} className="items-center p-0.5 rounded-full bg-danger">
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
                            onPress={() => handleClearAll()}
                            className="border-danger bg-danger px-3 py-1.5 rounded-full">
                            <Text className="text-white text-xs">Clear All</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View className="flex-row items-center justify-between">
                    <Text className="text-text-muted dark:text-text-darkMuted text-base font-medium">
                        Found{' '}
                        <Text className="font-bold text-primary">({totalCount})</Text>
                    </Text>

                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={() => setSortModalVisible(true)}
                            className="w-10 h-10 rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark items-center justify-center"
                        >
                            <Ionicons
                                name="swap-vertical-outline"
                                size={20}
                                color={isDark ? '#94A3B8' : '#667085'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setListView(!listView)}
                            className="w-10 h-10 rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark items-center justify-center"
                        >
                            <Ionicons
                                name={listView ? 'grid-outline' : 'list-outline'}
                                size={20}
                                color={isDark ? '#94A3B8' : '#667085'}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="flex-1 pt-3">
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator
                            size="large"
                            color={isDark ? '#60A5FA' : '#3B82F6'}
                        />
                        <Text className="text-text dark:text-text-dark mt-4">
                            Loading parts...
                        </Text>
                    </View>
                ) : sortedResults.length > 0 ? (
                    <View className="flex-1 px-3">
                        <FlashList
                            key={columns}
                            data={sortedResults as Part[]}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            showsVerticalScrollIndicator={false}
                            numColumns={columns}
                            masonry={isMasonry}
                            onEndReached={handleEndReached}
                            refreshControl={
                                <AppRefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={() => {
                                        refetch();
                                    }}
                                />
                            }
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                isFetchingNextPage ? (
                                    <View className="flex-row justify-center items-center py-4">
                                        <ActivityIndicator />
                                        <Text className="text-text dark:text-text-dark ml-2">
                                            Loading more parts...
                                        </Text>
                                    </View>
                                ) : null
                            }
                            renderItem={({ item, index }) => (
                                <PartsCard
                                    part={item}
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
                            color={isDark ? '#64748B' : '#94A3B8'}
                        />
                        <Text className="text-text dark:text-text-dark text-lg font-semibold mt-4">
                            No parts found
                        </Text>
                        <Text className="text-text-secondary dark:text-text-darkMuted text-center mt-2">
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
                type="parts"
                filters={filters}
                onClose={() => setShowFilters(false)}
                onApply={(newFilters) => {
                    setFilters(newFilters);
                }}
            />
        </View>
    );
};

export default Parts;