import { useAuth } from '@/src/context/AuthContext';
import { usePartsMutations, useTechnicianLocation } from '@/src/hooks';
import { useSavedPart } from '@/src/hooks/useSavedPart';
import { showError, showSuccess } from '@/src/lib/toast';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import SimpleDropdownMenu from '../common/CustomDropDown';

type PartsCardProps = {
    part: Part;
    onUnsave?: () => void;
    onEdit?: () => void;
    showListView?: boolean;
    showSave?: boolean;
    index?: number;
    allowEdit?: boolean;
};

const PartsCard = ({
    part,
    onUnsave,
    onEdit,
    showSave = false,
    showListView = false,
    index,
    allowEdit = false,
}: PartsCardProps) => {
    const router = useRouter();
    const { user } = useAuth();
    const loggedInUserId = user?.id;
    const technicianId = part?.technician_id;

    const menuItems = [
        ...(allowEdit ? [{ label: 'Edit', value: 'edit', icon: 'create-outline' }] : []),
        { label: part.is_available ? 'Mark Unavailable' : 'Mark Available', value: 'toggle-available', icon: part.is_available ? 'eye-off-outline' : 'eye-outline' },
        { label: 'Delete', value: 'delete', icon: 'trash-outline', destructive: true },
    ];

    const { isSaved, saveLoading, toggleSave } = useSavedPart(part.id, onUnsave);
    const { data: technicianLocation } = useTechnicianLocation(technicianId);
    const { deletePart, updatePartAvailability } = usePartsMutations();

    const distance = technicianLocation?.distance ?? null;

    const imageSource = part?.images?.[0]
        ? { uri: part.images[0] }
        : require("@/assets/ui/heroimage.png");

    const handleMenuAction = async (value: string) => {
        switch (value) {
            case 'edit':
                onEdit?.();
                break;

            case 'toggle-available':
                try {
                    await updatePartAvailability.mutateAsync({
                        id: part.id,
                        isAvailable: !part.is_available,
                    });
                    showSuccess('Updated', 'Part availability updated');
                } catch (error: any) {
                    showError('Failed to update:', error.message);
                }
                break;

            case 'delete':
                try {
                    await deletePart.mutateAsync(part.id);
                    showSuccess('Deleted', 'Part deleted from database');
                } catch (error: any) {
                    showError('Failed to delete part:', error.message);
                }
                break;
        }
    };

    const isOwner = loggedInUserId === technicianId;
    const isListView = showListView;
    const isFeatured = index === 0;

    const getConditionColor = (condition: string) => {
        const conditionLower = condition?.toLowerCase() || '';
        if (conditionLower.includes('new')) return '#10B981';
        if (conditionLower.includes('slightly used')) return '#34D399';
        if (conditionLower.includes('refurbished')) return '#F59E0B';
        if (conditionLower.includes('used')) return '#F97316';
        if (conditionLower.includes('damaged')) return '#EF4444';
        return '#6B7280';
    };

    return (
        <View
            className={`m-1 ${isListView ? "w-full flex-row items-center" : "flex-col"} bg-card-dark p-2 border border-border-dark overflow-hidden rounded-md`}
            style={{ elevation: 0 }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: "/(pages)/parts/part/[id]", params: { id: part.id } })}
                className={`${isListView ? "w-[120px] h-[140px]" : isFeatured ? "w-full h-72" : "w-full h-48"} relative overflow-hidden`}
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
                {isOwner && !part?.is_available && (
                    <View className={`absolute bottom-2 left-2 self-start px-3 py-1 rounded-full ${part?.is_available
                        ? "bg-success"
                        : "bg-danger"
                        }`}>
                        <Text className={`text-xs font-manrope-semibold text-white`}>
                            {part?.is_available ? "Available" : "Un Available"}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <View className={`${isListView ? "flex-1 justify-between ml-3" : "mt-3"}`}>
                <View>
                    <Text className="text-success font-black text-xl">
                        ETB {part?.price?.toLocaleString() ?? 0}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.push({ pathname: "/(pages)/parts/part/[id]", params: { id: part.id } })}
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
                            {part.title ?? "Untitled Part"}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mt-1">
                        <Ionicons name="business-outline" size={12} color="#9CA3AF" />
                        <Text numberOfLines={1} className="text-xs text-text-darkMuted ml-1 flex-1">
                            {part.brand ?? "Unknown Brand"}
                            {part.model ? ` • ${part.model}` : ""}
                        </Text>
                    </View>

                    {part?.technician?.city && (
                        <View className="flex-row items-center mt-0.5">
                            <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                            <Text numberOfLines={1} className="text-xs text-text-darkMuted ml-1">
                                {part.technician.city}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-row items-center justify-between mt-2 pt-2 border-t bborder-border-dark/30">
                    <View className="flex-row items-center">
                        <View
                            className="w-6 h-6 rounded-full items-center justify-center"
                            style={{ backgroundColor: getConditionColor(part?.condition?.name || 'New') }}
                        >
                            <Text className="text-[10px] text-white font-bold">
                                {part?.condition?.name?.[0]?.toUpperCase() || 'N'}
                            </Text>
                        </View>
                        <Text className="text-[10px] text-gray-400 ml-1.5 font-manrope-medium">
                            {part?.condition?.name || 'New'}
                        </Text>
                    </View>

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
    );
}

export default PartsCard;