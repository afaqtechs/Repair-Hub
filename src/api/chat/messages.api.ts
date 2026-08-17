import { supabase } from "@/src/lib/supabase";
import { Message } from "@/types/chat";

type SendMessageInput = {
    id: string;
    conversationId: string;
    content: string;
};

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (
    method: string,
    error: unknown
) => {
    const message =
        error instanceof Error
            ? error.message
            : String(error);

    console.log(
        `[messageApi.${method}]`,
        message
    );
};

// ─────────────────────────────────────────────
// Message API
// ─────────────────────────────────────────────

export const messageApi = {
    // ─────────────────────────────────────────────
    // Get messages
    // ─────────────────────────────────────────────

    async getMessages(
        conversationId: string,
        limit = 50
    ): Promise<Message[]> {
        try {
            const {
                data,
                error,
            } = await supabase
                .from("messages")
                .select("*")
                .eq(
                    "conversation_id",
                    conversationId
                )
                .order("created_at", {
                    ascending: true,
                })
                .limit(limit);

            if (error) {
                logApiError(
                    "getMessages",
                    error
                );

                return [];
            }

            return (data ?? []) as Message[];
        } catch (error) {
            logApiError(
                "getMessages",
                error
            );

            return [];
        }
    },

    // ─────────────────────────────────────────────
    // Send message
    // ─────────────────────────────────────────────

    async sendMessage({
        id,
        conversationId,
        content,
    }: SendMessageInput): Promise<Message | null> {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                logApiError(
                    "sendMessage",
                    userError
                );

                return null;
            }

            if (!user) {
                console.log(
                    "[messageApi.sendMessage] Not authenticated."
                );

                return null;
            }

            const trimmedContent =
                content.trim();

            if (!trimmedContent) {
                console.log(
                    "[messageApi.sendMessage] Message cannot be empty."
                );

                return null;
            }

            const {
                data,
                error,
            } = await supabase
                .from("messages")
                .insert({
                    id,
                    conversation_id:
                        conversationId,
                    sender_id: user.id,
                    content: trimmedContent,
                })
                .select("*")
                .single();

            if (error) {
                logApiError(
                    "sendMessage",
                    error
                );

                return null;
            }

            return {
                ...data,
                status: "sent",
            } as Message;
        } catch (error) {
            logApiError(
                "sendMessage",
                error
            );

            return null;
        }
    },

    // ─────────────────────────────────────────────
    // Delete messages for everyone
    // ─────────────────────────────────────────────

    async deleteMessagesForEveryone(
        messageIds: string[]
    ): Promise<number> {
        try {
            if (messageIds.length === 0) {
                console.log(
                    "[messageApi.deleteMessagesForEveryone] No messages selected."
                );

                return 0;
            }

            const {
                error,
            } = await supabase
                .from("messages")
                .delete()
                .in(
                    "id",
                    messageIds
                );

            if (error) {
                logApiError(
                    "deleteMessagesForEveryone",
                    error
                );

                return 0;
            }

            return messageIds.length;
        } catch (error) {
            logApiError(
                "deleteMessagesForEveryone",
                error
            );

            return 0;
        }
    },
};