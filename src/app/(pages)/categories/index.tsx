import AppRefreshControl from '@/src/components/ui/AppRefreshControl';
import { useCategories } from '@/src/hooks';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const CategoryPage = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    data: categories = [],
    isLoading: loadingCategory,
    isRefetching: refetchingCategory,
    refetch: fetchCategories,
    error: categoryError,
  } = useCategories();

  if (categoryError) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
          <Text className="text-red-500 text-lg font-bold mt-4">Something went wrong</Text>
          <Text className="text-gray-500 text-sm text-center mt-2">{categoryError.message}</Text>
          <TouchableOpacity className="mt-6 bg-[#5B3DF5] px-6 py-3 rounded-xl" onPress={() => {
            fetchCategories();
          }}>
            <Text className="text-text font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Footer component for empty state or end of list
  const renderFooter = () => {
    if (categories.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-16 px-4">
          <Ionicons
            name="search-outline"
            size={60}
            color="#64748B"
          />
          <Text className={`text-lg font-manrope-semibold mt-4 text-center text-white`}>
            No categories found
          </Text>
          <Text className={`text-sm text-center mt-2 text-gray-400`}>
            Still not found your interests...
          </Text>
        </View>
      );
    }

    // Show at the end of the list
    return (
      <View className="py-8 px-4 items-center justify-center">
        <View className="flex-row items-center gap-2 mb-2">
          <Ionicons
            name="compass-outline"
            size={24}
            color="#64748B"
          />
          <Text className={`text-base font-manrope-medium text-gray-400`}>
            Still not found your interests?
          </Text>
          <Ionicons
            name="compass-outline"
            size={24}
            color="#64748B"
          />
        </View>
        <Text className={`text-sm text-center text-gray-500`}>
          Explore more categories to find what you love
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
      className="flex-1 bg-bg"
    >
      <View className="px-5 pt-2 pb-5 border-b border-border">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push("/(root)/(tabs)")}
            activeOpacity={0.7}
            className={`w-10 h-10 items-center justify-center rounded-2xl bg-card border border-border `}
          >
            <Ionicons name="arrow-back" size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text className={`ml-2 text-[18px] font-manrope-semibold text-text`}>
            Categories
          </Text>
        </View>
      </View>

      {loadingCategory ? (
        <View className="flex-1 items-center justify-center bg-bg">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlashList
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 10, paddingBottom: 5 }}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          refreshControl={
            <AppRefreshControl
              refreshing={refetchingCategory}
              onRefresh={() => {
                fetchCategories();
              }}
            />
          }
          ListFooterComponent={renderFooter}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: "/(pages)/categories/category/[id]",
                  params: { id: item.id },
                })
              }
              activeOpacity={0.7}
              className="m-1 h-[120px] rounded-xl bg-card items-center justify-between p-2 overflow-hidden"
            >
              <View className="w-full h-[80px] items-center justify-center rounded-xl">
                <Image
                  source={item.icon_url ? { uri: item.icon_url } : require("@/assets/ui/background/category_image.jpg")}
                  resizeMode="cover"
                  className="w-full h-full rounded-xl"
                />
              </View>
              <Text
                numberOfLines={1}
                className="text-[11px] font-manrope-semibold text-center w-full px-3 py-1 bg-primary/10 mt-2 text-primary rounded-lg"
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CategoryPage;