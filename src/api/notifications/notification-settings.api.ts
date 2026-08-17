import { supabase } from '@/src/lib/supabase';
import { NotificationSetting, NotificationType } from '@/types/notifications';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logNotificationError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[notificationSettingsApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Notification Settings API
// ─────────────────────────────────────────────

export const notificationSettingsApi = {
  // ─────────────────────────────────────────────
  // Get notification settings
  // ─────────────────────────────────────────────

  async getSettings(userId: string): Promise<NotificationSetting[]> {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        logNotificationError('getSettings', error);

        return [];
      }

      return data ?? [];
    } catch (error) {
      logNotificationError('getSettings', error);

      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Update notification setting
  // ─────────────────────────────────────────────

  async updateSetting(
    userId: string,
    type: NotificationType,
    enabled: boolean
  ): Promise<NotificationSetting | null> {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .upsert(
          {
            user_id: userId,
            type,
            enabled,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id,type',
          }
        )
        .select()
        .single();

      if (error) {
        logNotificationError('updateSetting', error);

        return null;
      }

      return data;
    } catch (error) {
      logNotificationError('updateSetting', error);

      return null;
    }
  },
};
