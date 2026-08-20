import ChatDetail from "@/src/screens/chat/ChatDetail";
import ConversationsScreen from "@/src/screens/chat/ConversationsScreen";
import NewChat from "@/src/screens/chat/NewChat";
import { useChatNavigationStore } from "@/store/chatNavigationStore";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Screen = "inbox" | "chat" | "newChat";

const Inbox = () => {
    const insets = useSafeAreaInsets();

    const params = useLocalSearchParams<{
        conversationId?: string;
    }>();

    const setChatOpen = useChatNavigationStore(
        (state) => state.setChatOpen
    );

    const [screen, setScreen] =
        useState<Screen>("inbox");

    const [conversationId, setConversationId] =
        useState<string | null>(null);

    useEffect(() => {
        if (params.conversationId) {
            setConversationId(params.conversationId);
            setScreen("chat");
        }
    }, [params.conversationId]);

    const goBack = () => {
        setConversationId(null);
        setScreen("inbox");
    };

    useEffect(() => {
        if (screen === "inbox") {
            return;
        }

        const subscription =
            BackHandler.addEventListener(
                "hardwareBackPress",
                () => {
                    goBack();
                    return true;
                }
            );

        return () => {
            subscription.remove();
        };
    }, [screen]);

    // Hide tab bar when inside chat/new chat
    useEffect(() => {
        setChatOpen(screen !== "inbox");

        return () => {
            setChatOpen(false);
        };
    }, [screen, setChatOpen]);

    const openChat = (id: string) => {
        setConversationId(id);
        setScreen("chat");
    };

    const openNewChat = () => {
        setConversationId(null);
        setScreen("newChat");
    };

    const bottomPadding = screen === "inbox" ? insets.bottom + 24 : 0;

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: bottomPadding,
            }}
            className="bg-bg"
        >
            {screen === "inbox" && (
                <ConversationsScreen
                    onOpenConversation={openChat}
                    onCreateConversation={openNewChat}
                />
            )}

            {screen === "chat" && conversationId && (
                <ChatDetail
                    conversationId={conversationId}
                    onBack={goBack}
                />
            )}

            {screen === "newChat" && (
                <NewChat
                    onBack={goBack}
                    onConversationCreated={openChat}
                />
            )}
        </View>
    );
};

export default Inbox;