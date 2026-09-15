import { useAuth } from '@/src/context/AuthContext';
import { usePartsMutations, useTechnicianLocation } from '@/src/hooks';
import { useSavedPart } from '@/src/hooks/useSavedPart';
import { showError, showSuccess } from '@/src/lib/toast';
import { Part } from '@/types/parts';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import SimpleDropdownMenu from '../common/CustomDropDown';

type PartsCardProps = {
    part: Part;
    onUnsave?: () => void;
    onEdit?: () => void;
    showListView?: boolean;
    showSave?: boolean;
    index?: number;
    allowEdit?: boolean;
    isNew?: boolean;
    isNear?: boolean;
};

const PartsCard = ({
    part,
    onUnsave,
    onEdit,
    showSave = false,
    showListView = false,
    index,
    allowEdit = false,
    isNew = false,
    isNear = false,
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
        : require("@/assets/ui/background/parts_image.jpg");

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

    return (
        <View
            className={`m-1 ${isListView ? "w-full flex-row items-center" : (isNew || isNear) ? "w-[200px]" : "flex-col"} bg-card p-2 rounded-md`}
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
                        className="absolute top-2 right-2 bg-bg rounded-full p-2 items-center justify-center"
                    >
                        <Ionicons
                            name={isSaved ? "heart" : "heart-outline"}
                            size={20}
                            color={isSaved ? "#EF4444" : "#1F2937"}
                        />
                    </TouchableOpacity>
                )}
                {(isOwner && !part?.is_available) && (
                    <View className={`absolute bottom-2 left-1 self-start px-3 py-1 rounded-full ${part?.is_available
                        ? "bg-success"
                        : "bg-danger"
                        }`}>
                        <Text className={`text-xs font-manrope-semibold text-white`}>
                            {part?.is_available ? "Available" : "Un Available"}
                        </Text>
                    </View>
                )}

                {isListView && (
                    <View className="absolute top-2 right-1">
                        {part?.condition?.toLowerCase() === "new" ? (
                            <View className="flex-row items-center bg-primary/50 px-2 py-1 rounded-full">
                                <Ionicons
                                    name="sparkles"
                                    size={11}
                                    color="#4CAF50"
                                />

                                <Text className="ml-1 text-[8px] font-manrope-bold text-success">
                                    NEW
                                </Text>
                            </View>
                        ) : (
                            <View className="items-center bg-primary/50 px-2 py-1 rounded-full">
                                <Text className="ml-1 text-[8px] font-manrope-bold text-orange-500">
                                    USED
                                </Text>
                            </View>
                        )}</View>
                )}

                {(part?.views_count !== 0 && part?.is_available) && (
                    <View className="absolute bottom-2 right-1 flex-row items-center bg-black/50 px-2 py-0.5 rounded-3xl">
                        <Ionicons
                            name="eye-outline"
                            size={15}
                            color="#FFFFFF"
                        />

                        <Text className="ml-1 text-white text-xs font-manrope-medium">
                            {part?.views_count} {part?.views_count === 1 ? "view" : "views"}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <View className={`${isListView ? "flex-1 justify-between ml-3" : "mt-3"}`}>
                <View>

                    <View className="flex-row items-start justify-between gap-2">
                        {/* TITLE */}
                        <Text
                            numberOfLines={2}
                            className="flex-1 text-[11px] leading-[16px] font-manrope-semibold text-text min-h-[32px]"
                        >
                            {part?.title || "Untitled Part"}
                        </Text>

                        {/* SPECIAL BADGE */}
                        {!isListView && (

                            <>
                                {part?.condition?.toLowerCase() === "new" ? (
                                    <View className="flex-row items-center bg-primary/10 px-2 py-1 rounded-full">
                                        <Ionicons
                                            name="sparkles"
                                            size={11}
                                            color="#4CAF50"
                                        />

                                        <Text className="ml-1 text-[8px] font-manrope-bold text-success">
                                            NEW
                                        </Text>
                                    </View>
                                ) : (
                                    <View className="items-center bg-primary/10 px-2 py-1 rounded-full">
                                        <Text className="ml-1 text-[8px] font-manrope-bold text-orange-500">
                                            USED
                                        </Text>
                                    </View>
                                )}
                            </>
                        )}
                    </View>

                    <Text
                        className="text-[9px] leading-[16px] font-manrope-semibold text-text-muted mt-0.5 bg-primary/10 px-2 py-0.5 rounded-md self-start"
                    >
                        {part?.category?.name || "Untitled"}
                    </Text>

                    <Text
                        numberOfLines={1}
                        className="mt-1.5 text-[14px] leading-[18px] font-manrope-bold text-success"
                    >
                        {part?.price?.toLocaleString() || "0"} ETB
                    </Text>

                </View>

                <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border/30">

                    {isNew ? (
                        <View className="flex-row items-center mt-1">

                            <Text
                                numberOfLines={1}
                                className="text-[9px] font-manrope-medium text-text-muted"
                            >
                                {part?.condition || "New"}
                            </Text>

                            <View className="w-1 h-1 rounded-full bg-text-muted mx-1.5" />

                            <Text
                                numberOfLines={1}
                                className="flex-1 text-[9px] font-manrope-medium text-text-muted"
                            >
                                {part?.technician?.city || "Nearby"}
                            </Text>

                        </View>
                    ) : (
                        <>
                            <Text
                                numberOfLines={1}
                                className="flex-1 text-[9px] font-manrope-medium text-text-muted"
                            >
                                {part?.technician?.city || "Nearby"}
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
                        </>
                    )}
                </View>
            </View>

            {
                (showSave && isListView) && (
                    <TouchableOpacity
                        onPress={() => toggleSave()}
                        disabled={saveLoading}
                        className="absolute top-2 right-2 bg-bg rounded-full p-2 items-center justify-center"
                    >
                        <Ionicons
                            name={isSaved ? "heart" : "heart-outline"}
                            size={20}
                            color={isSaved ? "#EF4444" : "#1F2937"}
                        />
                    </TouchableOpacity>
                )
            }
        </View >
    );
}

export default PartsCard;