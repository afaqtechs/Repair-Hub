
import { useTheme } from '@/context/ThemeContext';
import { useSavedService } from '@/hooks/useSavedService';
import { Service } from '@/types/services';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const ServiceCard = ({ service, onUnsave, showSave = false, showListView = false, index }: {
  service: Service;
  onUnsave?: () => void;
  showListView?: boolean;
  showSave?: boolean;
  index?: number;
}) => {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedService(
    service.id,
    onUnsave
  );

  const { isDark } = useTheme();

  const imageSource = require("@/assets/ui/heroimage.png");

  const isListView = showListView;
  const isFeatured = index === 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/(root)/(services)/service/[id]",
          params: { id: service.id },
        })
      }
      className={`m-1 ${isListView ? "w-full flex-row" : "flex-col"} bg-card dark:bg-card-dark p-4 border border-border dark:border-border-dark overflow-hidden rounded-md`}
      style={{ elevation: 0 }}
    >
      <View className={`${isListView
        ? "w-[120px] h-[120px]"
        : isFeatured
          ? "w-full h-72"
          : "w-full h-48"
        } relative overflow-hidden`}>
        <Image
          source={imageSource}
          className="w-full h-full rounded-xl"
          resizeMode="cover"
        />
        {(showSave && !isListView) && (
          <TouchableOpacity
            onPress={toggleSave}
            disabled={saveLoading}
            className="absolute top-2 right-2"
            style={{ elevation: 4 }}
          >
            <Ionicons name="heart" size={20} color={isSaved ? "#EF4444" : isDark ? "#F8FAFC" : "#000000"} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content Section */}
      <View className={`${isListView ? "flex-1 justify-between" : ""}`}>
        <View>
          <Text className="text-success font-black text-xl">
            ETB {service?.price?.toLocaleString() ?? 0}
          </Text>
          <Text
            numberOfLines={2}
            className="text-sm font-manrope-semibold text-text dark:text-text-dark leading-5 min-h-[40px]"
          >
            {service.title ?? "Untitled Service"}
          </Text>

          {service?.estimated_duration && (
            <View className="self-start mt-3 px-3 py-1 rounded-full bg-primary/10">
              <Text className="text-primary text-xs font-semibold">
                ⏱ {service.estimated_duration}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border/30 dark:border-border-dark/30">
            <Text className="text-xs text-gray-600">
              {service?.category?.name || 'Uncategorized'}
            </Text>
          </View>

        </View>

        {(showSave && isListView) && (
          <TouchableOpacity
            onPress={toggleSave}
            disabled={saveLoading}
            className="absolute top-3 right-3"
          >
            <Ionicons name="heart" size={20} color={isSaved ? "#EF4444" : isDark ? "#F8FAFC" : "#000000"} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default ServiceCard