import { useAuth } from "@/src/context/AuthContext";
import {
    useNotificationSettings,
    useUpdateNotificationSetting,
} from "@/src/hooks/notifications/useNotificationSettings";
import { showError } from "@/src/lib/toast";
import { NotificationSettingDefinition, NotificationType } from "@/types/notifications";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const SETTINGS: NotificationSettingDefinition[] = [
    // Activity
    {
        type: "new_spare_parts",
        title: "New Spare Parts",
        description:
            "Get notified when new spare parts are added",
        icon: "construct-outline",
        category: "activity",
    },
    {
        type: "new_requests",
        title: "New Repair Requests",
        description:
            "Get notified when new repair requests are submitted",
        icon: "hammer-outline",
        category: "activity",
    },
    {
        type: "new_services",
        title: "New Services",
        description:
            "Get notified when new repair services are added",
        icon: "settings-outline",
        category: "activity",
    },

    // Requests
    {
        type: "urgent_requests",
        title: "Urgent Requests",
        description:
            "Priority notifications for urgent repair requests",
        icon: "alert-circle-outline",
        category: "requests",
    },

    // Messages
    {
        type: "new_messages",
        title: "New Inbox Messages",
        description:
            "Receive alerts when you receive a new chat message",
        icon: "chatbubble-outline",
        category: "messages",
    },

    // General
    {
        type: "app_updates",
        title: "App Updates",
        description:
            "Get notified about new features and app improvements",
        icon: "cloud-upload-outline",
        category: "general",
    },
    {
        type: "maintenance_alerts",
        title: "Maintenance Alerts",
        description:
            "Receive alerts about system maintenance and downtime",
        icon: "warning-outline",
        category: "general",
    },
    {
        type: "system_notifications",
        title: "System Notifications",
        description:
            "Receive important notifications from the system",
        icon: "notifications-outline",
        category: "general",
    },
];

const CATEGORIES = [
    "activity",
    "messages",
    "requests",
    "general",
] as const;


