
import { deviceTokensApi } from "@/src/api/notifications/pushTokens.api";
import { useAuth } from "@/src/context/AuthContext";
import { registerForPushNotificationsAsync } from "@/src/lib/notifications/registerPushNotifications";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export function usePushNotifications() {
    const { user } = useAuth();

    useEffect(() => {
        if (!user?.id || !Device.isDevice) {
            return;
        }

        let notificationListener:
            Notifications.EventSubscription | undefined;

        let responseListener:
            Notifications.EventSubscription | undefined;

        async function setup() {
            try {
                const token =
                    await registerForPushNotificationsAsync();

                if (!token || !user) {
                    return;
                }

                await deviceTokensApi.saveToken({
                    userId: user.id,
                    expoPushToken: token,
                    platform:
                        Platform.OS === "ios"
                            ? "ios"
                            : Platform.OS === "android"
                              ? "android"
                              : "web",
                });

                notificationListener =
                    Notifications.addNotificationReceivedListener(
                        notification => {
                            console.log(
                                "Notification received:",
                                notification
                            );
                        }
                    );

                responseListener =
                    Notifications.addNotificationResponseReceivedListener(
                        response => {
                            console.log(
                                "Notification tapped:",
                                response
                            );
                        }
                    );
            } catch (error) {
                console.error(
                    "Push notification setup failed:",
                    error
                );
            }
        }

        setup();

        return () => {
            notificationListener?.remove();
            responseListener?.remove();
        };
    }, [user?.id,user]);
}