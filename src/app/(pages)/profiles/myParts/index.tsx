import PartsCard from '@/src/components/cards/PartsCard';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import SortModal from '@/src/components/ui/SortModal';
import { useAuth } from '@/src/context/AuthContext';
import { usePartByTechnician, useTechnician } from '@/src/hooks';
import PartForm from '@/src/screens/create/PartForm';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const MyParts = () => {
    const router = useRouter();

    const { user } = useAuth();

    const insets = useSafeAreaInsets()

    const loggedInUserId = String(user?.id)

    const { data: technician } = useTechnician(loggedInUserId);

    const [listView, setListView] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('latest');
    const [editingPart, setEditingPart] = useState<Part | null>(null);

    const {
        data: parts,
        isLoading: loadingPart,
        isRefetching,
        error: partError,
        refetch: fetchParts
    } = usePartByTechnician(loggedInUserId);

    const sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Lowest Price', value: 'lowest' },
        { label: 'Highest Price', value: 'highest' },
        { label: 'Available Parts', value: 'available' },
        { label: 'UnAvailable Parts', value: 'unavailable' },
    ];

    const sortedResults = useMemo(() => {
        const sorted = [...(parts ?? [])];

        switch (sortValue) {
            case 'latest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return bTime - aTime;
                });

            case 'lowest':
                return sorted.sort((a, b) => Number(a.price) - Number(b.price));

            case 'highest':
                return sorted.sort((a, b) => Number(b.price) - Number(a.price));

            case 'available':
                return sorted.sort(
                    (a, b) => Number(b.is_available) - Number(a.is_available)
                );

            case 'unavailable':
                return sorted.sort(
                    (a, b) => Number(a.is_available) - Number(b.is_available)
                );

            default:
                return sorted;
        }
    }, [parts, sortValue]);

    if (partError) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{partError.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => {
                        fetchParts();
                    }}>
                        <Text className="text-text font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleCloseForm = () => {
        setEditingPart(null);
    };

    const columns = listView ? 1 : 2;
    const isMasonry = listView ? false : true;

    if (editingPart) {
        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
                className="bg-bg"
            >
                <PartForm
                    isEdit
                    part={editingPart}
                    onCancel={handleCloseForm}
                />
            </View>
        );
    }

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="relative flex-1 bg-bg">
            <View className="px-5 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/profile")}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border"
                    >
                        <Ionicons name="arrow-back" size={20} color="1F2937" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[18px] font-manrope-semibold text-text">
                        My Parts
                    </Text>
                </View>
            </View>

            <View className="px-5 pb-3 border-b border-border">
                <View className="flex-row items-center justify-between">
                    <Text className="text-text-muted text-base font-medium">
                        Found <Text className="font-bold text-primary">
                            ({sortedResults.length})
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
                                color="#1F2937"
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
                {loadingPart ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator
                            size="large"
                            color="#60A5FA"
                        />
                        <Text className="text-text mt-4">
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
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <AppRefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={fetchParts}
                                />
                            }
                            ListFooterComponent={
                                <View className="flex-row justify-center items-center py-4">
                                    <Text className="text-text ml-2">
                                        No more parts...
                                    </Text>
                                </View>
                            }
                            renderItem={({ item, index }) => (
                                <PartsCard
                                    part={item}
                                    index={index}
                                    showSave
                                    showListView={listView}
                                    allowEdit={true}
                                    onEdit={() => setEditingPart(item)}
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
                            No parts found
                        </Text>
                        <Text className="text-text-muted text-center mt-2">
                            Try adjusting your search or filters
                        </Text>
                    </View>
                )}
            </View>
            {technician?.verification_status === "verified" && (
                <TouchableOpacity
                    onPress={() => router.push("/(pages)/create/part")}
                    className="absolute w-16 h-16 bottom-16 right-5 rounded-full border border-primary/10 bg-primary items-center justify-center"
                >
                    <Ionicons
                        name="add"
                        size={32}
                        color="#ffffff"
                    />
                </TouchableOpacity>
            )}

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

export default MyParts