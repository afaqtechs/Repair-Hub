import { supabase } from '@/src/lib/supabase';

export type PartFilter = {
  price: number;
  model: string | null;
  brand: string | null;
};

export type TechnicianFilter = {
  city: string | null;
};

export type ServiceFilter = {
  price: number;
};

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[filtersApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Filters API
// ─────────────────────────────────────────────

export const filtersApi = {
  // ─────────────────────────────────────────────
  // Filter parts
  // ─────────────────────────────────────────────

  async filterParts(): Promise<PartFilter[]> {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select('price, model, brand');

      if (error) {
        logApiError('filterParts', error);
        return [];
      }

      return data ?? [];
    } catch (error) {
      logApiError('filterParts', error);
      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Filter services
  // ─────────────────────────────────────────────

  async filterServices(): Promise<ServiceFilter[]> {
    try {
      const { data, error } = await supabase.from('services').select('price');

      if (error) {
        logApiError('filterServices', error);
        return [];
      }

      return data ?? [];
    } catch (error) {
      logApiError('filterServices', error);
      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Filter technicians
  // ─────────────────────────────────────────────

  async filterTechnicians(): Promise<TechnicianFilter[]> {
    try {
      const { data, error } = await supabase.from('profiles').select('city');

      if (error) {
        logApiError('filterTechnicians', error);
        return [];
      }

      return data ?? [];
    } catch (error) {
      logApiError('filterTechnicians', error);
      return [];
    }
  },
};
