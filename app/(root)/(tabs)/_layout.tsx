import { useTheme } from "@/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabsLayout() {
    const { isDark } = useTheme();

    return (
        <Tabs
            initialRouteName="index"
            backBehavior="history"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#5B3DF5",
                tabBarInactiveTintColor: isDark ? "#94A3B8" : "#98A2B3",
                tabBarLabelStyle: { fontSize: 12, fontFamily: "manrope-medium" },
                tabBarStyle: {
                    backgroundColor: isDark ? "#0B1120" : "#F8F7FC",
                    borderTopColor: isDark ? "#263449" : "#E5E7EB",
                    borderTopWidth: 1,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: "",
                    tabBarIcon: ({ focused }) => (
                        <View
                            className="w-16 h-16 rounded-full items-center justify-center"
                            style={{
                                backgroundColor: focused ? "#4525D9" : "#5B3DF5",
                                borderWidth: 4,
                                borderColor: isDark ? "#172033" : "#FFFFFF",
                                elevation: 4,
                                shadowColor: "#5B3DF5",
                                shadowOffset: { width: 0, height: 6 },
                                shadowOpacity: 0.25,
                                shadowRadius: 12,
                            }}
                        >
                            <Ionicons name="add" size={30} color="#FFFFFF" />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="inbox"
                options={{
                    title: "Inbox",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}