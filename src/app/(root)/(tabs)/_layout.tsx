
import { useChatNavigationStore } from "@/store/chatNavigationStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
    const isChatOpen = useChatNavigationStore(
        (state) => state.isChatOpen
    );

    return (
        <Tabs
            initialRouteName="index"
            backBehavior="history"
            screenOptions={{
                headerShown: false,

                tabBarActiveTintColor: "#5B3DF5",

                tabBarInactiveTintColor: "#94A3B8",

                tabBarLabelStyle: {
                    fontSize: 12,
                    fontFamily: "manrope-medium",
                },

                tabBarStyle: isChatOpen
                    ? { display: "none" }
                    : {
                        backgroundColor: "#000000",

                        borderTopColor: "#263449",

                        borderTopWidth: 0,
                    },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "home"
                                    : "home-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "search"
                                    : "search-outline"
                            }
                            size={24}
                            color={color}
                        />
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
                            className="w-12 h-12 mt-5 rounded-full items-center justify-center"
                            style={{
                                backgroundColor: focused
                                    ? "#4525D9"
                                    : "#5B3DF5",
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
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "chatbubble"
                                    : "chatbubble-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={
                                focused
                                    ? "person"
                                    : "person-outline"
                            }
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}