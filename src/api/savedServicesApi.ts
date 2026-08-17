import { supabase } from '@/src/lib/supabase';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[savedServicesApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Saved Services API
// ─────────────────────────────────────────────

export const savedServicesApi = {
  // ─────────────────────────────────────────────
  // Check if service is saved
  // ─────────────────────────────────────────────

  async isSaved(technicianId: string, serviceId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_services')
        .select('id')
        .eq('technician_id', technicianId)
        .eq('service_id', serviceId)
        .maybeSingle();

      if (error) {
        logApiError('isSaved', error);

        return false;
      }

      return !!data;
    } catch (error) {
      logApiError('isSaved', error);

      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Save service
  // ─────────────────────────────────────────────

  async saveService(technicianId: string, serviceId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('saved_services').insert({
        technician_id: technicianId,
        service_id: serviceId,
      });

      if (error) {
        logApiError('saveService', error);

        return false;
      }

      return true;
    } catch (error) {
      logApiError('saveService', error);

      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Unsave service
  // ─────────────────────────────────────────────

  async unsaveService(
    technicianId: string,
    serviceId: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_services')
        .delete()
        .eq('technician_id', technicianId)
        .eq('service_id', serviceId);

      if (error) {
        logApiError('unsaveService', error);

        return false;
      }

      return true;
    } catch (error) {
      logApiError('unsaveService', error);

      return false;
    }
  },

  // ─────────────────────────────────────────────
  // Get saved services by technician
  // ─────────────────────────────────────────────

  async getSavedServicesByTechnician(technicianId: string) {
    try {
      const { data, error } = await supabase
        .from('saved_services')
        .select(
          `
            *,
            services:services (
              *,
              category:categories(*),
              platform:platforms(*),
              technician:profiles(*)
            )
          `
        )
        .eq('technician_id', technicianId)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError('getSavedServicesByTechnician', error);

        return [];
      }

      return data ?? [];
    } catch (error) {
      logApiError('getSavedServicesByTechnician', error);

      return [];
    }
  },
};
