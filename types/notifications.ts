import { Ionicons } from "@expo/vector-icons";

export type NotificationType =
    | "new_spare_parts"
    | "new_requests"
    | "urgent_requests"
    | "new_services"
    | "app_updates"
    | "maintenance_alerts"
    | "new_messages"
    | "system_notifications";

export interface NotificationSetting {
    user_id: string;
    type: NotificationType;
    enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface NotificationSettingDefinition {
    type: NotificationType;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    category:
    | "activity"
    | "messages"
    | "requests"
    | "general";
}

export interface DevicePushToken {
    id: string;
    user_id: string;
    expo_push_token: string;
    device_id: string | null;
    platform: "ios" | "android" | "web" | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}