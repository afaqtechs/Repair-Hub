import { supabase } from '@/src/lib/supabase';
import { CreateRequestDto, Request, UpdateRequestDto } from '@/types/requests';
import { deleteRequestImages } from './storage.api';
import { sendNotification } from './notifications/send-notifications.api';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface GetAllRequestsParams {
  page?: number;
  pageSize?: number;
  search?: string;

  categoryId?: string | null;
  platformId?: string | null;

  city?: string | null;

  isActive?: boolean;
}

export interface PaginatedRequestsResponse {
  data: Request[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[requestApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Request API
// ─────────────────────────────────────────────

export const requestApi = {
  // ==========================================
  // GET ALL REQUESTS
  // ==========================================

  async getAllRequests({
    page = 1,
    pageSize = 100,
    search = '',
    categoryId = null,
    platformId = null,
    city = null,
    isActive = true,
  }: GetAllRequestsParams = {}): Promise<PaginatedRequestsResponse> {
    try {
      const from = (page - 1) * pageSize;
      const to = page * pageSize - 1;

      const cleanSearch = search.trim();

      let query = supabase
        .from('requests')
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
      // Active / inactive
      // ==========================================

      if (isActive !== undefined) {
        query = query.eq('is_active', isActive);
      }

      // ==========================================
      // Category
      // ==========================================

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      // ==========================================
      // Platform
      // ==========================================

      if (platformId) {
        query = query.eq('platform_id', platformId);
      }

      // ==========================================
      // Technician city
      // ==========================================

      if (city) {
        query = query.eq('technician.city', city);
      }

      // ==========================================
      // Search
      // ==========================================

      if (cleanSearch) {
        query = query.or(
          `title.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`
        );
      }

      // ==========================================
      // Execute query
      // ==========================================

      const { data, count, error } = await query.range(from, to);

      if (error) {
        logApiError('getAllRequests', error);

        return {
          data: [],
          totalCount: 0,
          totalPages: 0,
          currentPage: page,
        };
      }

      const totalCount = count ?? 0;

      return {
        data: (data as Request[]) ?? [],
        totalCount,
        totalPages: totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0,
        currentPage: page,
      };
    } catch (error) {
      logApiError('getAllRequests', error);

      return {
        data: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }
  },

  // ==========================================
  // GET SINGLE REQUEST
  // ==========================================

  async getSingleRequest(id: string): Promise<Request | null> {
    try {
      const { data, error } = await supabase
        .from('requests')
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
        logApiError('getSingleRequest', error);

        return null;
      }

      return data as Request | null;
    } catch (error) {
      logApiError('getSingleRequest', error);

      return null;
    }
  },

  // ==========================================
  // GET REQUESTS BY TECHNICIAN
  // ==========================================

  async getRequestsByTechnician(technicianId: string): Promise<Request[]> {
    try {
      const { data, error } = await supabase
        .from('requests')
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
        logApiError('getRequestsByTechnician', error);

        return [];
      }

      return (data as Request[]) ?? [];
    } catch (error) {
      logApiError('getRequestsByTechnician', error);

      return [];
    }
  },

  async create(payload: CreateRequestDto): Promise<Request | null> {
    try {
      // ==========================================
      // CREATE REQUEST
      // ==========================================

      const { data, error } = await supabase
        .from('requests')
        .insert({
          ...payload,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        logApiError('create', error);
        return null;
      }

      // ==========================================
      // SEND NOTIFICATION
      // ==========================================

      if (!payload?.technician_id) {
        logApiError('Error', 'No technician_id. Notification skipped.');

        return data as Request;
      }

      const priority = payload.priority;
      const isUrgent = priority === 'urgent' ? true : false;

      await sendNotification({
        userId: payload.technician_id,
        senderId:payload.technician_id,
        type: isUrgent ? 'urgent_requests' : 'new_requests',
        title: isUrgent ? 'Urgent repair request' : 'New repair request',
        body: payload.title || 'You have received a new repair request.',
        data: {
          request_id: data.id,
        },
      });

      return data as Request;
    } catch (error) {
      logApiError('create', error);
      return null;
    }
  },

  // ==========================================
  // UPDATE
  // ==========================================

  async update(id: string, payload: UpdateRequestDto): Promise<Request | null> {
    try {
      const { data, error } = await supabase
        .from('requests')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logApiError('update', error);
        return null;
      }

      return data as Request;
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
        .from('requests')
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
  // DELETE
  // ==========================================

  async remove(id: string): Promise<boolean> {
    try {
      // ==========================================
      // Get request images
      // ==========================================

      const { data: request, error: fetchError } = await supabase
        .from('requests')
        .select('images')
        .eq('id', id)
        .single();

      if (fetchError) {
        logApiError('remove', fetchError);

        return false;
      }

      const images = Array.isArray(request?.images) ? request.images : [];

      // ==========================================
      // Delete request
      // ==========================================

      const { error: deleteError } = await supabase
        .from('requests')
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
          await deleteRequestImages(images);
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
