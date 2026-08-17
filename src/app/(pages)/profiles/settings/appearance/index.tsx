import { useTheme } from "@/src/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppearanceScreen() {
    const { themeMode, setThemeMode, isDark } = useTheme();
    const router = useRouter();

    const insets = useSafeAreaInsets();

    const themes = [
        { label: "Light", key: "light", icon: "sunny-outline", description: "Use the light appearance" },
        { label: "Dark", key: "dark", icon: "moon-outline", description: "Use the dark appearance" },
        { label: "System", key: "system", icon: "phone-portrait-outline", description: "Follow device settings" },
    ];

    return (
        <View
            style={{ flex: 1, paddingTop: insets.top }}
            className="flex-1 bg-bg dark:bg-bg-dark">
            {/* Header */}
            <View className="px-4 pt-2 pb-3 bg-bg dark:bg-bg-dark">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 items-center justify-center rounded-2xl bg-card dark:bg-card-dark border border-border dark:border-border-dark"
                    >
                        <Ionicons name="arrow-back" size={20} color={isDark ? "#F8FAFC" : "#171A2B"} />
                    </TouchableOpacity>
                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text dark:text-text-dark">Appearance</Text>
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 40,
                    paddingHorizontal: 16,
                    flexGrow: 1
                }}
            >
                {/* Theme Options Card */}
                <View className="overflow-hidden gap-3">
                    {themes.map((theme, index) => {
                        const selected = themeMode === theme.key;
                        return (
                            <TouchableOpacity
                                key={theme.key}
                                onPress={() => setThemeMode(theme.key as any)}
                                className={`
                                        flex-row items-center justify-between px-4 py-3.5 rounded-lg
                                        ${selected ? "bg-card/30 dark:bg-card-dark/30" : " bg-card/50 dark:bg-card-dark/50"}
                                    `}
                            >
                                <View className="flex-row items-center flex-1">
                                    {/* Icon */}
                                    <View className={`w-9 h-9 rounded-full items-center justify-center ${selected ? "bg-primary" : "bg-input-background dark:bg-input-dark"}`}>
                                        <Ionicons name={theme.icon as any} size={18} color={selected ? "#FFFFFF" : isDark ? "#CBD5E1" : "#667085"} />
                                    </View>
                                    <View className="ml-3 flex-1">
                                        <Text className={`font-manrope-medium text-[16px] ${selected ? "text-primary" : "text-text dark:text-text-dark"}`}>{theme.label}</Text>
                                        <Text className="mt-0.5 text-[13px] font-manrope-regular text-text-muted dark:text-text-darkMuted">{theme.description}</Text>
                                    </View>
                                </View>
                                {selected ? (
                                    <Ionicons name="checkmark-circle" size={22} color="#5B3DF5" />
                                ) : (
                                    <View className="w-5.5 h-5.5 rounded-full border-2 border-border dark:border-border-dark" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
                {/* Info Section */}
                <View className="mt-6 px-1">
                    <Text className="text-[13px] font-manrope-regular text-text-muted dark:text-text-darkMuted leading-5">
                        {themeMode === "light" && "Light mode is active"}
                        {themeMode === "dark" && "Dark mode is active"}
                        {themeMode === "system" && "Following system settings"}
                    </Text>
                </View>
                {/* Preview Section */}
                <View className="mt-1 bg-card dark:bg-card-dark rounded-lg p-4">
                    <Text className="text-[13px] font-manrope-medium text-text-muted dark:text-text-darkMuted mb-3">PREVIEW</Text>
                    <View className="rounded-lg p-4 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full items-center justify-center bg-input-background dark:bg-input-dark">
                                <Ionicons name="person-outline" size={20} color={isDark ? "#94A3B8" : "#667085"} />
                            </View>
                            <View className="ml-3">
                                <View className="h-3.5 w-24 rounded-full bg-skeleton dark:bg-skeleton-dark" />
                                <View className="h-2.5 w-16 rounded-full mt-1.5 bg-skeleton dark:bg-skeleton-dark" />
                            </View>
                        </View>
                        <View className="mt-3">
                            <View className="h-3 w-full rounded-full bg-skeleton dark:bg-skeleton-dark" />
                            <View className="h-3 w-3/4 rounded-full mt-1.5 bg-skeleton dark:bg-skeleton-dark" />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}