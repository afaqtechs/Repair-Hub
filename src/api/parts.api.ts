import { supabase } from '@/src/lib/supabase';
import { CreatePartDto, Part, UpdatePartDto } from '@/types/parts';
import { deletePartImages } from './storage.api';
import { sendNotification } from './notifications/send-notifications.api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface GetAllPartsParams {
  page?: number;
  pageSize?: number;
  search?: string;

  brand?: string | null;
  model?: string | null;

  categoryId?: string | null;
  platformId?: string | null;
  conditionId?: string | null;

  priceMin?: number | null;
  priceMax?: number | null;

  city?: string | null;

  isAvailable?: boolean | null;
}

export interface PaginatedPartsResponse {
  data: Part[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[partApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Parts API
// ─────────────────────────────────────────────

export const partApi = {
  // ==========================================
  // GET ALL PARTS
  // ==========================================

  async getAllParts({
    page = 1,
    pageSize = 100,
    search = '',

    brand = null,
    model = null,

    categoryId = null,
    platformId = null,
    conditionId = null,

    priceMin = null,
    priceMax = null,

    city = null,

    isAvailable = true,
  }: GetAllPartsParams = {}): Promise<PaginatedPartsResponse> {
    try {
      const cleanSearch = search.trim();

      // ==========================================
      // SEARCH USING RPC
      // ==========================================

      if (cleanSearch) {
        const { data: searchedParts, error } = await supabase.rpc(
          'search_parts',
          {
            search_term: cleanSearch,
            page_number: page,
            page_size: pageSize,
          }
        );

        if (error) {
          logApiError('getAllParts', error);

          return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
          };
        }

        if (!searchedParts || searchedParts.length === 0) {
          return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
          };
        }

        const ids = searchedParts.map((part: { id: string }) => part.id);

        let query = supabase
          .from('parts')
          .select(
            `
              *,
              technician:profiles!inner(*),
              category:categories(*),
              condition:conditions(*),
              platform:platforms(*)
            `,
            { count: 'exact' }
          )
          .in('id', ids)
          .eq('technician.is_active', true)
          .eq('is_approved', true)
          .order('created_at', {
            ascending: false,
          });

        // ==========================================
        // FILTERS
        // ==========================================

        if (isAvailable !== null) {
          query = query.eq('is_available', isAvailable);
        }

        if (brand) {
          query = query.eq('brand', brand);
        }

        if (model) {
          query = query.eq('model', model);
        }

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        if (platformId) {
          query = query.eq('platform_id', platformId);
        }

        if (conditionId) {
          query = query.eq('condition_id', conditionId);
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
          logApiError('getAllParts', filterError);

          return {
            data: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: page,
          };
        }

        const totalCount = count ?? 0;

        return {
          data: (data as Part[]) ?? [],
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
        .from('parts')
        .select(
          `
            *,
            technician:profiles!inner(*),
            category:categories(*),
            condition:conditions(*),
            platform:platforms(*)
          `,
          { count: 'exact' }
        )
        .eq('technician.is_active', true)
        .eq('is_approved', true)
        .order('created_at', {
          ascending: false,
        });

      // ==========================================
      // FILTERS
      // ==========================================

      if (isAvailable !== null) {
        query = query.eq('is_available', isAvailable);
      }

      if (brand) {
        query = query.eq('brand', brand);
      }

      if (model) {
        query = query.eq('model', model);
      }

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (platformId) {
        query = query.eq('platform_id', platformId);
      }

      if (conditionId) {
        query = query.eq('condition_id', conditionId);
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
        logApiError('getAllParts', error);

        return {
          data: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      const totalCount = count ?? 0;

      return {
        data: (data as Part[]) ?? [],
        totalCount,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0,
        currentPage: page,
      };
    } catch (error) {
      logApiError('getAllParts', error);

      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }
  },

  // ==========================================
  // GET SINGLE PART
  // ==========================================

  async getSinglePart(id: string): Promise<Part | null> {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select(
          `
            *,
            technician:profiles(*),
            category:categories(*),
            condition:conditions(*),
            platform:platforms(*)
          `
        )
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getSinglePart', error);

        return null;
      }

      return data as Part | null;
    } catch (error) {
      logApiError('getSinglePart', error);

      return null;
    }
  },

  // ==========================================
  // GET PARTS BY TECHNICIAN
  // ==========================================

  async getPartsByTechnician(technicianId: string): Promise<Part[]> {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select(
          `
            *,
            technician:profiles!inner(*),
            category:categories(*),
            condition:conditions(*),
            platform:platforms(*)
          `
        )
        .eq('technician_id', technicianId)
        .eq('technician.is_active', true)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError('getPartsByTechnician', error);

        return [];
      }

      return (data as Part[]) ?? [];
    } catch (error) {
      logApiError('getPartsByTechnician', error);

      return [];
    }
  },

  // ==========================================
  // CREATE
  // ==========================================

  async create(payload: CreatePartDto): Promise<Part | null> {
    try {
      const { data, error } = await supabase
        .from('parts')
        .insert(payload)
        .select()
        .single();

      if (error) {
        logApiError('create', error);
        return null;
      }

      if (!payload?.technician_id) {
        logApiError('Error', 'No technician_id. Notification skipped.');

        return data as Part;
      }

      await sendNotification({
        userId: payload.technician_id,
        senderId: payload.technician_id,
        type: 'new_spare_parts',
        title: 'New Spare Part',
        body: payload.title || 'New spare part is add. tab here to explore',
        data: {
          request_id: data.id,
        },
      });

      return data as Part;
    } catch (error) {
      logApiError('create', error);
      return null;
    }
  },

  // ==========================================
  // UPDATE
  // ==========================================

  async update(id: string, payload: UpdatePartDto): Promise<Part | null> {
    try {
      const { data, error } = await supabase
        .from('parts')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);
        return null;
      }

      return data as Part;
    } catch (error) {
      logApiError('update', error);
      return null;
    }
  },

  // ==========================================
  // MARK UNAVAILABLE
  // ==========================================

  async markAsUnavailable(id: string, isAvailable: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('parts')
        .update({
          is_available: isAvailable,
        })
        .eq('id', id);

      if (error) {
        logApiError('markAsUnavailable', error);

        return false;
      }

      return true;
    } catch (error) {
      logApiError('markAsUnavailable', error);

      return false;
    }
  },

  // ==========================================
  // DELETE
  // ==========================================

  async remove(id: string): Promise<boolean> {
    try {
      const { data: part, error: fetchError } = await supabase
        .from('parts')
        .select('images')
        .eq('id', id)
        .single();

      if (fetchError) {
        logApiError('remove', fetchError);

        return false;
      }

      const images = Array.isArray(part?.images) ? part.images : [];

      const { error: deleteError } = await supabase
        .from('parts')
        .delete()
        .eq('id', id);

      if (deleteError) {
        logApiError('remove', deleteError);

        return false;
      }

      // Image deletion failure should not
      // make the part deletion fail.
      if (images.length > 0) {
        try {
          await deletePartImages(images);
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
