import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useRequestMutations, useTechnicianLocation } from '@/src/hooks';
import { showError, showSuccess } from '@/src/lib/toast';
import { Request } from '@/types/requests';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import SimpleDropdownMenu from '../common/CustomDropDown';

type RequestCardProps = {
    request: Request;
    onUnsave?: () => void;
    onEdit?: () => void;
    showListView?: boolean;
    index?: number;
    allowEdit?: boolean;
};

const RequestCard = ({
    request,
    onEdit,
    showListView = false,
    index,
    allowEdit = false,
}: RequestCardProps) => {
    const router = useRouter();
    const { isDark } = useTheme();
    const { user } = useAuth();
    const loggedInUserId = user?.id;
    const technicianId = request?.technician_id;

    const menuItems = [
        ...(allowEdit ? [{ label: 'Edit', value: 'edit', icon: 'create-outline' }] : []),
        { label: request.is_active ? 'Mark In Active' : "Mark Active", value: 'toggle-active', icon: request.is_active ? 'eye-off-outline' : "eye-outline" },
        { label: 'Delete', value: 'delete', icon: 'trash-outline', destructive: true },
    ];

    const imageSource = request?.images?.[0]
        ? { uri: request.images[0] }
        : require("@/assets/ui/heroimage.png");

    const { data: technicianLocation } = useTechnicianLocation(technicianId);
    const { deleteRequest, updateRequestStatus } = useRequestMutations();

    const distance = technicianLocation?.distance ?? null;

    const handleMenuAction = async (value: string) => {
        switch (value) {
            case 'edit':
                onEdit?.();
                break;

            case 'toggle-active':
                try {
                    await updateRequestStatus.mutateAsync({
                        id: request.id,
                        isAvailable: !request.is_active,
                    });
                    showSuccess('Updated', 'Request status updated');
                } catch (error: any) {
                    showError('Failed to update:', error.message);
                }
                break;

            case 'delete':
                try {
                    await deleteRequest.mutateAsync(request.id);
                    showSuccess('Deleted', 'Request deleted from database');
                } catch (error: any) {
                    showError('Failed to delete request:', error.message);
                }
                break;
        }
    };

    const isOwner = loggedInUserId === technicianId;
    const isListView = showListView;
    const isFeatured = index === 0;

    return (
        <View
            className={`m-1 ${isListView ? "w-full flex-row items-center" : "flex-col"} bg-card/50 dark:bg-card-dark/50 p-2 border border-border dark:border-border-dark overflow-hidden rounded-md`}
            style={{ elevation: 0 }}
        >
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push({ pathname: "/(pages)/requests/request/[id]", params: { id: request.id } })}
                className={`${isListView ? "w-[120px] h-[120px]" : isFeatured ? "w-full h-72" : "w-full h-48"} relative overflow-hidden`}
            >
                <Image source={imageSource} className="w-full h-full rounded-md" resizeMode="cover" />

                {isOwner && !request?.is_active && (
                    <View className={`absolute bottom-2 left-2 self-start px-3 py-1 rounded-full ${request?.is_active
                        ? "bg-success"
                        : "bg-danger"
                        }`}>
                        <Text className={`text-xs font-manrope-semibold text-white`}>
                            {request?.is_active ? "Active" : "In Active"}
                        </Text>
                    </View>
                )}

                {request.priority === "urgent" && (
                    <View className="absolute bottom-2 left-2 px-3 py-1 rounded-xl bg-red-500">
                        <Text className="text-xs font-semibold text-white">
                            {request.priority}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>

            <View className={`${isListView ? "flex-1 justify-between ml-3" : "mt-3"}`}>
                <View>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => router.push({ pathname: "/(pages)/requests/request/[id]", params: { id: request.id } })}
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
                            className="text-sm font-manrope-semibold text-text dark:text-text-dark leading-5 min-h-[40px] hover:opacity-70"
                            style={Platform.select({
                                web: {
                                    cursor: 'pointer',
                                    transition: 'opacity 0.2s ease',
                                },
                            })}
                        >
                            {request.title ?? "Untitled Request"}
                        </Text>
                    </TouchableOpacity>

                    {request?.description && (
                        <Text
                            numberOfLines={2}
                            className="text-xs text-text-secondary dark:text-text-darkSecondary mt-1 leading-4"
                        >
                            {request.description.replace(/<[^>]*>/g, '').substring(0, 100)}
                            {request.description.replace(/<[^>]*>/g, '').length > 100 && '...'}
                        </Text>
                    )}

                    {request?.platform?.name && (
                        <View className="flex-row items-center mt-1">
                            <Ionicons name="hardware-chip-outline" size={12} color={isDark ? "#94A3B8" : "#64748B"} />
                            <Text className="text-xs text-text-secondary dark:text-text-darkSecondary ml-1">
                                {request.platform.name}
                            </Text>
                        </View>
                    )}

                    <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-border/30 dark:border-border-dark/30">
                        <Text className="text-xs text-gray-600 dark:text-gray-400">
                            {request?.category?.name || 'Uncategorized'}
                        </Text>

                        {isOwner ? (
                            <SimpleDropdownMenu
                                items={menuItems}
                                onSelect={handleMenuAction}
                                isDark={isDark}
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
            </View>
        </View>
    );
};

export default RequestCard;