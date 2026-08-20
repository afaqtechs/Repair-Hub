import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/src/context/AuthContext";
import { usePresenceStatus } from "@/src/context/PresenceContext";
import { useConversations } from "@/src/hooks/chat/useConversations";
import ChatScreen from "@/src/screens/chat/ChatScreen";

export default function ChatDetail({ conversationId, onBack }: { conversationId: string, onBack: () => void; }) {

    const { user } = useAuth();
    const { isUserOnline } = usePresenceStatus();

    const {
        conversation,
        otherUserProfile,
        isLoadingOtherUser,
    } = useConversations(
        user?.id,
        conversationId
    );

    if (!conversationId || !user?.id) {
        return (
            <View className="flex-1 items-center justify-center bg-bg">
                <ActivityIndicator />
            </View>
        );
    }

    if (isLoadingOtherUser) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator
                    size="large"
                />
            </View>
        );
    }

    const otherUserName =
        `${otherUserProfile?.first_name ?? ""} ${otherUserProfile?.last_name ?? ""
            }`.trim() || "User";

    const otherUserId = otherUserProfile?.id;

    const isOnline = otherUserId
        ? isUserOnline(otherUserId)
        : false;

    return (
        <ChatScreen
            conversationId={conversationId}
            currentUserId={user.id}
            otherUserName={otherUserName}
            otherUserImage={
                otherUserProfile?.profile_image_url
            }
            otherUserLastReadAt={
                conversation?.other_user_last_read_at ?? null
            }
            otherUserId={otherUserId}
            isOnline={isOnline}
            onBack={onBack}
        />
    );
}