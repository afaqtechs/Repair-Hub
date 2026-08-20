import PartsCard from '@/src/components/cards/PartsCard';
import ServiceCard from '@/src/components/cards/ServiceCard';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import EmptyState from '@/src/components/ui/EmptyState';
import { useSavedParts, useSavedServices } from '@/src/hooks';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
const SavedItems = () => {
    const router = useRouter();

    const insets = useSafeAreaInsets()
    const [listView, setListView] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("parts");

    const {
        data: savedParts,
        isLoading: loadingParts,
        isRefetching: refetchingParts,
        error: partsError,
        refetch: refetchParts,
    } = useSavedParts();

    const {
        data: savedServices,
        isLoading: loadingServices,
        isRefetching: refetchingServices,
        error: serviceError,
        refetch: refetchServices,
    } = useSavedServices();

    const tabs =
        [
            {
                name: "Saved Parts",
                key: "parts"
            },
            {
                name: "Saved Services",
                key: "services"
            }
        ]

    const error = partsError || serviceError;
    const loading = loadingParts || loadingServices;

    if (error) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{error.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => {
                        refetchParts();
                        refetchServices();
                    }}>
                        <Text className="text-text font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const columns = listView ? 1 : 2;
    const isMasonry = listView ? false : true;

    const found = activeTab === "parts" ? savedParts?.length : savedServices?.length;

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg">
            <View className="px-5 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/profile")}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text">
                        Saved Items
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
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#60A5FA" />
                    <Text className="text-text mt-4">Loading services...</Text>
                </View>
            ) : (
                <>
                    <View className="px-5 pb-3 border-b border-border">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-text-muted text-base font-medium">
                                Found <Text className="font-bold text-primary">
                                    ({found})
                                </Text>
                            </Text>

                            <View className="flex-row items-center gap-2">

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

                    <View className="flex-1 mt-2">
                        {activeTab === "parts" ? (

                            <FlashList
                                data={(savedParts ?? []).filter((row) => row.parts)}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ padding: 10, paddingHorizontal: 10, paddingBottom: 100 }}
                                showsVerticalScrollIndicator={false}
                                numColumns={columns}
                                masonry={isMasonry}
                                refreshControl={
                                    <AppRefreshControl
                                        refreshing={refetchingParts || refetchingServices}
                                        onRefresh={() => {
                                            refetchParts();
                                            refetchServices();
                                        }}
                                    />
                                }
                                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                                renderItem={({ item, index }) => (

                                    <PartsCard
                                        part={item.parts}
                                        onUnsave={refetchParts}
                                        showListView={listView}
                                        showSave
                                        index={index}
                                    />
                                )}
                                ListEmptyComponent={
                                    <View className="flex-1 items-center justify-center py-24">
                                        <EmptyState title="No Saved Parts" description="No saved parts here" />
                                    </View>}
                            />
                        ) : (
                            <FlashList
                                data={savedServices}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ padding: 10, paddingHorizontal: 10, paddingBottom: 100 }}
                                showsVerticalScrollIndicator={false}
                                numColumns={columns}
                                masonry={isMasonry}
                                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                                renderItem={({ item, index }) => (
                                    <ServiceCard
                                        service={item.services}
                                        onUnsave={refetchServices}
                                        showListView={listView}
                                        showSave
                                        index={index}
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
                </>
            )}
        </View>
    )
}

export default SavedItems