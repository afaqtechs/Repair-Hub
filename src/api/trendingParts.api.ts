import { supabase } from '@/src/lib/supabase';
import { Part } from '@/types/parts';

const logApiError = (method: string, error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.log(`[trendingPartsApi.${method}]`, message);
};

export const trendingPartsApi = {
  async getTrendingParts(limit = 50): Promise<Part[]> {
    try {
      const { data, error } = await supabase.rpc('get_trending_parts', {
        p_limit: limit,
      });

      if (error) {
        logApiError('getTrendingParts', error);
        return [];
      }

      return (data ?? []) as Part[];
    } catch (error) {
      logApiError('getTrendingParts', error);
      return [];
    }
  },
};