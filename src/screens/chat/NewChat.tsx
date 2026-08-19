
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AppRefreshControl from "@/src/components/ui/AppRefreshControl";
import { useAuth } from "@/src/context/AuthContext";
import { useTechnicians } from "@/src/hooks";
import { useConversations } from "@/src/hooks/chat/useConversations";
import { showError } from "@/src/lib/toast";
import { isUserOnline } from "@/src/utils/presence";
import { Technician } from "@/types/profiles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface NewChatProps {
    onBack: () => void;
    onConversationCreated: (conversationId: string) => void;
}

const NewChat = ({
    onBack,
    onConversationCreated,
}: NewChatProps) => {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [search, setSearch] = useState("");
    const [
        selectedTechnicianId,
        setSelectedTechnicianId,
    ] = useState<string | null>(null);

    const { getOrCreateConversation } = useConversations();

    const {
        data: technicians = [],
        isLoading,
        isRefetching,
        refetch,
    } = useTechnicians();

    const allTechnicians = useMemo(() => {
        return technicians.filter(
            (tech) => tech?.id !== user?.id
        );
    }, [technicians, user?.id]);
    
    const filteredTechnicians = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return allTechnicians;
        }

        return allTechnicians.filter(
            (technician: Technician) => {
                const name =
                    `${technician.first_name ?? ""} ${technician.last_name ?? ""
                        }`.toLowerCase();

                return (
                    name.includes(query) ||
                    technician.email
                        ?.toLowerCase()
                        .includes(query)
                );
            }
        );
    }, [allTechnicians, search]);

    const getInitials = (
        technician: Technician
    ) => {
        return `${technician.first_name?.[0] ?? ""}${technician.last_name?.[0] ?? ""
            }`
            .toUpperCase()
            .trim() || "?";
    };

    const getName = (
        technician: Technician
    ) => {
        return (
            `${technician.first_name ?? ""} ${technician.last_name ?? ""
                }`.trim() || "Unknown technician"
        );
    };

    const handleSelectTechnician = async (
        technician: Technician
    ) => {
        if (getOrCreateConversation.isPending) {
            return;
        }

        try {
            setSelectedTechnicianId(technician.id);

            const conversationId =
                await getOrCreateConversation.mutateAsync(
                    technician.id
                );

            if (!conversationId) return;
            onConversationCreated(conversationId);
        } catch (error: any) {
            showError(
                "Failed to open conversation:",
                error
            );
        } finally {
            setSelectedTechnicianId(null);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-bg-dark">
                <ActivityIndicator
                    size="large"
                    color="#2563EB"
                />
            </View>
        );
    }

    return (
        <View
            style={{ flex: 1, paddingBottom: insets.bottom }}
            className="flex-1 bg-bg-dark"
        >
            {/* Header */}
            <View className="border-b px-5 pb-4 pt-3 border-border-dark">
                <View className="flex-row gap-3 items-center">
                    <TouchableOpacity
                        onPress={onBack}
                        activeOpacity={0.7}
                        className="h-10 w-10 items-center justify-center rounded-2xl border border-border-dark bg-bg-dark"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#F8FAFC"
                        />
                    </TouchableOpacity>
                    <View>
                        <Text className="font-manrope-bold text-2xl text-text-dark">
                            New Chat
                        </Text>

                        <Text className="mt-1 font-manrope text-sm text-gray-400">
                            Select a technician to start a conversation.
                        </Text>
                    </View>
                </View>

                {/* Search */}
                <View className="mt-4 flex-row items-center rounded-2xl px-3 bg-card-dark">
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color="#9CA3AF"
                    />

                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search technicians..."
                        placeholderTextColor="#9CA3AF"
                        className="ml-2 flex-1 py-3 font-manrope text-sm text-text-dark"
                    />

                    {search.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearch("")}
                            hitSlop={8}
                        >
                            <Ionicons
                                name="close-circle"
                                size={19}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Technician list */}
            <FlatList
                data={filteredTechnicians}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <AppRefreshControl
                        refreshing={isRefetching}
                        onRefresh={refetch}
                    />
                }
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    paddingVertical: 8,
                    flexGrow:
                        filteredTechnicians.length === 0
                            ? 1
                            : undefined,
                }}
                renderItem={({ item }) => {
                    const name = getName(item);
                    const initials = getInitials(item);

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled={getOrCreateConversation.isPending}
                            onPress={() =>
                                handleSelectTechnician(item)
                            }
                            className="flex-row items-center px-5 py-3"
                        >
                            {/* Avatar */}
                            <View className="relative mr-3">
                                {item.profile_image_url ? (
                                    <Image
                                        source={{
                                            uri: item.profile_image_url,
                                        }}
                                        className="h-14 w-14 rounded-full"
                                    />
                                ) : (
                                    <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                                        <Text className="font-manrope-bold text-base text-white">
                                            {initials}
                                        </Text>
                                    </View>
                                )}

                                {isUserOnline(
                                    item.is_available,
                                    item.last_seen_at
                                ) && (
                                        <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 bg-green-500 :border-gray-900" />
                                    )}
                            </View>

                            {/* Technician information */}
                            <View className="flex-1">
                                <Text
                                    numberOfLines={1}
                                    className="font-manrope-semibold text-[15px] text-text-dark"
                                >
                                    {name}
                                </Text>

                                {item.city ? (
                                    <Text
                                        numberOfLines={1}
                                        className="mt-1 font-manrope text-sm text-gray-400"
                                    >
                                        {item.city}
                                    </Text>
                                ) : (
                                    <Text
                                        className="mt-1 font-manrope text-sm text-gray-400"
                                    >
                                        Technician
                                    </Text>
                                )}
                            </View>

                            {/* Open chat */}
                            {getOrCreateConversation.isPending &&
                                selectedTechnicianId === item.id ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#5B3DF5"
                                />
                            ) : (
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9CA3AF"
                                />
                            )}
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={() => (
                    <View className="ml-[86px] h-px bg-gray-800" />
                )}
                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center px-8">
                        <Ionicons
                            name={
                                search
                                    ? "search-outline"
                                    : "people-outline"
                            }
                            size={46}
                            color="#9CA3AF"
                        />

                        <Text className="mt-4 text-center font-manrope-semibold text-base text-gray-300">
                            {search
                                ? "No technicians found"
                                : "No technicians available"}
                        </Text>

                        <Text className="mt-2 text-center font-manrope text-sm text-gray-400">
                            {search
                                ? "Try searching with a different name."
                                : "There are no technicians available to contact."}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default NewChat;
