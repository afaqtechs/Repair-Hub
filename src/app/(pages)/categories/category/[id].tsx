import PartsCard from '@/src/components/cards/PartsCard';
import ServiceCard from '@/src/components/cards/ServiceCard';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import EmptyState from '@/src/components/ui/EmptyState';
import SortModal from '@/src/components/ui/SortModal';
import { useCategory, usePartsByCategory, useServicesByCategory } from '@/src/hooks';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';

import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoryDetail = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [listView, setListView] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("parts");
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('recommended');
    const {
        data: category,
    } = useCategory(id);

    const {
        data: parts,
        isLoading: loadingParts,
        error: partsError,
        refetch: refetchParts,
    } = usePartsByCategory(id);

    const {
        data: services,
        isLoading: loadingServices,
        error: serviceError,
        refetch: refetchServices,
    } = useServicesByCategory(id);

    const sortOptions = [
        { label: 'Recommended', value: 'recommended' },
        { label: 'Newest', value: 'newest' },
        { label: 'Lowest Price', value: 'lowest' },
        { label: 'Highest Price', value: 'highest' },
    ];

    const tabs =
        [
            {
                name: "Parts",
                key: "parts"
            },
            {
                name: "Services",
                key: "services"
            },
            {
                name: "Requests",
                key: "requests"
            }
        ]

    const sortedResults = React.useMemo(() => {
        const sorts = (activeTab === "parts" || activeTab === "requests") ? parts : services;
        const sorted = [...sorts ?? []];

        switch (sortValue) {
            case 'newest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return bTime - aTime;
                });

            case 'lowest':
                return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

            case 'highest':
                return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

            default:
                return sorted;
        }
    }, [services, sortValue, activeTab, parts]);

    const error = partsError || serviceError;
    const loading = loadingParts || loadingServices

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
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{error.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => {
                        refetchParts();
                        refetchServices();
                    }}>
                        <Text className="text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const columns = listView ? 1 : 2;
    const isMasonry = listView ? false : true;

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg-dark"
        >
            <View className="px-5 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        {category?.name}
                    </Text>
                </View>
                <View className="flex-row mt-6">
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            onPress={() => setActiveTab(tab.key)}
                            className={`flex-1 pb-3 items-center ${activeTab === tab.key
                                ? "border-b-2 border-blue-500"
                                : ""
                                }`}
                        >
                            <Text
                                className={`font-medium ${activeTab === tab.key
                                    ? "text-blue-500"
                                    : "text-gray-500"
                                    }`}
                            >
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View className="px-5 pb-3 border-b border-border-dark">
                <View className="flex-row items-center justify-between">
                    <Text className="text-text-darkMuted text-base font-medium">
                        Found <Text className="font-bold text-primary">
                            ({sortedResults.length})
                        </Text>
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

            <View className="flex-1 mt-2">
                {activeTab === "parts" || activeTab === "requests" ? (

                    <FlashList
                        data={sortedResults}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 10, paddingHorizontal: 10, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        numColumns={columns}
                        masonry={isMasonry}
                        refreshControl={
                            <AppRefreshControl
                                refreshing={loadingParts}
                                onRefresh={() => {
                                    refetchParts();
                                }}
                            />
                        }
                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                        renderItem={({ item, index }) => (

                            <PartsCard
                                part={item}
                                index={index}
                                showListView={listView}
                                showSave
                            />
                        )}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-24">
                                <EmptyState title="No Saved Parts" description="No parts in this category" />
                            </View>}
                    />
                ) : (
                    <FlashList
                        data={sortedResults}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ padding: 10, paddingHorizontal: 10, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        numColumns={columns}
                        masonry={isMasonry}
                        refreshControl={
                            <AppRefreshControl
                                refreshing={loadingServices}
                                onRefresh={() => {
                                    refetchServices();
                                }}
                            />
                        }
                        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                        renderItem={({ item, index }) => (
                            <ServiceCard
                                service={item}
                                index={index}
                                showListView={listView}
                                showSave
                            />
                        )}
                        ListEmptyComponent={
                            <View className="flex-1 items-center justify-center py-24">
                                <EmptyState title="No Saved Services" description="No saved services here" />
                            </View>
                        }
                    />
                )}

            </View>

            <SortModal
                sortModalVisible={sortModalVisible}
                setSortModalVisible={setSortModalVisible}
                sortOptions={sortOptions}
                sortValue={sortValue}
                setSortValue={setSortValue}
            />
        </View>
    )
}

export default CategoryDetail