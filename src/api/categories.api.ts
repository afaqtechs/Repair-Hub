import { supabase } from '@/src/lib/supabase';
import { Category } from '@/types/category';

// ─────────────────────────────────────────────
// API error helper
// ─────────────────────────────────────────────

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);

  console.log(`[categoriesApi.${method}]`, message);
};

// ─────────────────────────────────────────────
// Categories API
// ─────────────────────────────────────────────

export const categoriesApi = {
  // ─────────────────────────────────────────────
  // Get all categories
  // ─────────────────────────────────────────────

  async getAll(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
  // Get single category
  // ─────────────────────────────────────────────

  async getSingle(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        logApiError('getSingle', error);
        return null;
      }

      return data as Category | null;
    } catch (error) {
      logApiError('getSingle', error);
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Create category
  // ─────────────────────────────────────────────

  async create(
    payload: Pick<Category, 'name' | 'slug'>
  ): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
  // Update category
  // ─────────────────────────────────────────────

  async update(
    id: string,
    payload: Partial<Category>
  ): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
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
  // Remove category
  // ─────────────────────────────────────────────

  async remove(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);

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

  // ─────────────────────────────────────────────
  // Get parts by category
  // ─────────────────────────────────────────────

  async getPartsByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select(
          `
            *,
            technician:profiles!inner(*,is_active),
            category:categories(*),
            condition:conditions(*),
            platform:platforms(*)
          `
        )
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .eq('technician.is_active', true)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError('getPartsByCategory', error);

        return [];
      }

      return data || [];
    } catch (error) {
      logApiError('getPartsByCategory', error);

      return [];
    }
  },

  // ─────────────────────────────────────────────
  // Get services by category
  // ─────────────────────────────────────────────

  async getServicesByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select(
          `
            *,
            technician:profiles!inner(*,is_active),
            category:categories(*),
            platform:platforms(*)
          `
        )
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .eq('technician.is_active', true)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError('getServicesByCategory', error);

        return [];
      }

      return data || [];
    } catch (error) {
      logApiError('getServicesByCategory', error);

      return [];
    }
  },
  
  async getRequestsByCategory(categoryId: string) {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(
          `
            *,
            technician:profiles!inner(*,is_active),
            category:categories(*),
            platform:platforms(*)
          `
        )
        .eq('category_id', categoryId)
         .eq('is_active', true)
        .eq('technician.is_active', true)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        logApiError('getRequestsByCategory', error);

        return [];
      }

      return data || [];
    } catch (error) {
      logApiError('getRequestsByCategory', error);

      return [];
    }
  },
};

