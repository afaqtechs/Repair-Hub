
import { useQuery } from '@tanstack/react-query';
import { trendingPartsApi } from '../api';

export const TRENDING_PART_KEYS = {
  all: ['trending-parts'] as const,

  list: (limit: number) =>
    [...TRENDING_PART_KEYS.all, limit] as const,
};

/**
 * Fetch trending parts based on views and saves.
 */
export function useTrendingParts(limit = 50) {
  return useQuery({
    queryKey: TRENDING_PART_KEYS.list(limit),
    queryFn: () => trendingPartsApi.getTrendingParts(limit),
    staleTime: 1000 * 60 * 5,
  });
}