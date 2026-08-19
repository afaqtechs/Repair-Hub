import { useAuth } from '@/src/context/AuthContext';
import { useServiceMutations, useTechnicianLocation } from '@/src/hooks';
import { useSavedService } from '@/src/hooks/useSavedService';
import { showError, showSuccess } from '@/src/lib/toast';
import { Service } from '@/types/services';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import SimpleDropdownMenu from '../common/CustomDropDown';

type ServiceCardProps = {
  service: Service;
  onUnsave?: () => void;
  onEdit?: () => void;
  showListView?: boolean;
  showSave?: boolean;
  index?: number;
  allowEdit?: boolean;
};

const ServiceCard = ({
  service,
  onUnsave,
  onEdit,
  showSave = false,
  showListView = false,
  index,
  allowEdit = false,
}: ServiceCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const loggedInUserId = user?.id;
  const technicianId = service?.technician_id;

  const menuItems = [
    ...(allowEdit
      ? [
        {
          label: 'Edit',
          value: 'edit',
          icon: 'create-outline',
        },
      ]
      : []),

    {
      label: service.is_active
        ? 'Mark Inactive'
        : 'Mark Active',
      value: 'toggle-active',
      icon: service.is_active
        ? 'eye-off-outline'
        : 'eye-outline',
    },

    {
      label: 'Delete',
      value: 'delete',
      icon: 'trash-outline',
      destructive: true,
    },
  ];

  const { isSaved, saveLoading, toggleSave } = useSavedService(service.id, onUnsave);
  const { data: technicianLocation } = useTechnicianLocation(technicianId);
  const { deleteService, updateServiceStatus } = useServiceMutations();

  const distance = technicianLocation?.distance ?? null;

  const imageSource = service?.images?.[0]
    ? { uri: service.images[0] }
    : require("@/assets/ui/heroimage.png");

  const handleMenuAction = async (value: string) => {
    switch (value) {
      case 'edit':
        onEdit?.();
        break;

      case 'toggle-active':
        try {
          await updateServiceStatus.mutateAsync({
            id: service.id,
            isAvailable: !service.is_active,
          });
          showSuccess('Updated', 'Service status updated');
        } catch (error: any) {
          showError('Failed to update:', error.message);
        }
        break;

      case 'delete':
        try {
          await deleteService.mutateAsync(service.id);
          showSuccess('Deleted', 'Service deleted from database');
        } catch (error: any) {
          showError('Failed to delete service:', error.message);
        }
        break;
    }
  };

  const isOwner = loggedInUserId === technicianId;
  const isListView = showListView;
  const isFeatured = index === 0;

  return (
    <View
      className={`m-1 ${isListView ? "w-full flex-row items-center" : "flex-col"} bg-card-dark/50 p-2 border border-border-dark overflow-hidden rounded-md`}
      style={{ elevation: 0 }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push({ pathname: "/(pages)/services/service/[id]", params: { id: service.id } })}
        className={`${isListView ? "w-[120px] h-[120px]" : isFeatured ? "w-full h-72" : "w-full h-48"} relative overflow-hidden`}
      >
        <Image source={imageSource} className="w-full h-full rounded-md" resizeMode="cover" />
        {(showSave && !isListView) && (
          <TouchableOpacity
            onPress={() => toggleSave()}
            disabled={saveLoading}
            className="absolute top-2 right-2 bg-bg-dark rounded-full p-2 items-center justify-center"
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={20}
              color={isSaved ? "#EF4444" : "#ffffff"}
            />
          </TouchableOpacity>
        )}


        {isOwner && !service?.is_active && (
          <View className={`absolute bottom-2 left-2 self-start px-3 py-1 rounded-full ${service?.is_active
            ? "bg-success"
            : "bg-danger"
            }`}>
            <Text className={`text-xs font-manrope-semibold text-white`}>
              {service?.is_active ? "Active" : "In Active"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <View className={`${isListView ? "flex-1 justify-between ml-3" : "mt-3"}`}>
        <View>
          <Text className="text-success font-black text-xl">
            ETB {service?.price?.toLocaleString() ?? 0}
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: "/(pages)/services/service/[id]", params: { id: service.id } })}
            className="self-start"
            style={Platform.select({
              web: {
                cursor: 'pointer',
                transition: 'opacity 0.2s ease',
              },
            })}
          >
            <Text
              numberOfLines={2}
              className="text-sm font-manrope-semibold text-text-dark leading-5 min-h-[40px] hover:opacity-70"
              style={Platform.select({
                web: {
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                },
              })}
            >
              {service.title ?? "Untitled Service"}
            </Text>
          </TouchableOpacity>

          {service?.estimated_duration && (
            <View className="self-start mt-3 px-3 py-1 rounded-full bg-primary/10">
              <Text className="text-primary text-xs font-semibold">
                ⏱ {service.estimated_duration}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border-dark/30">
            <Text className="text-xs text-gray-400">
              {service?.category?.name || 'Uncategorized'}
            </Text>

            {isOwner ? (
              <SimpleDropdownMenu
                items={menuItems}
                onSelect={handleMenuAction}
                triggerIcon="ellipsis-vertical"
                triggerSize={18}
              />
            ) : (
              (distance !== null && distance !== undefined && !isOwner) && (
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text className="ml-1 text-xs text-gray-500 font-manrope-medium">
                    {distance} km away
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {(showSave && isListView) && (
          <TouchableOpacity
            onPress={() => toggleSave()}
            disabled={saveLoading}
            className="absolute top-2 right-2 bg-bg-dark rounded-full p-2 items-center justify-center"
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={20}
              color={isSaved ? "#EF4444" : "#ffffff"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default ServiceCard;