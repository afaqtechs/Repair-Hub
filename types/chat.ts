export type ChatRole = "admin" | "technician";

export type MessageStatus =
    | "pending"
    | "sent"
    | "seen";

export interface Conversation {
    id: string;
    created_at: string;
    direct_key: string | null;
}

export interface ConversationMember {
    conversation_id: string;
    user_id: string;
    last_read_at: string | null;
    created_at: string;
}

export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    status?: MessageStatus;
}

export interface OtherUser {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_image_url: string | null;
    role: ChatRole;
}

export interface ConversationWithMember
    extends Conversation {
     other_user?: OtherUser;

    last_message?: Message | null;

    unread_count?: number;

    other_user_last_read_at?: string | null;
}

export interface TypingPayload {
    user_id: string;
    is_typing: boolean;
}

export interface PresenceUser {
    user_id: string;
    online_at: string;
}

/**
 * Raw result returned by the conversations
 * inbox API/RPC.
 */
export interface ConversationInboxItem {
    id:string;
    conversation_id: string;
    created_at: string;

    /**
     * Required because ConversationWithMember
     * extends Conversation.
     */
    direct_key: string | null;

    other_user_id: string;

    other_user_first_name: string | null;
    other_user_last_name: string | null;
    other_user_profile_image_url: string | null;
    other_user_role: ChatRole;

    /**
     * These should come from the profile query/RPC.
     */
    other_user_is_available?: boolean | null;
    other_user_last_seen_at?: string | null;

    last_message_id: string | null;
    last_message_content: string | null;
    last_message_sender_id: string | null;
    last_message_created_at: string | null;

    other_user_last_read_at: string | null;

    unread_count?: number;
}

export interface ReadPayload {
    user_id: string;
    last_read_at: string;
}


export interface MessageDeletedPayload {
    message_id: string;
    conversation_id: string;
    deleted_by: string;
}

export interface UseChatRealtimeProps {
    conversationId: string;
    currentUserId: string;

    onMessage?: (message: Message) => void;
    onTyping?: (payload: TypingPayload) => void;
    onRead?: (payload: ReadPayload) => void;
    onDelete?: (payload: MessageDeletedPayload) => void;
}