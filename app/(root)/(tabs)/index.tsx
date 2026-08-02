import ListCategory from '@/components/cards/CategoriesCard';
import HeroCards from '@/components/cards/HeroCards';
import PartsCard from '@/components/cards/PartsCard';
import { useTheme } from '@/context/ThemeContext';
import { categoryStore, partStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const { isDark } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const [refreshError, setRefreshError] = useState<string | null>(null);

    const { categories, loadingCategory, categoryError, fetchCategories, } = categoryStore();
    const { parts, loadingParts, partError, fetchParts, } = partStore();

    useEffect(() => {
        fetchCategories();
        fetchParts();
    }, []);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        setRefreshError(null);

        try {
            await Promise.all([
                fetchCategories(),
                fetchParts(),
            ]);
        } catch (err: any) {
            setRefreshError(err.message || "Failed to refresh data");
        } finally {
            setRefreshing(false);
        }
    }, [fetchCategories, fetchParts]);

    const loading = loadingCategory || loadingParts;

    return (
        <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg dark:bg-bg-dark">
            {/* Header */}
            <View className="flex-row justify-between items-center py-3 px-5 bg-bg dark:bg-bg-dark">
                <View>
                    <Text className="text-text dark:text-text-dark text-2xl font-bold">
                        Repair<Text className="text-primary">Hub</Text>
                    </Text>
                    <Text className="text-text-secondary dark:text-text-darkSecondary text-xs mt-0.5">
                        Find repair parts & experts
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    className="w-11 h-11 rounded-full bg-card dark:bg-card-dark border border-border dark:border-border-dark items-center justify-center"
                >
                    <Ionicons name="notifications-outline" size={22} color={isDark ? "#C4B5FD" : "#5B3DF5"} />
                    <View className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={["#3b82f6"]}
                            tintColor="#3b82f6"
                            title="Pull to refresh"
                            titleColor="#6b7280"
                        />
                    }
                    className="flex-1"
                >
                    <View className='flex-col gap-5 px-4'>
                        <HeroCards />
                        {categories.length > 0 && (
                            <View className='mt-4'>
                                <Text className="ml-1 text-[12px] font-manrope-semibold text-text dark:text-text-dark mb-1">
                                    Top Categories
                                </Text>
                                <FlashList
                                    data={categories.slice(0, 8)}
                                    keyExtractor={(item) => item.id}
                                    contentContainerStyle={{ paddingTop: 5, paddingBottom: 5 }}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={3}
                                    renderItem={({ item, index }) => (
                                        <ListCategory
                                            category={item}
                                            total={categories.length}
                                            index={index}
                                        />
                                    )}
                                />
                            </View>
                        )}
                    </View>

                    {parts.length > 0 && (
                        <View className='mt-8 px-3 py-8 bg-card/30 dark:bg-card-dark/30'>
                            <Text className="px-3 text-[12px] font-manrope-semibold text-text dark:text-text-dark mb-1">
                                Recommended for you
                            </Text>
                            <FlashList
                                data={parts.slice(0, 8)}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingTop: 5, paddingBottom: 50 }}
                                showsVerticalScrollIndicator={false}
                                numColumns={2}
                                masonry
                                renderItem={({ item, index }) => (
                                    <PartsCard
                                        part={item}
                                        index={index}
                                        showSave
                                    />
                                )}
                            />
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;