import { supabase } from '@/src/lib/supabase';
import { CreateServiceDto, Service, UpdateServiceDto } from '@/types/services';
import { deleteServiceImages } from './storage.api';
import { sendNotification } from './notifications/send-notifications.api';

export interface GetAllServicesParams {
  page?: number;
  pageSize?: number;
  search?: string;

  categoryId?: string | null;
  platformId?: string | null;

  priceMin?: number | null;
  priceMax?: number | null;

  city?: string | null;

  isActive?: boolean | null;
}

export interface PaginatedServicesResponse {
  data: Service[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[serviceApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Service API
// ─────────────────────────────────────────────

export const serviceApi = {
  // ==========================================
  // GET ALL SERVICES
  // ==========================================

  async getAllServices({
    page = 1,
    pageSize = 100,
    search = '',

    categoryId = null,
    platformId = null,

    priceMin = null,
    priceMax = null,

    city = null,

    isActive = true,
  }: GetAllServicesParams = {}): Promise<PaginatedServicesResponse> {
    try {
      const cleanSearch = search.trim();

      // ==========================================
      // SEARCH USING RPC
      // ==========================================

      if (cleanSearch) {
        const { data: searchedServices, error } = await supabase.rpc(
          'search_services',
          {
            search_term: cleanSearch,
            page_number: page,
            page_size: pageSize,
          }
        );

        if (error) {
          logApiError('getAllServices.search', error);

          return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
          };
        }

        if (!searchedServices || searchedServices.length === 0) {
          return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
          };
        }

        const ids = searchedServices.map(
          (service: { id: string }) => service.id
        );

        let query = supabase
          .from('services')
          .select(
            `
              *,
              technician:profiles!inner(*),
              category:categories(*),
              platform:platforms(*)
            `,
            { count: 'exact' }
          )
          .in('id', ids)
          .order('created_at', {
            ascending: false,
          });

        // ==========================================
        // FILTERS
        // ==========================================

        if (isActive !== null) {
          query = query.eq('is_active', isActive);
        }

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (platformId) {
          query = query.eq('platform_id', platformId);
        }

        if (priceMin !== null) {
          query = query.gte('price', priceMin);
        }

        if (priceMax !== null) {
          query = query.lt('price', priceMax);
        }

        if (city) {
          query = query.eq('technician.city', city);
        }

        // ==========================================
        // PAGINATION
        // ==========================================

        const from = (page - 1) * pageSize;

        const to = page * pageSize - 1;

        const { data, count, error: filterError } = await query.range(from, to);

        if (filterError) {
          logApiError('getAllServices.search.filters', filterError);

          return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
          };
        }

        const totalCount = count ?? 0;

        return {
          data: (data as Service[]) ?? [],
          totalCount,
          totalPages: totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0,
          currentPage: page,
        };
      }

      // ==========================================
      // NORMAL QUERY
      // ==========================================

      const from = (page - 1) * pageSize;

      const to = page * pageSize - 1;

      let query = supabase
        .from('services')
        .select(
          `
            *,
            technician:profiles!inner(*),
            category:categories(*),
            platform:platforms(*)
          `,
          { count: 'exact' }
        )
        .order('created_at', {
          ascending: false,
        });

      // ==========================================
      // FILTERS
      // ==========================================

      if (isActive !== null) {
        query = query.eq('is_active', isActive);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (platformId) {
        query = query.eq('platform_id', platformId);
      }

      if (priceMin !== null) {
        query = query.gte('price', priceMin);
      }

      if (priceMax !== null) {
        query = query.lt('price', priceMax);
      }

      if (city) {
        query = query.eq('technician.city', city);
      }

      // ==========================================
      // PAGINATION
      // ==========================================

      const { data, count, error } = await query.range(from, to);

      if (error) {
        logApiError('getAllServices', error);

        return {
          data: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      const totalCount = count ?? 0;

      return {
        data: (data as Service[]) ?? [],
        totalCount,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0,
        currentPage: page,
      };
    } catch (error) {
      logApiError('getAllServices', error);

      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }
  },

  // ==========================================
  // GET SINGLE SERVICE
  // ==========================================

  async getSingleService(id: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(
          `
            *,
            technician:profiles(*),
            category:categories(*),
            platform:platforms(*)
          `
        )
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getSingleService', error);

        return null;
      }

      return data as Service | null;
    } catch (error) {
      logApiError('getSingleService', error);

      return null;
    }
  },

  // ==========================================
  // GET SERVICES BY TECHNICIAN
  // ==========================================

  async getServicesByTechnician(technicianId: string): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(
          `
            *,
            technician:profiles(*),
            category:categories(*),
            platform:platforms(*)
          `
        )
        .eq('technician_id', technicianId)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError('getServicesByTechnician', error);

        return [];
      }

      return (data as Service[]) ?? [];
    } catch (error) {
      logApiError('getServicesByTechnician', error);

      return [];
    }
  },

  // ==========================================
  // CREATE SERVICE
  // ==========================================

  async create(payload: CreateServiceDto): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(payload)
        .select()
        .single();

      if (error) {
        logApiError('create', error);

        return null;
      }

      if (!payload?.technician_id) {
        logApiError('Error', 'No technician_id. Notification skipped.');

        return data as Service;
      }

      await sendNotification({
        userId: payload.technician_id,
        senderId:payload.technician_id,
        type: 'new_services',
        title: 'New Service',
        body: payload.title || 'New service is add. tab here to explore.',
        data: {
          request_id: data.id,
        },
      });

      return data as Service;
    } catch (error) {
      logApiError('create', error);

      return null;
    }
  },

  // ==========================================
  // UPDATE SERVICE
  // ==========================================

  async update(id: string, payload: UpdateServiceDto): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);

        return null;
      }

      return data as Service;
    } catch (error) {
      logApiError('update', error);

      return null;
    }
  },

  // ==========================================
  // MARK INACTIVE
  // ==========================================

  async markAsInactive(id: string, isActive: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('services')
        .update({
          is_active: isActive,
        })
        .eq('id', id);

      if (error) {
        logApiError('markAsInactive', error);

        return false;
      }

      return true;
    } catch (error) {
      logApiError('markAsInactive', error);

      return false;
    }
  },

  // ==========================================
  // DELETE SERVICE
  // ==========================================

  async remove(id: string): Promise<boolean> {
    try {
      // ==========================================
      // Get service images
      // ==========================================

      const { data: service, error: fetchError } = await supabase
        .from('services')
        .select('images')
        .eq('id', id)
        .single();

      if (fetchError) {
        logApiError('remove', fetchError);

        return false;
      }

      const images = Array.isArray(service?.images) ? service.images : [];

      // ==========================================
      // Delete service
      // ==========================================

      const { error: deleteError } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (deleteError) {
        logApiError('remove', deleteError);

        return false;
      }

      // ==========================================
      // Delete images
      // ==========================================

      if (images.length > 0) {
        try {
          await deleteServiceImages(images);
        } catch (storageError) {
          logApiError('remove.images', storageError);
        }
      }

      return true;
    } catch (error) {
      logApiError('remove', error);

      return false;
    }
  },
};
