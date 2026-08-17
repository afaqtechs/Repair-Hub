import { supabase } from '@/src/lib/supabase';
import { Platform } from '@/types/platform';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[platformsApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Platforms API
// ─────────────────────────────────────────────

export const platformsApi = {
  // ─────────────────────────────────────────────
  // Get all platforms
  // ─────────────────────────────────────────────

  async getAll(): Promise<Platform[]> {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        logApiError('getAll', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logApiError('getAll', error);
      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Get single platform
  // ─────────────────────────────────────────────

  async getSingle(id: string): Promise<Platform | null> {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getSingle', error);
        return null;
      }

      return data as Platform | null;
    } catch (error) {
      logApiError('getSingle', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Create platform
  // ─────────────────────────────────────────────

  async create(
    payload: Pick<Platform, 'name' | 'slug'>
  ): Promise<Platform | null> {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .insert(payload)
        .select()
        .single();

      if (error) {
        logApiError('create', error);
        return null;
      }

      return data;
    } catch (error) {
      logApiError('create', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Update platform
  // ─────────────────────────────────────────────

  async update(
    id: string,
    payload: Partial<Platform>
  ): Promise<Platform | null> {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);
        return null;
      }

      return data;
    } catch (error) {
      logApiError('update', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Remove platform
  // ─────────────────────────────────────────────

  async remove(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('platforms').delete().eq('id', id);

      if (error) {
        logApiError('remove', error);
        return false;
      }

      return true;
    } catch (error) {
      logApiError('remove', error);
      return false;
    }
  },
};
