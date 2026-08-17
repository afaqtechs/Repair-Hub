import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { conversationApi } from "@/src/api/chat/conversations.api";
import { CHAT_KEYS } from "./chatKeys";

import type {
    ConversationInboxItem,
} from "@/types/chat";

export function useConversations(
    userId?: string,
    conversationId?: string
) {
    const queryClient = useQueryClient();

    // ─────────────────────────────────────────────
    // Conversations
    // ─────────────────────────────────────────────

    const conversationsQuery = useQuery({
        queryKey: CHAT_KEYS.conversations(),

        queryFn: () =>
            conversationApi.getMyConversations(),

        enabled: !!userId,

        staleTime: 0,
        refetchOnMount: "always",
        refetchOnReconnect: true,
        retry: false,
    });

    // ─────────────────────────────────────────────
    // Conversations data
    // ─────────────────────────────────────────────

    const conversations: ConversationInboxItem[] =
        conversationsQuery.data ?? [];

    // ─────────────────────────────────────────────
    // Current conversation
    // ─────────────────────────────────────────────

    const conversation =
        conversations.find(
            (item) =>
                item.conversation_id ===
                conversationId
        ) ?? null;

    // ─────────────────────────────────────────────
    // Other user profile
    // ─────────────────────────────────────────────

    const otherUserProfileQuery = useQuery({
        queryKey: [
            ...CHAT_KEYS.conversation(
                conversationId ?? ""
            ),
            "other-user",
            userId,
        ],

        queryFn: () =>
            conversationApi.getOtherUserProfile(
                conversationId!,
                userId!
            ),

        enabled:
            !!conversationId &&
            !!userId,

        retry: false,
    });

    // ─────────────────────────────────────────────
    // Other user profile data
    // ─────────────────────────────────────────────

    const otherUserProfile =
        otherUserProfileQuery.data ?? null;

    // ─────────────────────────────────────────────
    // Get or create conversation
    // ─────────────────────────────────────────────

    const getOrCreateConversation =
        useMutation({
            mutationFn: (
                otherUserId: string
            ) =>
                conversationApi.getOrCreateDirectConversation(
                    otherUserId
                ),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:
                        CHAT_KEYS.conversations(),
                });
            },

            retry: false,
        });

    // ─────────────────────────────────────────────
    // Mark conversation as read
    // ─────────────────────────────────────────────

    const markAsRead =
        useMutation({
            mutationFn: (
                conversationId: string
            ) =>
                conversationApi.markAsRead(
                    conversationId
                ),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:
                        CHAT_KEYS.conversations(),
                });
            },

            retry: false,
        });

    // ─────────────────────────────────────────────
    // Delete conversations
    // ─────────────────────────────────────────────

    const deleteConversations =
        useMutation({
            mutationFn: (
                conversationIds: string[]
            ) =>
                conversationApi.deleteConversationsForMe(
                    conversationIds
                ),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:
                        CHAT_KEYS.conversations(),
                });
            },

            retry: false,
        });

    // ─────────────────────────────────────────────
    // Return
    // ─────────────────────────────────────────────

    return {
        // Query state
        ...conversationsQuery,

        // Conversations
        conversations,

        conversation,

        // Other user
        otherUserProfile,

        isLoadingOtherUser:
            otherUserProfileQuery.isLoading,

        isErrorOtherUser:
            otherUserProfileQuery.isError,

        otherUserProfileError:
            otherUserProfileQuery.error,

        refetchOtherUser:
            otherUserProfileQuery.refetch,

        // Mutations
        getOrCreateConversation,

        markAsRead,

        deleteConversations,
    };
}