import { supabase } from '@/src/lib/supabase';

interface SaveDevicePushTokenParams {
  userId: string;
  expoPushToken: string;
  deviceId?: string | null;
  platform?: 'ios' | 'android' | 'web' | null;
}

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logDeviceTokenError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[deviceTokensApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Device Push Tokens API
// ─────────────────────────────────────────────

export const deviceTokensApi = {
  // ─────────────────────────────────────────────
  // Save / update token
  // ─────────────────────────────────────────────

  async saveToken({
    userId,
    expoPushToken,
    deviceId = null,
    platform = null,
  }: SaveDevicePushTokenParams) {
    try {
      const { data, error } = await supabase
        .from('device_push_tokens')
        .upsert(
          {
            user_id: userId,
            expo_push_token: expoPushToken,
            device_id: deviceId,
            platform,
            is_active: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'expo_push_token',
          }
        )
        .select()
        .single();

      if (error) {
        logDeviceTokenError('saveToken', error);

        return null;
      }

      return data;
    } catch (error) {
      logDeviceTokenError('saveToken', error);

      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Deactivate token
  // ─────────────────────────────────────────────

  async deactivateToken(expoPushToken: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('device_push_tokens')
        .update({
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('expo_push_token', expoPushToken);

      if (error) {
        logDeviceTokenError('deactivateToken', error);

        return false;
      }

      return true;
    } catch (error) {
      logDeviceTokenError('deactivateToken', error);

      return false;
    }
  },
};
