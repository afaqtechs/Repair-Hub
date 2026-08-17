import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";

import { messageApi } from "@/src/api/chat/messages.api";
import { Message } from "@/types/chat";

export const MESSAGE_KEYS = {
    all: ["messages"] as const,

    conversation: (conversationId: string) =>
        ["messages", conversationId] as const,
};

export const useMessages = (
    conversationId: string
) => {
    const queryClient =
        useQueryClient();

    const queryKey =
        MESSAGE_KEYS.conversation(
            conversationId
        );

    // ─────────────────────────────────────────────
    // Messages query
    // ─────────────────────────────────────────────

    const messagesQuery = useQuery({
        queryKey,

        queryFn: () =>
            messageApi.getMessages(
                conversationId
            ),

        enabled: !!conversationId,

        staleTime: Infinity,
    });

    // ─────────────────────────────────────────────
    // Messages data
    // ─────────────────────────────────────────────

    const messages: Message[] =
        messagesQuery.data ?? [];

    // ─────────────────────────────────────────────
    // Send message
    // ─────────────────────────────────────────────

    const sendMessageMutation =
        useMutation({
            mutationFn: ({
                id,
                content,
            }: {
                id: string;
                content: string;
            }) =>
                messageApi.sendMessage({
                    conversationId,
                    id,
                    content,
                }),

            onSuccess: (
                result,
                variables
            ) => {
                /*
                 * API-level failure.
                 *
                 * sendMessage() returns null
                 * when the server operation
                 * fails.
                 *
                 * Keep the pending message.
                 */
                if (!result) {
                    queryClient.setQueryData<
                        Message[]
                    >(
                        queryKey,
                        (old = []) =>
                            old.map(
                                (message) =>
                                    message.id ===
                                    variables.id
                                        ? {
                                              ...message,
                                              status: "pending",
                                          }
                                        : message
                            )
                    );

                    return;
                }

                /*
                 * Server successfully saved
                 * the message.
                 *
                 * Replace the pending message
                 * with the server version.
                 */
                const serverMessage: Message = {
                    ...result,
                    status: "sent",
                };

                queryClient.setQueryData<
                    Message[]
                >(
                    queryKey,
                    (old = []) => {
                        const index =
                            old.findIndex(
                                (item) =>
                                    item.id ===
                                    variables.id
                            );

                        if (index === -1) {
                            return [
                                ...old,
                                serverMessage,
                            ];
                        }

                        const updated = [
                            ...old,
                        ];

                        updated[index] =
                            serverMessage;

                        return updated;
                    }
                );
            },

            /*
             * Unexpected React Query /
             * promise errors.
             */
            onError: (
                error,
                variables
            ) => {
                console.warn(
                    "Unexpected message error:",
                    error
                );

                queryClient.setQueryData<
                    Message[]
                >(
                    queryKey,
                    (old = []) =>
                        old.map(
                            (message) =>
                                message.id ===
                                variables.id
                                    ? {
                                          ...message,
                                          status: "pending",
                                      }
                                    : message
                        )
                );
            },

            retry: false,
        });

    // ─────────────────────────────────────────────
    // Add realtime message
    // ─────────────────────────────────────────────

    const addRealtimeMessage =
        useCallback(
            (message: Message) => {
                if (
                    message.conversation_id !==
                    conversationId
                ) {
                    return;
                }

                queryClient.setQueryData<
                    Message[]
                >(
                    queryKey,
                    (old = []) => {
                        const existingIndex =
                            old.findIndex(
                                (item) =>
                                    item.id ===
                                    message.id
                            );

                        /*
                         * Same message already exists.
                         * Replace it instead of duplicating.
                         */
                        if (
                            existingIndex !==
                            -1
                        ) {
                            const updated = [
                                ...old,
                            ];

                            updated[
                                existingIndex
                            ] = message;

                            return updated;
                        }

                        return [
                            ...old,
                            message,
                        ];
                    }
                );
            },
            [
                conversationId,
                queryClient,
                queryKey,
            ]
        );

    // ─────────────────────────────────────────────
    // Remove realtime message
    // ─────────────────────────────────────────────

    const removeRealtimeMessage =
        useCallback(
            (messageId: string) => {
                queryClient.setQueryData<
                    Message[]
                >(
                    queryKey,
                    (old = []) =>
                        old.filter(
                            (message) =>
                                message.id !==
                                messageId
                        )
                );
            },
            [
                queryClient,
                queryKey,
            ]
        );

    // ─────────────────────────────────────────────
    // Delete messages for everyone
    // ─────────────────────────────────────────────

    const deleteMessagesMutation =
        useMutation({
            mutationFn: (
                messageIds: string[]
            ) =>
                messageApi.deleteMessagesForEveryone(
                    messageIds
                ),

            onSuccess: (
                result,
                messageIds
            ) => {
                /*
                 * API-level failure.
                 *
                 * deleteMessagesForEveryone()
                 * returns 0 when it fails.
                 */
                if (result === 0) {
                    return;
                }

                /*
                 * Successfully deleted on server.
                 *
                 * Immediately remove from
                 * local cache.
                 */
                queryClient.setQueryData<
                    Message[]
                >(
                    queryKey,
                    (old = []) =>
                        old.filter(
                            (message) =>
                                !messageIds.includes(
                                    message.id
                                )
                        )
                );
            },

            retry: false,
        });

    // ─────────────────────────────────────────────
    // Return
    // ─────────────────────────────────────────────

    return {
        // Messages
        messages,

        // Query state
        isLoading:
            messagesQuery.isLoading,

        isError:
            messagesQuery.isError,

        error:
            messagesQuery.error,

        refetch:
            messagesQuery.refetch,

        // Send
        sendMessage:
            sendMessageMutation.mutateAsync,

        isSending:
            sendMessageMutation.isPending,

        sendMessageError:
            sendMessageMutation.data === null
                ? "Failed to send message."
                : null,

        isSendError:
            sendMessageMutation.isError,

        // Realtime
        addRealtimeMessage,

        removeRealtimeMessage,

        // Delete
        deleteMessages:
            deleteMessagesMutation.mutateAsync,

        isDeletingMessages:
            deleteMessagesMutation.isPending,

        deleteMessagesError:
            deleteMessagesMutation.data === 0
                ? "Failed to delete messages."
                : null,

        isDeleteError:
            deleteMessagesMutation.isError,
    };
};