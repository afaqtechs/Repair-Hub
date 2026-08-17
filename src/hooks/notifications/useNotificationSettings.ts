import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { notificationSettingsApi } from "@/src/api/notifications/notification-settings.api";
import { NotificationSetting, NotificationType } from "@/types/notifications";

export const NOTIFICATION_SETTING_KEYS = {
    all: ["notification-settings"] as const,

    user: (userId: string) =>
        ["notification-settings", userId] as const,
};

export const useNotificationSettings = (
    userId?: string
) => {
    return useQuery({
        queryKey: userId
            ? NOTIFICATION_SETTING_KEYS.user(userId)
            : NOTIFICATION_SETTING_KEYS.all,

        queryFn: () =>
            notificationSettingsApi.getSettings(userId!),

        enabled: !!userId,
    });
};

export const useUpdateNotificationSetting = (
    userId?: string
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            type,
            enabled,
        }: {
            type: NotificationType;
            enabled: boolean;
        }) => {
            if (!userId) {
                throw new Error("User is not authenticated.");
            }

            return notificationSettingsApi.updateSetting(
                userId,
                type,
                enabled
            );
        },

        // Immediately update UI
        onMutate: async ({ type, enabled }) => {
            if (!userId) return;

            const queryKey =
                NOTIFICATION_SETTING_KEYS.user(userId);

            // Cancel request currently fetching settings
            await queryClient.cancelQueries({
                queryKey,
            });

            // Save previous value in case request fails
            const previousSettings =
                queryClient.getQueryData<NotificationSetting[]>(
                    queryKey
                );

            // Optimistically update cache
            queryClient.setQueryData<NotificationSetting[]>(
                queryKey,
                current => {
                    if (!current) {
                        return [
                            {
                                type,
                                enabled,
                            } as NotificationSetting,
                        ];
                    }

                    const exists = current.some(
                        setting => setting.type === type
                    );

                    if (exists) {
                        return current.map(setting =>
                            setting.type === type
                                ? {
                                    ...setting,
                                    enabled,
                                }
                                : setting
                        );
                    }

                    return [
                        ...current,
                        {
                            type,
                            enabled,
                        } as NotificationSetting,
                    ];
                }
            );

            return {
                previousSettings,
            };
        },

        // Roll back if database update fails
        onError: (_error, _variables, context) => {
            if (!userId || !context) return;

            queryClient.setQueryData(
                NOTIFICATION_SETTING_KEYS.user(userId),
                context.previousSettings
            );
        },

        // Make sure server/cache are eventually synchronized
        onSettled: () => {
            if (!userId) return;

            queryClient.invalidateQueries({
                queryKey:
                    NOTIFICATION_SETTING_KEYS.user(userId),
            });
        },
    });
};