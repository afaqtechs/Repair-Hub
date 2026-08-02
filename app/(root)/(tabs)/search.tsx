// app/search.tsx
import PartsCard from '@/components/cards/PartsCard';
import ServiceCard from '@/components/cards/ServiceCard';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SortModal from '@/components/ui/SortModal';
import { useTheme } from '@/context/ThemeContext';
import { useSearch } from '@/hooks/useSearch';
import { partStore, serviceStore } from '@/store';
import { Part } from '@/types/parts';
import { Service } from '@/types/services';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Search = () => {
    const { isDark } = useTheme();

    const [selectedType, setSelectedType] = useState<
        'parts' | 'services' | 'requests'
    >('parts');
    const [listView, setListView] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('recommended');

    useEffect(() => {
        fetchParts();
        fetchServices();
    }, []);

    const { parts, loadingParts, partError, fetchParts, loadMoreParts, loadingMoreParts } = partStore();
    const { services, loadingServices, serviceError, fetchServices, loadMoreServices, loadingMoreServices } = serviceStore();


    const partsSearch = useSearch({
        data: parts,
        type: 'parts'
    });

    const servicesSearch = useSearch({
        data: services,
        type: 'services'
    })

    const currentSearch = selectedType === 'parts' ? partsSearch : servicesSearch;

    const {
        searchQuery,
        setSearchQuery,
        results,
        resultCount,
        isSearching,
        recentSearches,
        isLoadingRecent,
        removeRecentSearch,
        clearRecentSearches,
    } = currentSearch;

    const types = [
        { label: 'Parts', value: 'parts' },
        { label: 'Services', value: 'services' },
        { label: 'Requests', value: 'requests' },
    ];

    const sortOptions = [
        { label: 'Recommended', value: 'recommended' },
        { label: 'Newest', value: 'newest' },
        { label: 'Lowest Price', value: 'lowest' },
        { label: 'Highest Price', value: 'highest' },
    ];

    const columns = listView ? 1 : 2;
    const isMasonry = listView ? false : true;
    const showRecentSearches = !isSearching && searchQuery.trim() === '';

    const handleRecentSearchPress = (query: string) => {
        setSearchQuery(query);
    };

    const sortedResults = React.useMemo(() => {
        const sorted = [...results];

        switch (sortValue) {
            case 'newest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return bTime - aTime;
                });
            case 'lowest':
                return sorted.sort((a, b) => Number(a.price) - Number(b.price));
            case 'highest':
                return sorted.sort((a, b) => Number(b.price) - Number(a.price));
            default:
                return sorted;
        }
    }, [results, sortValue]);

    const isLoading = selectedType === 'parts' ? loadingParts : loadingServices;

    const handleTypeChange = (type: 'parts' | 'services' | 'requests') => {
        setSelectedType(type);
        // setSearchQuery(''); 
    };

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            <View className="px-5 py-4">
                <View className="flex-row items-center gap-3">
                    <View className="flex-1 h-12 rounded-md flex-row items-center px-4 border bg-input dark:bg-input-dark border-border dark:border-border-dark">
                        <Ionicons
                            name="search"
                            size={20}
                            color={isDark ? '#94A3B8' : '#667085'}
                        />
                        <TextInput
                            autoFocus
                            keyboardType="default"
                            returnKeyType="search"
                            placeholder={`Search for ${selectedType}...`}
                            placeholderTextColor={isDark ? '#94A3B8' : '#9CA3AF'}
                            className="flex-1 ml-2 bg-input dark:bg-input-dark"
                            style={{
                                color: isDark ? '#F8FAFC' : '#0F172A',
                                fontSize: 16,
                            }}
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={isDark ? '#94A3B8' : '#9CA3AF'}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View className="w-12 h-12 rounded-md flex-row items-center justify-center bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                        <Ionicons
                            name="funnel"
                            size={24}
                            color={isDark ? '#94A3B8' : '#667085'}
                        />
                    </View>
                </View>
            </View>

            <View className="px-5 pb-3 flex-col gap-3 border-b border-border dark:border-border-dark">
                <View className="flex-row justify-between items-center gap-3">
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type.value}
                            onPress={() => handleTypeChange(type.value as any)}
                            className={`px-3 w-[31%] justify-center py-2 rounded-md flex-row items-center bg-card dark:bg-card-dark ${selectedType === type.value
                                ? 'border border-primary bg-primary'
                                : 'border border-border dark:border-border-dark'
                                }`}
                        >
                            <Text
                                className={`text-sm mr-1 ${selectedType === type.value
                                    ? 'text-white'
                                    : 'text-text dark:text-text-dark'
                                    }`}
                            >
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-text-muted dark:text-text-darkMuted text-base font-medium">
                        Found <Text className="font-bold text-primary">({resultCount})</Text>
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

            {isSearching ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#3B82F6'} />
                    <Text className="text-text dark:text-text-dark mt-4">Searching...</Text>
                </View>
            ) : (
                <View className="flex-1 pt-4">
                    {showRecentSearches ? (
                        // Recent Searches View
                        <View className='px-5'>
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-text dark:text-text-dark text-lg font-semibold">
                                    Recent Searches
                                </Text>
                                {recentSearches.length > 0 && (
                                    <TouchableOpacity onPress={() => setShowClearModal(true)}>
                                        <Text className="text-danger text-sm">Clear All</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {isLoadingRecent ? (
                                <View className="flex-1 justify-center items-center py-10">
                                    <ActivityIndicator size="small" color={isDark ? '#60A5FA' : '#3B82F6'} />
                                </View>
                            ) : recentSearches.length > 0 ? (
                                <View className="gap-3">
                                    {recentSearches.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => handleRecentSearchPress(item)}
                                            className="flex-row items-center justify-between py-1"
                                        >
                                            <View className="flex-row items-center flex-1">
                                                <View className="w-8 h-8 rounded-full items-center justify-center bg-input dark:bg-input-dark">
                                                    <Ionicons
                                                        name="time-outline"
                                                        size={16}
                                                        color={isDark ? '#94A3B8' : '#667085'}
                                                    />
                                                </View>
                                                <Text className="ml-3 text-text-secondary dark:text-text-dark font-medium flex-1">
                                                    {item}
                                                </Text>
                                            </View>
                                            <TouchableOpacity onPress={() => removeRecentSearch(item)} className="p-2">
                                                <Ionicons name="close" size={18} color="#EF4444" />
                                            </TouchableOpacity>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View className="flex-1 justify-center items-center py-10">
                                    <Ionicons
                                        name="search-outline"
                                        size={40}
                                        color={isDark ? '#64748B' : '#94A3B8'}
                                    />
                                    <Text className="text-text-secondary dark:text-text-darkMuted text-center mt-2">
                                        No recent searches
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        // Search Results View
                        <View className="flex-1">
                            {isLoading && results.length === 0 ? (
                                <View className="flex-1 justify-center items-center">
                                    <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#3B82F6'} />
                                    <Text className="text-text dark:text-text-dark mt-4">Loading...</Text>
                                </View>
                            ) : results.length > 0 ? (
                                <View className="flex-1 px-3">
                                    {selectedType === 'parts' ? (
                                        <FlashList
                                            key={columns}
                                            data={sortedResults as Part[]}
                                            keyExtractor={(item) => item.id}
                                            contentContainerStyle={{ paddingBottom: 50 }}
                                            showsVerticalScrollIndicator={false}
                                            numColumns={columns}
                                            masonry={isMasonry}
                                            onEndReached={loadMoreParts}
                                            onEndReachedThreshold={0.5}
                                            ListFooterComponent={
                                                (loadingMoreParts || loadingParts) ? (
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
                                    ) : (
                                        <FlashList
                                            key={columns}
                                            data={sortedResults as Service[]}
                                            keyExtractor={(item) => item.id}
                                            contentContainerStyle={{ paddingBottom: 50 }}
                                            showsVerticalScrollIndicator={false}
                                            numColumns={columns}
                                            masonry={isMasonry}
                                            onEndReached={loadMoreServices}
                                            onEndReachedThreshold={0.5}
                                            ListFooterComponent={
                                                (loadingMoreServices || loadingServices) ? (
                                                    <View className="flex-row justify-center items-center py-4">
                                                        <ActivityIndicator />
                                                        <Text className="text-text dark:text-text-dark ml-2">
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
                                    )}
                                </View>
                            ) : (
                                <View className="flex-1 justify-center items-center">
                                    <Ionicons
                                        name="search-outline"
                                        size={60}
                                        color={isDark ? '#64748B' : '#94A3B8'}
                                    />
                                    <Text className="text-text dark:text-text-dark text-lg font-semibold mt-4">
                                        No results found
                                    </Text>
                                    <Text className="text-text-secondary dark:text-text-darkMuted text-center mt-2">
                                        Try adjusting your search or filters
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            )}

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
        </SafeAreaView>
    );
};

export default Search;