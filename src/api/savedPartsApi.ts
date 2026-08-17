import { supabase } from '@/src/lib/supabase';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (
  method: string,
  error: unknown
) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.log(`[savedPartsApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Saved Parts API
// ─────────────────────────────────────────────

export const savedPartsApi = {
  // ─────────────────────────────────────────────
  // Check if part is saved
  // ─────────────────────────────────────────────

  async isSaved(
    technicianId: string,
    partId: string
  ): Promise<boolean> {
    try {
      const {
        data,
        error,
      } = await supabase
        .from('saved_parts')
        .select('id')
        .eq(
          'technician_id',
          technicianId
        )
        .eq(
          'part_id',
          partId
        )
        .maybeSingle();

      if (error) {
        logApiError(
          'isSaved',
          error
        );

        return false;
      }

      return !!data;
    } catch (error) {
      logApiError(
        'isSaved',
        error
      );

      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Save part
  // ─────────────────────────────────────────────

  async savePart(
    technicianId: string,
    partId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_parts')
        .insert({
          technician_id: technicianId,
          part_id: partId,
        });

      if (error) {
        logApiError(
          'savePart',
          error
        );

        return false;
      }

      return true;
    } catch (error) {
      logApiError(
        'savePart',
        error
      );

      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Unsave part
  // ─────────────────────────────────────────────

  async unsavePart(
    technicianId: string,
    partId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_parts')
        .delete()
        .eq(
          'technician_id',
          technicianId
        )
        .eq(
          'part_id',
          partId
        );

      if (error) {
        logApiError(
          'unsavePart',
          error
        );

        return false;
      }

      return true;
    } catch (error) {
      logApiError(
        'unsavePart',
        error
      );

      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Get saved parts by technician
  // ─────────────────────────────────────────────

  async getSavedPartsByTechnician(
    technicianId: string
  ) {
    try {
      const {
        data,
        error,
      } = await supabase
        .from('saved_parts')
        .select(
          `
            *,
            parts:parts (
              *,
              category:categories(*),
              platform:platforms(*),
              condition:conditions(*),
              technician:profiles(*)
            )
          `
        )
        .eq(
          'technician_id',
          technicianId
        )
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError(
          'getSavedPartsByTechnician',
          error
        );

        return [];
      }

      return data ?? [];
    } catch (error) {
      logApiError(
        'getSavedPartsByTechnician',
        error
      );

      return [];
    }
  },
};