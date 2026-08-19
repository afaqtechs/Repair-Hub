import ChatDetail from "@/src/screens/chat/ChatDetail";
import ConversationsScreen from "@/src/screens/chat/ConversationsScreen";
import NewChat from "@/src/screens/chat/NewChat";
import { useChatNavigationStore } from "@/store/chatNavigationStore";
import React, { useEffect, useState } from "react";
import {
    BackHandler,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Screen = "inbox" | "chat" | "newChat";

const Inbox = () => {
    const insets = useSafeAreaInsets();

    const setChatOpen = useChatNavigationStore(
        (state) => state.setChatOpen
    );

    const [screen, setScreen] =
        useState<Screen>("inbox");

    const [conversationId, setConversationId] =
        useState<string | null>(null);

    const goBack = () => {
        setConversationId(null);
        setScreen("inbox");
    };

    // Android hardware back
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
        setScreen("newChat");
    };

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
            }}
            className="bg-bg-dark"
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