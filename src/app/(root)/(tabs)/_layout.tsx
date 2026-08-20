import { useAuth } from "@/src/context/AuthContext";
import { useConversations } from "@/src/hooks/chat/useConversations";
import { useChatNavigationStore } from "@/store/chatNavigationStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useMemo } from "react";
import { Platform, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
    const isChatOpen = useChatNavigationStore(
        (state) => state.isChatOpen
    );

    const { user } = useAuth();

    const {
        conversations = [],
    } = useConversations(user?.id);

    const unreadCount = useMemo(() => {
        return conversations.reduce(
            (total: any, conversation: any) =>
                total + (conversation.unread_count ?? 0),
            0
        );
    }, [conversations]);

    const insets = useSafeAreaInsets();

    return (
        <Tabs
            initialRouteName="index"
            backBehavior="history"
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#5B3DF5",
                tabBarInactiveTintColor: "#94A3B8",

                tabBarLabelStyle: {
                    fontSize: 11,
                    fontFamily: "manrope-semibold",
                    marginTop: -2,
                },

                tabBarItemStyle: {
                    paddingTop: 5,
                },

                tabBarStyle: isChatOpen
                    ? { display: "none" }
                    : {
                        position: "absolute",

                        marginHorizontal: 12,
                        bottom: insets.bottom + 8,

                        height: 68,

                        backgroundColor: "#FFFFFF",

                        borderTopWidth: 0,
                        borderRadius: 24,

                        paddingTop: 6,
                        paddingBottom:
                            Platform.OS === "ios" ? 8 : 6,

                        // iOS
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 6,
                        },
                        shadowOpacity: 0.08,
                        shadowRadius: 16,

                        // Android
                        elevation: 3,
                    },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            className={`w-10 h-8 items-center justify-center rounded-full ${focused ? "bg-primary/10" : ""
                                }`}
                        >
                            <Ionicons
                                name={
                                    focused
                                        ? "home"
                                        : "home-outline"
                                }
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            className={`w-10 h-8 items-center justify-center rounded-full ${focused ? "bg-primary/10" : ""
                                }`}
                        >
                            <Ionicons
                                name={
                                    focused
                                        ? "search"
                                        : "search-outline"
                                }
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="create"
                options={{
                    tabBarAccessibilityLabel: "Create",
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            className="w-14 h-14 rounded-full items-center justify-center"
                            style={{
                                backgroundColor: focused
                                    ? "#4525D9"
                                    : "#5B3DF5",

                                shadowColor: "#5B3DF5",
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 8,
                            }}
                        >
                            <Ionicons
                                name="add"
                                size={30}
                                color="#FFFFFF"
                            />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="inbox"
                options={{
                    title: "Inbox",
                    tabBarBadge:
                        unreadCount > 0
                            ? unreadCount
                            : undefined,
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            className={`w-10 h-8 items-center justify-center rounded-full ${focused ? "bg-primary/10" : ""
                                }`}
                        >
                            <Ionicons
                                name={
                                    focused
                                        ? "chatbubble"
                                        : "chatbubble-outline"
                                }
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <View
                            className={`w-10 h-8 items-center justify-center rounded-full ${focused ? "bg-primary/10" : ""
                                }`}
                        >
                            <Ionicons
                                name={
                                    focused
                                        ? "person"
                                        : "person-outline"
                                }
                                size={22}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}