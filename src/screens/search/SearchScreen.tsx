import EmptySearch from '@/src/components/cards/EmptySearch';
import PartsCard from '@/src/components/cards/PartsCard';
import RecentSearches from '@/src/components/cards/RecentSearches';
import RequestCard from '@/src/components/cards/RequestCard';
import ServiceCard from '@/src/components/cards/ServiceCard';
import Filters from '@/src/components/common/Filters';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import ConfirmModal from '@/src/components/ui/ConfirmModal';
import SortModal from '@/src/components/ui/SortModal';
import { useTechniciansLocation } from '@/src/hooks';
import { useInfiniteParts } from '@/src/hooks/useParts';
import { useInfiniteRequests } from '@/src/hooks/useRequest';
import { useSearch } from '@/src/hooks/useSearch';
import { useInfiniteServices } from '@/src/hooks/useServices';
import { clearAllFilters, clearFilter, getActiveFilterCount, getFilterLabels } from '@/src/utils/filters';
import { FilterValues } from '@/types/filters';
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
  View
} from 'react-native';

type SearchType = 'parts' | 'services' | 'requests';
type SortValue = 'latest' | 'nearby' | 'lowest' | 'highest' | 'urgent';

const SearchScreen = () => {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<SearchType>('parts');
  const [listView, setListView] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortValue, setSortValue] = useState<SortValue>('latest');

  const [showFilters, setShowFilters] = useState(false);

  const type = selectedType;

  const [filters, setFilters] = useState<FilterValues>(clearAllFilters());

  const filterLabels = getFilterLabels(filters, type);

  const handleClearFilter = (key: keyof FilterValues) => {
    setFilters((prev) => clearFilter(prev, key));
  };

  const handleClearAll = () => {
    setFilters(clearAllFilters());
  };

  const activeFilterCount = getActiveFilterCount(filters, type);

  const {
    searchQuery,
    setSearchQuery,
    recentSearches,
    isLoadingRecent,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useSearch();

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const hasSearched = searchQuery.trim().length > 0;

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const {
    data: partsData,
    isLoading: isLoadingParts,
    isRefetching: isRefetchingParts,
    isFetchingNextPage: isFetchingNextParts,
    hasNextPage: hasNextParts,
    fetchNextPage: fetchNextParts,
    refetch: refetchParts,
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
    data: servicesData,
    isLoading: isLoadingServices,
    isRefetching: isRefetchingServices,
    isFetchingNextPage: isFetchingNextServices,
    hasNextPage: hasNextServices,
    fetchNextPage: fetchNextServices,
    refetch: refetchServices,
  } = useInfiniteServices({
    search: debouncedSearch,
    categoryId: filters.categoryId,
    platformId: filters.platformId,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    city: filters.city,
  });

  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    isRefetching: isRefetchingRequests,
    isFetchingNextPage: isFetchingNextRequests,
    hasNextPage: hasNextRequests,
    fetchNextPage: fetchNextRequests,
    refetch: refetchRequests,
  } = useInfiniteRequests({
    search: debouncedSearch,
    categoryId: filters.categoryId,
    platformId: filters.platformId,
    city: filters.city,
  });

  const refetching = isRefetchingParts || isRefetchingServices || isRefetchingRequests;

  const { data: technicianLocations = [] } = useTechniciansLocation();

  const distanceMap = useMemo(() => {
    return new Map(
      technicianLocations.map((location) => [
        location.id,
        Number(location.distance),
      ])
    );
  }, [technicianLocations]);

  const parts = useMemo(() => {
    return partsData?.pages.flatMap((page) => page.data ?? []) ?? [];
  }, [partsData]);

  const services = useMemo(() => {
    return servicesData?.pages.flatMap((page) => page.data ?? []) ?? [];
  }, [servicesData]);

  const requests = useMemo(() => {
    return requestsData?.pages.flatMap((page) => page.data ?? []) ?? [];
  }, [requestsData]);

  const partsWithDistance = useMemo(() => {
    return parts.map((part) => ({
      ...part,
      distance: distanceMap.get(part.technician_id),
    }));
  }, [parts, distanceMap]);

  const servicesWithDistance = useMemo(() => {
    return services.map((service) => ({
      ...service,
      distance: distanceMap.get(service.technician_id),
    }));
  }, [services, distanceMap]);

  const requestsWithDistance = useMemo(() => {
    return requests.map((request) => ({
      ...request,
      distance: distanceMap.get(request.technician_id),
    }));
  }, [requests, distanceMap]);

  const activeResults = useMemo(() => {
    if (selectedType === 'parts') {
      return partsWithDistance;
    }
    if (selectedType === 'services') {
      return servicesWithDistance;
    }
    if (selectedType === 'requests') {
      return requestsWithDistance;
    }
    return [];
  }, [selectedType, partsWithDistance, servicesWithDistance, requestsWithDistance]);

  const isLoadingData =
    selectedType === 'parts'
      ? isLoadingParts
      : selectedType === 'services'
        ? isLoadingServices
        : isLoadingRequests;

  const isFetchingNext =
    selectedType === 'parts'
      ? isFetchingNextParts
      : selectedType === 'services'
        ? isFetchingNextServices
        : isFetchingNextRequests;

  const totalCount = useMemo(() => {
    if (selectedType === 'parts') {
      return partsData?.pages[0]?.totalCount ?? parts.length;
    }
    if (selectedType === 'services') {
      return servicesData?.pages[0]?.totalCount ?? services.length;
    }
    if (selectedType === 'requests') {
      return requestsData?.pages[0]?.totalCount ?? requests.length;
    }
    return 0;
  }, [
    partsData,
    parts.length,
    requestsData,
    requests.length,
    selectedType,
    servicesData,
    services.length,
  ]);

  const handleLoadMore = () => {
    if (selectedType === 'parts' && hasNextParts && !isFetchingNextParts) {
      fetchNextParts();
    } else if (
      selectedType === 'services' &&
      hasNextServices &&
      !isFetchingNextServices
    ) {
      fetchNextServices();
    } else if (
      selectedType === 'requests' &&
      hasNextRequests &&
      !isFetchingNextRequests
    ) {
      fetchNextRequests();
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    addRecentSearch(query);
  };

  // Conditional sort options based on selected type
  const sortOptions = useMemo(() => {
    const baseOptions = [
      { label: 'Latest', value: 'latest' as SortValue },
      { label: 'Nearby', value: 'nearby' as SortValue },
    ];

    if (selectedType === 'requests') {
      return [
        ...baseOptions,
        { label: 'Urgent', value: 'urgent' as SortValue },
      ];
    } else {
      return [
        ...baseOptions,
        { label: 'Lowest Price', value: 'lowest' as SortValue },
        { label: 'Highest Price', value: 'highest' as SortValue },
      ];
    }
  }, [selectedType]);

  // Reset sort value when switching types to avoid invalid sort options
  useEffect(() => {
    if (selectedType === 'requests' && (sortValue === 'lowest' || sortValue === 'highest')) {
      setSortValue('latest');
    } else if (selectedType !== 'requests' && sortValue === 'urgent') {
      setSortValue('latest');
    }
  }, [selectedType, sortValue]);

  const sortedResults = useMemo(() => {
    const sorted = [...activeResults];

    switch (sortValue) {
      case 'latest':
        return sorted.sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return bTime - aTime;
        });

      case 'nearby':
        return sorted.sort((a, b) => {
          const aDistance = a.distance ?? Number.POSITIVE_INFINITY;
          const bDistance = b.distance ?? Number.POSITIVE_INFINITY;
          return aDistance - bDistance;
        });

      case 'lowest':
      case 'highest':
        // Price sorting is only valid for parts/services
        if (selectedType === 'requests') {
          return sorted;
        }
        return sorted.sort((a, b) => {
          const aPrice = 'price' in a ? Number(a.price ?? 0) : 0;
          const bPrice = 'price' in b ? Number(b.price ?? 0) : 0;
          return sortValue === 'lowest' ? aPrice - bPrice : bPrice - aPrice;
        });

      case 'urgent':
        // Priority sorting is only valid for requests
        if (selectedType !== 'requests') {
          return sorted;
        }
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
  }, [activeResults, sortValue, selectedType]);

  const types: { label: string; value: SearchType }[] = [
    { label: 'Parts', value: 'parts' },
    { label: 'Services', value: 'services' },
    { label: 'Requests', value: 'requests' },
  ];

  const columns = listView ? 1 : 2;
  const showRecentSearches = searchQuery.trim() === '';
  const isMasonry = !listView;

  // Render function for cards
  const renderCard = ({ item, index }: { item: any; index: number }) => {
    if (selectedType === 'parts') {
      return (
        <PartsCard
          part={item}
          index={index}
          showSave
          showListView={listView}
        />
      );
    } else if (selectedType === 'services') {
      return (
        <ServiceCard
          service={item}
          index={index}
          showSave
          showListView={listView}
        />
      );
    } else if (selectedType === 'requests') {
      return (
        <RequestCard
          request={item}
          index={index}
          showListView={listView}
        />
      );
    }
    return null;
  };

  const refetchData = () => {
    if (selectedType === 'parts') {
      refetchParts();
    } else if (selectedType === 'services') {
      refetchServices();
    } else if (selectedType === 'requests') {
      refetchRequests();
    }
  };

  return (
    <>
      {/* Header / Search Input */}
      <View className="px-5 py-3">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="w-11 h-11 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <View className="flex-1 h-12 rounded-md flex-row items-center px-4 border bg-input-dark/30 border-border-dark">
            <Ionicons
              name="search"
              size={20}
              color="#94A3B8"
            />
            <TextInput
              autoFocus
              keyboardType="default"
              returnKeyType="search"
              placeholder={`Search for ${selectedType}...`}
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 "
              style={{
                color: "#F8FAFC",
                fontSize: 16,
              }}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearchSubmit}
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
            <TouchableOpacity
              onPress={() => setShowFilters(true)}
              className="w-12 h-12 rounded-md flex-row items-center justify-center bg-card-dark border border-border-dark"
            >
              <Ionicons
                name="funnel-outline"
                size={24}
                color="#94A3B8"
              />
            </TouchableOpacity>
            {activeFilterCount > 0 && (
              <View className="absolute -top-3 -right-2 px-1.5 py-0.5 rounded-full bg-primary">
                <Text className="text-white text-xs font-bold">
                  {activeFilterCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Segment Controls & Sorting Bar */}
      <View className="px-5 pb-3 flex-col gap-3 border-b border-border-dark">

        {filterLabels.length > 0 ? (

          <View className="flex-row items-center justify-between gap-2">
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
        ) : (
          <View className="flex-row justify-between items-center gap-3">
            {types.map((type) => (
              <TouchableOpacity
                key={type.value}
                onPress={() => setSelectedType(type.value)}
                className={`px-3 w-[31%] justify-center py-2 rounded-md flex-row items-center ${selectedType === type.value
                  ? 'border border-primary bg-primary'
                  : 'border border-border-dark bg-card-dark'
                  }`}
              >
                <Text
                  className={`text-sm mr-1 ${selectedType === type.value
                    ? 'text-white font-medium'
                    : 'text-text-dark'
                    }`}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View className="flex-row items-center justify-between">
          <Text className="text-text-darkMuted text-base font-medium">
            Found {hasSearched && (
              <Text className="font-bold text-primary">({totalCount})</Text>
            )}
          </Text>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => setSortModalVisible(true)}
              className="w-10 h-10 rounded-md border border-border-dark bg-card-dark items-center justify-center"
            >
              <Ionicons
                name="swap-vertical-outline"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setListView(!listView)}
              className="w-10 h-10 rounded-md border border-border-dark bg-card-dark items-center justify-center"
            >
              <Ionicons
                name={listView ? 'grid-outline' : 'list-outline'}
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Body */}
      <View className="flex-1 pt-4">
        <View className="flex-1 pt-4">
          {showRecentSearches ? (
            recentSearches.length > 0 ? (
              /* Recent Searches */
              <View className="px-5 flex-col">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-text-dark text-lg font-semibold">
                    Recent Searches
                  </Text>

                  {recentSearches.length > 1 && (
                    <TouchableOpacity
                      onPress={() => setShowClearModal(true)}
                    >
                      <Text className="text-danger text-sm">
                        Clear All
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {isLoadingRecent ? (
                  <View className="flex-1 justify-center items-center py-10">
                    <ActivityIndicator
                      size="small"
                      color="#60A5FA"
                    />
                  </View>
                ) : (
                  <RecentSearches
                    searches={recentSearches}
                    onPress={handleRecentSearchPress}
                    onRemove={removeRecentSearch}
                  />
                )}
              </View>
            ) : (
              /* No recent searches */
              <EmptySearch
                type={type}
                onSuggestionPress={handleRecentSearchPress}
              />
            )
          ) : (
            /* Search Results */
            <View className="flex-1">
              {isLoadingData && sortedResults.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator
                    size="large"
                    color="#60A5FA"
                  />

                  <Text className="-text-dark mt-4">
                    Loading...
                  </Text>
                </View>
              ) : sortedResults.length > 0 ? (
                <View className="flex-1 px-3">
                  <FlashList
                    key={`${selectedType}-${columns}`}
                    data={sortedResults}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{
                      paddingBottom: 50,
                    }}
                    showsVerticalScrollIndicator={false}
                    numColumns={columns}
                    masonry={isMasonry}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    refreshControl={
                      <AppRefreshControl
                        refreshing={refetching}
                        onRefresh={refetchData}
                      />
                    }
                    ListFooterComponent={
                      isFetchingNext ? (
                        <View className="flex-row justify-center items-center py-4">
                          <ActivityIndicator
                            color="#60A5FA"
                          />

                          <Text className="text-text-dark ml-2">
                            Loading more {selectedType}...
                          </Text>
                        </View>
                      ) : null
                    }
                    renderItem={renderCard}
                  />
                </View>
              ) : (
                <EmptySearch
                  type={type}
                  query={searchQuery}
                  onSuggestionPress={handleRecentSearchPress}
                />
              )}
            </View>
          )}
        </View>
      </View>

      {/* Modals */}
      <ConfirmModal
        visible={showClearModal}
        title="Clear Recent Searches"
        message="Are you sure you want to clear all recent searches?"
        confirmText="Clear All"
        destructive
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => {
          clearRecentSearches();
          setShowClearModal(false);
        }}
      />
      
      <SortModal
        sortModalVisible={sortModalVisible}
        setSortModalVisible={setSortModalVisible}
        sortOptions={sortOptions}
        sortValue={sortValue}
        setSortValue={setSortValue}
      />

      <Filters
        visible={showFilters}
        filters={filters}
        type={type}
        onClose={() => setShowFilters(false)}
        onApply={(newFilters) => {
          setFilters(newFilters);
        }}
      />
    </>
  );
};

export default SearchScreen;