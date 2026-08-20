import { supabase } from '@/src/lib/supabase';
import { ProfileDto, Technician } from '@/types/profiles';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[profileApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Profile API
// ─────────────────────────────────────────────

export const profileApi = {
  // ─────────────────────────────────────────────
  // Get technicians
  // ─────────────────────────────────────────────

  async getTechnicians(): Promise<Technician[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'technician')
        .eq('is_active', true)
        .order('first_name', {
          ascending: true,
        });

      if (error) {
        logApiError('getTechnicians', error);

        return [];
      }

      return (data as Technician[]) || [];
    } catch (error) {
      logApiError('getTechnicians', error);

      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Get single technician
  // ─────────────────────────────────────────────

  async getTechnician(id: string): Promise<Technician | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getTechnician', error);

        return null;
      }

      return data as Technician | null;
    } catch (error) {
      logApiError('getTechnician', error);

      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Update profile
  // ─────────────────────────────────────────────

  async update(
    id: string,
    payload: Partial<ProfileDto>
  ): Promise<Technician | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);
        return null;
      }

      return data as Technician;
    } catch (error) {
      logApiError('update', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Update presence
  // ─────────────────────────────────────────────

  async updatePresence(isAvailable: boolean): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_my_presence', {
        p_is_available: isAvailable,
      });

      if (error) {
        logApiError('updatePresence', error);

        return false;
      }

      return true;
    } catch (error) {
      logApiError('updatePresence', error);

      return false;
    }
  },
};