const Notifications = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const { user } = useAuth();

    const { data: savedSettings = [], isLoading } =
        useNotificationSettings(user?.id);

    const updateSettingMutation =
        useUpdateNotificationSetting(user?.id);

    /**
     * Keeps track of the switch currently being updated.
     *
     * This is better than using mutation.isPending because
     * mutation.isPending would disable every switch.
     */
    const [updatingType, setUpdatingType] =
        useState<NotificationType | null>(null);

    const isEnabled = (type: NotificationType) => {
        const setting = savedSettings.find(
            item => item.type === type
        );

        return setting?.enabled ?? false;
    };

    const enabledCount = SETTINGS.filter(setting =>
        isEnabled(setting.type)
    ).length;

    const totalCount = SETTINGS.length;

    const allEnabled = enabledCount === totalCount;

    const toggleSetting = (type: NotificationType) => {
        if (!user?.id) {
            showError(
                "Error",
                "You must be signed in to update notification settings."
            );
            return;
        }

        /**
         * Read the current value from React Query.
         *
         * Because the mutation is optimistic, this value
         * changes immediately after the user taps.
         */
        const currentValue = isEnabled(type);

        setUpdatingType(type);

        updateSettingMutation.mutate(
            {
                type,
                enabled: !currentValue,
            },
            {
                onError: error => {
                    showError(
                        "Error",
                        error instanceof Error
                            ? error.message
                            : "Failed to update notification setting."
                    );
                },

                onSettled: () => {
                    setUpdatingType(null);
                },
            }
        );
    };

    const toggleAllNotifications = (enabled: boolean) => {
        if (!user?.id) {
            showError(
                "Error",
                "You must be signed in to update notification settings."
            );
            return;
        }

        /**
         * We don't use Promise.all here because your
         * mutation handles optimistic updates individually.
         */
        SETTINGS.forEach(setting => {
            updateSettingMutation.mutate({
                type: setting.type,
                enabled,
            });
        });
    };

    const getCategoryTitle = (
        category: NotificationSettingDefinition["category"]
    ) => {
        switch (category) {
            case "activity":
                return "Activity";

            case "messages":
                return "Messages";

            case "requests":
                return "Repair Requests";

            case "general":
                return "General";
        }
    };

    const renderSettingItem = (
        setting: NotificationSettingDefinition,
        index: number,
        length: number
    ) => {
        const enabled = isEnabled(setting.type);

        const isUpdating =
            updatingType === setting.type;

        return (
            <View
                key={setting.type}
                className={`flex-row items-center justify-between py-3.5 ${index !== length - 1
                    ? "border-b border-border-dark/50"
                    : ""
                    }`}
            >
                <View className="flex-row items-center flex-1">
                    <Ionicons
                        name={setting.icon}
                        size={20}
                        color={
                            enabled
                                ? "#6366F1"
                                :  "#64748B"
                        }
                    />

                    <View className="ml-4 flex-1">
                        <Text className="text-[15px] font-manrope-semibold text-text-dark">
                            {setting.title}
                        </Text>

                        <Text className="text-xs font-manrope-light text-text-darkMuted">
                            {setting.description}
                        </Text>
                    </View>
                </View>

                <Switch
                    value={enabled}
                    disabled={isUpdating}
                    onValueChange={() =>
                        toggleSetting(setting.type)
                    }
                    trackColor={{
                        false: "#2D3A4F",
                        true: "#6366F1",
                    }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor="#2D3A4F"
                />
            </View>
        );
    };

    return (
        <View
            style={{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
            }}
            className="flex-1 bg-bg-dark"
        >
            {/* Header */}
            <View className="px-4 pt-2 pb-5 bg-bg-dark">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-2xl bg-card-dark border border-border-dark"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color= "#F8FAFC"
                        />
                    </TouchableOpacity>

                    <Text className="ml-2 text-[20px] font-manrope-semibold text-text-dark">
                        Notifications
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 40,
                    paddingHorizontal: 16,
                }}
            >
                {/* Summary Card */}
                <View className="mb-6 px-4 py-4 bg-card-dark rounded-xl">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-base font-manrope-semibold text-text-dark">
                                Notification Settings
                            </Text>

                            <Text className="text-sm text-text-darkMuted font-manrope-light">
                                {isLoading
                                    ? "Loading notification settings..."
                                    : `${enabledCount} of ${totalCount} notifications enabled`}
                            </Text>
                        </View>

                        {!isLoading && (
                            <View className="px-3 py-1.5 bg-primary/20 rounded-full">
                                <Text className="text-xs text-primary font-manrope-bold">
                                    {Math.round(
                                        (enabledCount /
                                            totalCount) *
                                        100
                                    )}
                                    %
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Enable / Disable All */}
                <View className="mb-6">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        disabled={
                            isLoading ||
                            updateSettingMutation.isPending
                        }
                        className={`flex-row items-center justify-center gap-2 py-3.5 rounded-xl ${allEnabled
                            ? "bg-card-dark border border-border-dark"
                            : "bg-primary"
                            }`}
                        onPress={() =>
                            toggleAllNotifications(
                                !allEnabled
                            )
                        }
                    >
                        <Ionicons
                            name={
                                allEnabled
                                    ? "close-circle-outline"
                                    : "checkmark-circle"
                            }
                            size={21}
                            color={
                                allEnabled
                                    ? "#F8FAFC"
                                    : "#22C55E"
                            }
                        />

                        <Text
                            className={`font-manrope-semibold text-base ${allEnabled
                                ? "text-text-dark"
                                : "text-white"
                                }`}
                        >
                            {allEnabled
                                ? "Disable all"
                                : "Enable all"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Settings */}
                {isLoading ? (
                    <View className="py-10 items-center">
                        <Text className="text-sm font-manrope-light text-text-darkMuted">
                            Loading notification settings...
                        </Text>
                    </View>
                ) : (
                    CATEGORIES.map(category => {
                        const categorySettings =
                            SETTINGS.filter(
                                setting =>
                                    setting.category ===
                                    category
                            );

                        if (
                            categorySettings.length === 0
                        ) {
                            return null;
                        }

                        return (
                            <View
                                key={category}
                                className="mb-6"
                            >
                                <Text className="mb-1 px-3 text-xs font-manrope-bold uppercase tracking-wider text-text-darkMuted">
                                    {getCategoryTitle(
                                        category
                                    )}
                                </Text>

                                <View className="bg-card-dark px-5 rounded-lg">
                                    {categorySettings.map(
                                        (
                                            setting,
                                            index
                                        ) =>
                                            renderSettingItem(
                                                setting,
                                                index,
                                                categorySettings.length
                                            )
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}

                {/* Footer */}
                <View className="mt-2 px-4 py-3 bg-input-dark/50 rounded-xl">
                    <View className="flex-row items-center gap-2">
                        <Ionicons
                            name="information-circle-outline"
                            size={16}
                            color="#94A3B8"
                        />

                        <Text className="text-xs text-text-darkMuted font-manrope-light flex-1">
                            Push notifications may require
                            app permissions. Manage
                            preferences anytime.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Notifications;