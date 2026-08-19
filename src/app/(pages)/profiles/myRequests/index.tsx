import RequestCard from '@/src/components/cards/RequestCard';
import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import SortModal from '@/src/components/ui/SortModal';
import { useAuth } from '@/src/context/AuthContext';
import { useRequestsByTechnician } from '@/src/hooks';
import RequestForm from '@/src/screens/create/RequestForm';
import { Request } from '@/types/requests';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const MyRequests = () => {
    const router = useRouter();

    const { user } = useAuth();

    const insets = useSafeAreaInsets()

    const loggedInUserId = String(user?.id)

    const [listView, setListView] = useState(false);
    const [sortModalVisible, setSortModalVisible] = useState(false);
    const [sortValue, setSortValue] = useState('latest');
    const [editingRequest, setEditingRequest] = useState<Request | null>(null);

    const {
        data: requests,
        isLoading: loadingRequest,
        isRefetching,
        error: requestError,
        refetch: fetchRequests
    } = useRequestsByTechnician(loggedInUserId);

    const sortOptions = [
        { label: 'Latest', value: 'latest' },
        { label: 'Urgent', value: 'urgent' },
        { label: 'Active Requests', value: 'active' },
        { label: 'InActive Requests', value: 'inactive' },
    ];

    const sortedResults = useMemo(() => {
        const sorted = [...(requests ?? [])];

        switch (sortValue) {
            case 'latest':
                return sorted.sort((a, b) => {
                    const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
                    const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
                    return bTime - aTime;
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

            case 'active':
                return sorted.sort(
                    (a, b) => Number(b.is_active) - Number(a.is_active)
                );

            case 'inactive':
                return sorted.sort(
                    (a, b) => Number(a.is_active) - Number(b.is_active)
                );

            default:
                return sorted;
        }
    }, [requests, sortValue]);

    if (requestError) {
        return (
            <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg-dark">
                <View className="flex-1 items-center justify-center px-4">
                    <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
                    <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
                    <Text className="text-gray-500 text-sm text-center mt-2">{requestError.message}</Text>
                    <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => {
                        fetchRequests();
                    }}>
                        <Text className="text-text-dark font-semibold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleCloseForm = () => {
        setEditingRequest(null);
    };

    const columns = listView ? 1 : 2;
    const isMasonry = listView ? false : true;

    if (editingRequest) {
        return (
            <View
                style={{
                    flex: 1,
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
                className="bg-bg-dark"
            >
                <RequestForm
                    isEdit
                    request={editingRequest}
                    onCancel={handleCloseForm}
                />
            </View>
        );
    }

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
            className="relative flex-1 bg-bg-dark">
            <View className="px-5 pt-2 pb-5">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/(root)/(tabs)/profile")}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        My Requests
                    </Text>
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

            <View className="flex-1 pt-3">
                {loadingRequest ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator
                            size="large"
                            color="#60A5FA"
                        />
                        <Text className="text-text-dark mt-4">
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
                            onEndReachedThreshold={0.5}
                            refreshControl={
                                <AppRefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={fetchRequests}
                                />
                            }
                            ListFooterComponent={
                                <View className="flex-row justify-center items-center py-4">
                                    <Text className="text-text-dark ml-2">
                                        No more requests...
                                    </Text>
                                </View>
                            }
                            renderItem={({ item, index }) => (
                                <RequestCard
                                    request={item}
                                    index={index}
                                    showListView={listView}
                                    allowEdit={true}
                                    onEdit={() => setEditingRequest(item)}
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
                        <Text className="text-text-dark text-lg font-semibold mt-4">
                            No requests found
                        </Text>
                        <Text className="text-text-darkMuted text-center mt-2">
                            Try adjusting your search or filters
                        </Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                onPress={() => router.push("/(pages)/create/request")}
                className="absolute w-16 h-16 bottom-16 right-5 rounded-full border border-primary/10 bg-primary items-center justify-center"
            >
                <Ionicons
                    name="add"
                    size={32}
                    color="#ffffff"
                />
            </TouchableOpacity>

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

export default MyRequests