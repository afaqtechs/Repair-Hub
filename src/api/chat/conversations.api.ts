import { supabase } from "@/src/lib/supabase";

import {
    ChatRole,
    Conversation,
    ConversationInboxItem,
    ConversationMember,
    OtherUser
} from "@/types/chat";



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
        `[conversationApi.${method}]`,
        message
    );
};

// ─────────────────────────────────────────────
// Conversation API
// ─────────────────────────────────────────────

export const conversationApi = {

    async getMyConversations(): Promise<
        ConversationInboxItem[]
    > {
        try {
            const {
                data,
                error,
            } = await supabase.rpc(
                "get_my_conversations"
            );

            if (error) {
                logApiError(
                    "getMyConversations",
                    error
                );

                return [];
            }

            return data ?? [];
        } catch (error) {
            logApiError(
                "getMyConversations",
                error
            );

            return [];
        }
    },

    // ─────────────────────────────────────────────
    // Get other user profile
    // ─────────────────────────────────────────────

   async getOtherUserProfile(
    conversationId: string,
    currentUserId: string
): Promise<OtherUser | null> {
        try {
            const {
                data: member,
                error: memberError,
            } = await supabase
                .from("conversation_members")
                .select("user_id")
                .eq(
                    "conversation_id",
                    conversationId
                )
                .neq(
                    "user_id",
                    currentUserId
                )
                .maybeSingle();

            if (memberError) {
                logApiError(
                    "getOtherUserProfile",
                    memberError
                );

                return null;
            }

            if (!member) {
                console.log(
                    "[conversationApi.getOtherUserProfile] No other member found."
                );

                return null;
            }

            const {
                data: profile,
                error: profileError,
            } = await supabase
                .from("profiles")
                .select(`
                    id,
                    first_name,
                    last_name,
                    profile_image_url,
                    role,
                    is_available,
                    last_seen_at
                `)
                .eq(
                    "id",
                    member.user_id
                )
                .single();

            if (profileError) {
                logApiError(
                    "getOtherUserProfile",
                    profileError
                );

                return null;
            }

            if (!profile) {
                return null;
            }

            return {
                id: profile.id,
                first_name:
                    profile.first_name,
                last_name:
                    profile.last_name,
                profile_image_url:
                    profile.profile_image_url,
                role:
                    profile.role as ChatRole,
            };
        } catch (error) {
            logApiError(
                "getOtherUserProfile",
                error
            );

            return null;
        }
    },

    // ─────────────────────────────────────────────
    // Get or create direct conversation
    // ─────────────────────────────────────────────

    async getOrCreateDirectConversation(
        otherUserId: string
    ): Promise<string | null> {
        try {
            const {
                data,
                error,
            } = await supabase.rpc(
                "get_or_create_direct_conversation",
                {
                    p_other_user_id:
                        otherUserId,
                }
            );

            if (error) {
                logApiError(
                    "getOrCreateDirectConversation",
                    error
                );

                return null;
            }

            if (!data) {
                console.log(
                    "[conversationApi.getOrCreateDirectConversation] No conversation ID returned."
                );

                return null;
            }

            return data;
        } catch (error) {
            logApiError(
                "getOrCreateDirectConversation",
                error
            );

            return null;
        }
    },

    // ─────────────────────────────────────────────
    // Get conversation
    // ─────────────────────────────────────────────

    async getConversation(
        conversationId: string
    ): Promise<Conversation | null> {
        try {
            const {
                data,
                error,
            } = await supabase
                .from("conversations")
                .select("*")
                .eq(
                    "id",
                    conversationId
                )
                .maybeSingle();

            if (error) {
                logApiError(
                    "getConversation",
                    error
                );

                return null;
            }

            return data;
        } catch (error) {
            logApiError(
                "getConversation",
                error
            );

            return null;
        }
    },

    // ─────────────────────────────────────────────
    // Get conversation members
    // ─────────────────────────────────────────────

    async getConversationMembers(
        conversationId: string
    ): Promise<ConversationMember[]> {
        try {
            const {
                data,
                error,
            } = await supabase
                .from("conversation_members")
                .select(`
                    conversation_id,
                    user_id,
                    last_read_at,
                    created_at
                `)
                .eq(
                    "conversation_id",
                    conversationId
                );

            if (error) {
                logApiError(
                    "getConversationMembers",
                    error
                );

                return [];
            }

            return data ?? [];
        } catch (error) {
            logApiError(
                "getConversationMembers",
                error
            );

            return [];
        }
    },

    // ─────────────────────────────────────────────
    // Mark conversation as read
    // ─────────────────────────────────────────────

    async markAsRead(
        conversationId: string
    ): Promise<string | null> {
        try {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError) {
                logApiError(
                    "markAsRead",
                    userError
                );

                return null;
            }

            if (!user) {
                console.log(
                    "[conversationApi.markAsRead] Not authenticated."
                );

                return null;
            }

            const lastReadAt =
                new Date().toISOString();

            const {
                data,
                error,
            } = await supabase
                .from("conversation_members")
                .update({
                    last_read_at:
                        lastReadAt,
                })
                .eq(
                    "conversation_id",
                    conversationId
                )
                .eq(
                    "user_id",
                    user.id
                )
                .select(
                    "last_read_at"
                )
                .single();

            if (error) {
                logApiError(
                    "markAsRead",
                    error
                );

                return null;
            }

            return data?.last_read_at ?? null;
        } catch (error) {
            logApiError(
                "markAsRead",
                error
            );

            return null;
        }
    },

    // ─────────────────────────────────────────────
    // Delete conversations
    // ─────────────────────────────────────────────

    async deleteConversationsForMe(
        conversationIds: string[]
    ): Promise<number> {
        try {
            if (
                conversationIds.length === 0
            ) {
                console.log(
                    "[conversationApi.deleteConversationsForMe] No conversations selected."
                );

                return 0;
            }

            const {
                data,
                error,
            } = await supabase.rpc(
                "delete_conversations",
                {
                    p_conversation_ids:
                        conversationIds,
                }
            );

            if (error) {
                logApiError(
                    "deleteConversationsForMe",
                    error
                );

                return 0;
            }

            return data ?? 0;
        } catch (error) {
            logApiError(
                "deleteConversationsForMe",
                error
            );

            return 0;
        }
    },
};