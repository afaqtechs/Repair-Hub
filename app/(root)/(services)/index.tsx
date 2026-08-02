import ServiceCard from '@/components/cards/ServiceCard'
import SortModal from '@/components/ui/SortModal'
import { useTheme } from '@/context/ThemeContext'
import { useSearch } from '@/hooks/useSearch'
import { serviceStore } from '@/store'
import { Service } from '@/types/services'
import { Ionicons } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Services = () => {
    const { isDark } = useTheme();
    const router = useRouter();

    const [listView, setListView] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('recommended');

    useEffect(() => {
        fetchServices();
    }, []);

    const {
        services,
        loadingServices,
        serviceError,
        fetchServices,
        loadMoreServices,
        loadingMoreServices
    } = serviceStore();

    const {
        searchQuery,
        setSearchQuery,
        results,
        resultCount,
        isSearching,
    } = useSearch({ data: services, type: "services" });

    const sortOptions = [
        { label: 'Recommended', value: 'recommended' },
        { label: 'Newest', value: 'newest' },
        { label: 'Lowest Price', value: 'lowest' },
        { label: 'Highest Price', value: 'highest' },
    ];

    const columns = listView ? 1 : 2;
    const isMasonry = listView ? false : true;

    const displayData = searchQuery.trim() === '' ? services : results;

    const sortedResults = React.useMemo(() => {
        const sorted = [...displayData];

        switch (sortValue) {
            case 'newest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at
                        ? new Date(a.created_at).getTime()
                        : 0;

                    const bTime = b.created_at
                        ? new Date(b.created_at).getTime()
                        : 0;

                    return bTime - aTime;
                });

            case 'lowest':
                return sorted.sort(
                    (a, b) => Number(a.price) - Number(b.price)
                );

            case 'highest':
                return sorted.sort(
                    (a, b) => Number(b.price) - Number(a.price)
                );

            default:
                return sorted;
        }
    }, [displayData, sortValue]);

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            className="flex-1 bg-bg dark:bg-bg-dark"
        >
            <View className="px-5 py-4">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-11 h-11 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={isDark ? '#94A3B8' : '#667085'}
                        />
                    </TouchableOpacity>
                    <View
                        className="flex-1 h-12 rounded-md flex-row items-center px-4 border bg-input dark:bg-input-dark border-border dark:border-border-dark"
                    >
                        <Ionicons
                            name="search"
                            size={20}
                            color={isDark ? '#94A3B8' : '#667085'}
                        />

                        <TextInput
                            keyboardType="default"
                            returnKeyType="search"
                            placeholder="Search for services..."
                            placeholderTextColor={isDark ? '#94A3B8' : '#9CA3AF'}
                            className="flex-1 ml-2 bg-input dark:bg-input-dark"
                            style={{
                                color: isDark ? '#F8FAFC' : '#0F172A',
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

            <View className="px-5 pb-3 border-b border-border dark:border-border-dark">
                <View className="flex-row items-center justify-between">
                    <Text className="text-text-muted dark:text-text-darkMuted text-base font-medium">
                        Found <Text className="font-bold text-primary">
                            ({searchQuery.trim() === '' ? services.length : resultCount})
                        </Text>
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
                <View className="flex-1 pt-3">
                    <View className="flex-1">
                        {loadingServices && services.length === 0 ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color={isDark ? '#60A5FA' : '#3B82F6'} />
                                <Text className="text-text dark:text-text-dark mt-4">Loading services...</Text>
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
                            </View>
                        ) : (
                            <View className="flex-1 justify-center items-center">
                                <Ionicons
                                    name="search-outline"
                                    size={60}
                                    color={isDark ? '#64748B' : '#94A3B8'}
                                />
                                <Text className="text-text dark:text-text-dark text-lg font-semibold mt-4">
                                    No services found
                                </Text>
                                <Text className="text-text-secondary dark:text-text-darkMuted text-center mt-2">
                                    Try adjusting your search or filters
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            <SortModal
                sortModalVisible={sortModalVisible}
                setSortModalVisible={setSortModalVisible}
                sortOptions={sortOptions}
                sortValue={sortValue}
                setSortValue={setSortValue}
            />
        </SafeAreaView>
    )
}

export default Services