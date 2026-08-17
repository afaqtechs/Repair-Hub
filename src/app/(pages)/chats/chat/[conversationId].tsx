import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth } from "@/src/context/AuthContext";
import { usePresenceStatus } from "@/src/context/PresenceContext";
import { useConversations } from "@/src/hooks/chat/useConversations";
import ChatScreen from "@/src/screens/chat/ChatScreen";

export default function ConversationScreen() {
    const router = useRouter();

    const { user } = useAuth();
    const { isUserOnline } = usePresenceStatus();

    const { conversationId } =
        useLocalSearchParams<{
            conversationId: string;
        }>();

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
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <ActivityIndicator />
            </View>
        );
    }

    if (isLoadingOtherUser) {
        return (
            <View className="flex-1 items-center justify-center bg-bg dark:bg-bg-dark">
                <ActivityIndicator />
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
            isOnline={isOnline}
            onBack={() => router.back()}
        />
    );
}