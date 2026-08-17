import { supabase } from '@/src/lib/supabase';
import { Condition } from '@/types/condition';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[conditionsApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Conditions API
// ─────────────────────────────────────────────

export const conditionsApi = {
  // ─────────────────────────────────────────────
  // Get all conditions
  // ─────────────────────────────────────────────

  async getAll(): Promise<Condition[]> {
    try {
      const { data, error } = await supabase
        .from('conditions')
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
  // Get single condition
  // ─────────────────────────────────────────────

  async getSingle(id: string): Promise<Condition | null> {
    try {
      const { data, error } = await supabase
        .from('conditions')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getSingle', error);
        return null;
      }

      return data as Condition | null;
    } catch (error) {
      logApiError('getSingle', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Create condition
  // ─────────────────────────────────────────────

  async create(
    payload: Pick<Condition, 'name' | 'description'>
  ): Promise<Condition | null> {
    try {
      const { data, error } = await supabase
        .from('conditions')
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
  // Update condition
  // ─────────────────────────────────────────────

  async update(
    id: string,
    payload: Partial<Condition>
  ): Promise<Condition | null> {
    try {
      const { data, error } = await supabase
        .from('conditions')
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
  // Remove condition
  // ─────────────────────────────────────────────

  async remove(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('conditions').delete().eq('id', id);

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
