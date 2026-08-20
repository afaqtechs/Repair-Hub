import RequestCard from '@/src/components/cards/RequestCard';
import Filters from '@/src/components/common/Filters';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import SortModal from '@/src/components/ui/SortModal';
import { useTechniciansLocation } from '@/src/hooks';
import { useInfiniteRequests } from '@/src/hooks/useRequest';
import { useSearch } from '@/src/hooks/useSearch';
import { clearAllFilters, clearFilter, getActiveFilterCount, getFilterLabels } from '@/src/utils/filters';
import { FilterValues } from '@/types/filters';
import { Request } from '@/types/requests';
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

const Requests = () => {
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

  const filterLabels = getFilterLabels(filters, 'requests');

  const activeFilterCount = getActiveFilterCount(
    filters,
    'requests'
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
  } = useInfiniteRequests({
    search: debouncedSearch,

    categoryId: filters.categoryId,
    platformId: filters.platformId,

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

  const requests = useMemo(() => {
    return data?.pages.flatMap((page: any) => page.data) ?? [];
  }, [data]);

  const requestsWithDistance = requests.map((request) => ({
    ...request,
    distance: distanceMap.get(request.technician_id),
  }));

  const totalCount = data?.pages[0]?.totalCount ?? requests.length;

  const sortOptions = [
    { label: 'Latest', value: 'latest' },
    { label: 'Nearby', value: 'nearby' },
    { label: 'Urgent', value: 'urgent' },
  ];

  const columns = listView ? 1 : 2;
  const isMasonry = !listView;

  const sortedResults = useMemo(() => {
    const sorted = [...requestsWithDistance];

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

      case 'urgent':
        return sorted.sort((a, b) => {
          if (!('priority' in a) || !('priority' in b)) {
            return 0;
          }
          const priorityOrder = {
            urgent: 0,
            normal: 1,
          };
          return (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 2) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 2);
        });

      default:
        return sorted;
    }
  }, [requestsWithDistance, sortValue]);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-bg">
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
              color='#1F2937'
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
              placeholder="Search for requests..."
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 k"
              style={{
                color: "#1F2937",
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
                  color="#1F2937"
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
      <View className="px-5 pb-3 border-b border-border">

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
          <Text className="text-text-muted text-base font-medium">
            Found{' '}
            <Text className="font-bold text-primary">({totalCount})</Text>
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
      </View>

      <View className="flex-1 pt-3">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator
              size="large"
              color='#60A5FA'
            />
            <Text className="text-text mt-4">
              Loading requests...
            </Text>
          </View>
        ) : sortedResults.length > 0 ? (
          <View className="flex-1 px-3">
            <FlashList
              key={columns}
              data={sortedResults as Request[]}
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
                    <Text className="text-text ml-2">
                      Loading more requests...
                    </Text>
                  </View>
                ) : null
              }
              renderItem={({ item, index }) => (
                <RequestCard
                  request={item}
                  index={index}
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
              No requests found
            </Text>
            <Text className="text-muted text-center mt-2">
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
        type="requests"
        filters={filters}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    </View>
  );
};

export default Requests;