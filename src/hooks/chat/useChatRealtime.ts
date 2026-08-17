import { RealtimeChannel } from "@supabase/supabase-js";
import {
    useCallback,
    useEffect,
    useRef,
} from "react";

import { supabase } from "@/src/lib/supabase";

import {
    Message,
    MessageDeletedPayload,
    ReadPayload,
    TypingPayload,
    UseChatRealtimeProps,
} from "@/types/chat";

type RealtimeResult = {
    success: boolean;
    error: string | null;
};

export const useChatRealtime = ({
    conversationId,
    currentUserId,
    onMessage,
    onTyping,
    onRead,
    onDelete,
}: UseChatRealtimeProps) => {
    const channelRef =
        useRef<RealtimeChannel | null>(null);

    const onMessageRef =
        useRef(onMessage);

    const onTypingRef =
        useRef(onTyping);

    const onReadRef =
        useRef(onRead);

    const onMessageDeletedRef =
        useRef(onDelete);

    // ─────────────────────────────────────────────
    // Keep callbacks up to date
    // ─────────────────────────────────────────────

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        onTypingRef.current = onTyping;
    }, [onTyping]);

    useEffect(() => {
        onReadRef.current = onRead;
    }, [onRead]);

    useEffect(() => {
        onMessageDeletedRef.current =
            onDelete;
    }, [onDelete]);

    // ─────────────────────────────────────────────
    // Subscribe to conversation
    // ─────────────────────────────────────────────

    useEffect(() => {
        if (
            !conversationId ||
            !currentUserId
        ) {
            return;
        }

        const channel =
            supabase.channel(
                `conversation:${conversationId}`,
                {
                    config: {
                        private: true,
                    },
                }
            );

        // ─────────────────────────────────────────
        // New message
        // ─────────────────────────────────────────

        channel.on(
            "broadcast",
            {
                event: "message",
            },
            ({ payload }) => {
                const message =
                    payload as Message;

                if (
                    message.sender_id ===
                    currentUserId
                ) {
                    return;
                }

                onMessageRef.current?.(
                    message
                );
            }
        );

        // ─────────────────────────────────────────
        // Typing
        // ─────────────────────────────────────────

        channel.on(
            "broadcast",
            {
                event: "typing",
            },
            ({ payload }) => {
                const typing =
                    payload as TypingPayload;

                if (
                    typing.user_id ===
                    currentUserId
                ) {
                    return;
                }

                onTypingRef.current?.(
                    typing
                );
            }
        );

        // ─────────────────────────────────────────
        // Read
        // ─────────────────────────────────────────

        channel.on(
            "broadcast",
            {
                event: "read",
            },
            ({ payload }) => {
                const read =
                    payload as ReadPayload;

                if (
                    read.user_id ===
                    currentUserId
                ) {
                    return;
                }

                onReadRef.current?.(read);
            }
        );

        // ─────────────────────────────────────────
        // Message deleted
        // ─────────────────────────────────────────

        channel.on(
            "broadcast",
            {
                event: "message_deleted",
            },
            ({ payload }) => {
                const deleted =
                    payload as MessageDeletedPayload;

                if (
                    deleted.deleted_by ===
                    currentUserId
                ) {
                    return;
                }

                onMessageDeletedRef.current?.(
                    deleted
                );
            }
        );

        // ─────────────────────────────────────────
        // Subscribe
        // ─────────────────────────────────────────

        channel.subscribe((status) => {
            console.log(
                `Conversation ${conversationId}: ${status}`
            );
        });

        channelRef.current = channel;

        return () => {
            channelRef.current = null;

            supabase.removeChannel(
                channel
            );
        };
    }, [
        conversationId,
        currentUserId,
    ]);

    // ─────────────────────────────────────────────
    // Send message
    // ─────────────────────────────────────────────

    const sendMessage = useCallback(
        async (
            message: Message
        ): Promise<RealtimeResult> => {
            const channel =
                channelRef.current;

            if (!channel) {
                return {
                    success: false,
                    error:
                        "Chat channel is not connected.",
                };
            }

            const result =
                await channel.send({
                    type: "broadcast",
                    event: "message",
                    payload: message,
                });

            if (result !== "ok") {
                return {
                    success: false,
                    error:
                        `Message broadcast failed: ${result}`,
                };
            }

            return {
                success: true,
                error: null,
            };
        },
        []
    );

    // ─────────────────────────────────────────────
    // Send typing
    // ─────────────────────────────────────────────

    const sendTyping = useCallback(
        async (
            isTyping: boolean
        ): Promise<RealtimeResult> => {
            const channel =
                channelRef.current;

            if (!channel) {
                return {
                    success: false,
                    error:
                        "Chat channel is not connected.",
                };
            }

            const result =
                await channel.send({
                    type: "broadcast",
                    event: "typing",
                    payload: {
                        user_id:
                            currentUserId,
                        is_typing:
                            isTyping,
                    },
                });

            if (result !== "ok") {
                return {
                    success: false,
                    error:
                        `Typing broadcast failed: ${result}`,
                };
            }

            return {
                success: true,
                error: null,
            };
        },
        [currentUserId]
    );

    // ─────────────────────────────────────────────
    // Send read status
    // ─────────────────────────────────────────────

    const sendRead = useCallback(
    async (lastReadAt: string): Promise<void> => {
        const channel = channelRef.current;

        if (!channel) {
            return;
        }

        const result = await channel.send({
            type: "broadcast",
            event: "read",
            payload: {
                user_id: currentUserId,
                last_read_at: lastReadAt,
            },
        });

        if (result !== "ok") {
            console.warn(
                "Read broadcast failed:",
                result
            );
        }
    },
    [currentUserId]
);
    // ─────────────────────────────────────────────
    // Send message deleted
    // ─────────────────────────────────────────────

    const sendMessageDeleted =
        useCallback(
            async (
                payload: MessageDeletedPayload
            ): Promise<RealtimeResult> => {
                const channel =
                    channelRef.current;

                if (!channel) {
                    return {
                        success: false,
                        error:
                            "Chat channel is not connected.",
                    };
                }

                const result =
                    await channel.send({
                        type: "broadcast",
                        event: "message_deleted",
                        payload,
                    });

                if (result !== "ok") {
                    return {
                        success: false,
                        error:
                            `Message delete broadcast failed: ${result}`,
                    };
                }

                return {
                    success: true,
                    error: null,
                };
            },
            []
        );

    // ─────────────────────────────────────────────
    // Return
    // ─────────────────────────────────────────────

    return {
        sendMessage,
        sendTyping,
        sendRead,
        sendMessageDeleted,
    };
};